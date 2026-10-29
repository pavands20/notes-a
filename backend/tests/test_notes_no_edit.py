"""Notes are not editable: PUT/PATCH rejected, text unchanged. Real PostgreSQL."""

import os
import uuid

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text

from app.main import app

DATABASE_URL = os.environ["DATABASE_URL"]
MARK = "qa-us002-noedit-"

client = TestClient(app)
engine = create_engine(DATABASE_URL, pool_pre_ping=True)


@pytest.fixture(autouse=True)
def cleanup():
    yield
    with engine.begin() as c:
        c.execute(text("DELETE FROM notes WHERE text LIKE :p"), {"p": MARK + "%"})


def make() -> dict:
    r = client.post("/notes", json={"text": f"{MARK}{uuid.uuid4().hex}"})
    assert r.status_code == 201, r.text
    return r.json()


def stored_text(note_id: int) -> str | None:
    with engine.connect() as c:
        return c.execute(text("SELECT text FROM notes WHERE id=:i"), {"i": note_id}).scalar_one_or_none()


@pytest.mark.parametrize("method", ["put", "patch"])
def test_ac013_put_patch_rejected_and_text_unchanged(method):
    note = make()
    r = getattr(client, method)(f"/notes/{note['id']}", json={"text": "changed"})
    assert r.status_code in (405, 404), r.text
    assert stored_text(note["id"]) == note["text"]
    listed = [n for n in client.get("/notes").json() if n["id"] == note["id"]]
    assert listed[0]["text"] == note["text"]


def test_ac013_openapi_lists_no_put_or_patch_for_note():
    r = client.get("/openapi.json")
    assert r.status_code == 200
    paths = r.json()["paths"]
    for path, ops in paths.items():
        if path.startswith("/notes/"):
            assert "put" not in ops, path
            assert "patch" not in ops, path
    assert "/notes/{note_id}" in paths
