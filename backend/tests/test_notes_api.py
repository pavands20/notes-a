"""Notes API acceptance tests against the real PostgreSQL in DATABASE_URL."""

import os
import subprocess
import sys
import uuid
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text

from app.main import app

BACKEND_DIR = Path(__file__).resolve().parent.parent
DATABASE_URL = os.environ["DATABASE_URL"]
MARK = "qa-us008-"

client = TestClient(app)
engine = create_engine(DATABASE_URL, pool_pre_ping=True)


def count() -> int:
    with engine.connect() as c:
        return c.execute(text("SELECT count(*) FROM notes")).scalar_one()


@pytest.fixture(autouse=True)
def cleanup():
    yield
    with engine.begin() as c:
        c.execute(text("DELETE FROM notes WHERE text LIKE :p"), {"p": MARK + "%"})
        c.execute(text("DELETE FROM notes WHERE text LIKE '<script>%'"))


def make(suffix: str = "") -> dict:
    r = client.post("/notes", json={"text": f"{MARK}{uuid.uuid4().hex}{suffix}"})
    assert r.status_code == 201, r.text
    return r.json()


def test_ac022_post_valid_returns_201_with_id_and_timestamp():
    body = make()
    assert isinstance(body["id"], int)
    assert body["created_at"]
    assert body["text"].startswith(MARK)


def test_ac021_list_newest_first_no_pagination():
    ids = [make()["id"] for _ in range(60)]
    r = client.get("/notes")
    assert r.status_code == 200
    rows = r.json()
    for row in rows:
        assert {"id", "text", "created_at"} <= set(row)
    mine = [x["id"] for x in rows if x["text"].startswith(MARK)]
    assert len(mine) == 60
    assert mine == sorted(ids, reverse=True)
    stamps = [x["created_at"] for x in rows]
    assert stamps == sorted(stamps, reverse=True)


@pytest.mark.parametrize("bad", ["", "   ", "\t\n ", "a" * 281, "a" * 1000])
def test_ac010_nfr002_invalid_text_rejected_and_not_stored(bad):
    before = count()
    r = client.post("/notes", json={"text": bad})
    assert 400 <= r.status_code < 500
    assert count() == before


@pytest.mark.parametrize("payload", [{}, {"text": None}, {"text": 5}])
def test_nfr002_missing_or_malformed_text_rejected(payload):
    before = count()
    r = client.post("/notes", json=payload)
    assert 400 <= r.status_code < 500
    assert count() == before


def test_ac011_exactly_280_chars_accepted():
    body = client.post("/notes", json={"text": MARK + "a" * (280 - len(MARK))})
    assert body.status_code == 201
    assert len(body.json()["text"]) == 280


def test_ac023_delete_existing_hard_deletes():
    n = make()
    r = client.delete(f"/notes/{n['id']}")
    assert r.status_code in (200, 204)
    with engine.connect() as c:
        left = c.execute(
            text("SELECT count(*) FROM notes WHERE id=:i"), {"i": n["id"]}
        ).scalar_one()
    assert left == 0
    assert n["id"] not in [x["id"] for x in client.get("/notes").json()]


def test_ac017_delete_unknown_id_404():
    n = make()
    client.delete(f"/notes/{n['id']}")
    assert client.delete(f"/notes/{n['id']}").status_code == 404
    assert client.delete("/notes/999999999").status_code == 404


def test_ac016_ac025_no_auth_needed_and_put_patch_405():
    n = make()
    assert "authorization" not in {k.lower() for k in client.headers}
    assert client.get("/notes").status_code == 200
    assert client.put(f"/notes/{n['id']}", json={"text": "x"}).status_code == 405
    assert client.patch(f"/notes/{n['id']}", json={"text": "x"}).status_code == 405


def test_ac007_markup_stored_byte_for_byte():
    raw = "<script>alert(1)</script>"
    r = client.post("/notes", json={"text": raw})
    assert r.status_code == 201
    assert r.json()["text"] == raw
    listed = [x for x in client.get("/notes").json() if x["id"] == r.json()["id"]]
    assert listed[0]["text"] == raw
    with engine.connect() as c:
        stored = c.execute(
            text("SELECT text FROM notes WHERE id=:i"), {"i": r.json()["id"]}
        ).scalar_one()
    assert stored == raw


def test_ac018_ac019_nfr003_persisted_across_new_engine_session():
    n = make()
    fresh = create_engine(DATABASE_URL)
    try:
        with fresh.connect() as c:
            t = c.execute(text("SELECT text FROM notes WHERE id=:i"), {"i": n["id"]}).scalar_one()
        assert t == n["text"]
    finally:
        fresh.dispose()
    # a brand-new app client also sees it
    with TestClient(app) as other:
        assert n["id"] in [x["id"] for x in other.get("/notes").json()]


def test_ac024_nfr004_alembic_upgrade_head_on_empty_schema():
    schema = "qa_" + uuid.uuid4().hex[:10]
    with engine.begin() as c:
        c.execute(text(f'CREATE SCHEMA "{schema}"'))
    sep = "&" if "?" in DATABASE_URL else "?"
    scoped = f"{DATABASE_URL}{sep}options=-csearch_path%3D{schema}"
    env = {**os.environ, "DATABASE_URL": scoped}
    try:
        p = subprocess.run(
            [sys.executable, "-m", "alembic", "upgrade", "head"],
            cwd=BACKEND_DIR,
            env=env,
            capture_output=True,
            text=True,
            timeout=120,
        )
        assert p.returncode == 0, p.stdout + p.stderr
        with engine.connect() as c:
            found = c.execute(
                text(
                    "SELECT count(*) FROM information_schema.tables "
                    "WHERE table_schema=:s AND table_name='notes'"
                ),
                {"s": schema},
            ).scalar_one()
        assert found == 1
        scoped_engine = create_engine(scoped)
        try:
            with scoped_engine.connect() as c:
                assert c.execute(text("SELECT count(*) FROM notes")).scalar_one() == 0
        finally:
            scoped_engine.dispose()
    finally:
        with engine.begin() as c:
            c.execute(text(f'DROP SCHEMA "{schema}" CASCADE'))
