"""Unit tests for app/main.py: app metadata, CORS configuration, router wiring.

ALLOWED_ORIGINS is read when the module is imported, so each test loads a fresh
copy of main.py under a throwaway module name instead of reloading `app.main`
(which other test modules hold a reference to).
"""

import importlib.util
from pathlib import Path

import pytest
from fastapi import FastAPI
from fastapi.testclient import TestClient

MAIN_PATH = Path(__file__).resolve().parent.parent / "app" / "main.py"
DEV_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]


def load_app(monkeypatch: pytest.MonkeyPatch, allowed_origins: str | None) -> FastAPI:
    if allowed_origins is None:
        monkeypatch.delenv("ALLOWED_ORIGINS", raising=False)
    else:
        monkeypatch.setenv("ALLOWED_ORIGINS", allowed_origins)
    spec = importlib.util.spec_from_file_location("app_main_under_test", MAIN_PATH)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.app


def preflight(app: FastAPI, origin: str, method: str = "POST"):
    return TestClient(app).options(
        "/notes",
        headers={"Origin": origin, "Access-Control-Request-Method": method},
    )


def test_app_metadata_identifies_the_service() -> None:
    from app.main import app

    assert app.title == "Notes A"
    assert app.version == "0.1.0"


def test_notes_routes_are_mounted() -> None:
    from app.main import app

    paths = TestClient(app).get("/openapi.json").json()["paths"]

    assert set(paths["/notes"]) == {"get", "post"}
    assert set(paths["/notes/{note_id}"]) == {"delete"}


def test_no_allowed_origins_falls_back_to_the_vite_dev_server(monkeypatch) -> None:
    app = load_app(monkeypatch, None)

    for origin in DEV_ORIGINS:
        r = preflight(app, origin)
        assert r.status_code == 200
        assert r.headers["access-control-allow-origin"] == origin


def test_blank_allowed_origins_falls_back_to_the_dev_origins(monkeypatch) -> None:
    app = load_app(monkeypatch, " , ,")

    r = preflight(app, DEV_ORIGINS[0])

    assert r.headers["access-control-allow-origin"] == DEV_ORIGINS[0]


def test_allowed_origins_env_replaces_the_dev_origins(monkeypatch) -> None:
    app = load_app(monkeypatch, "https://notes.example.com")

    allowed = preflight(app, "https://notes.example.com")
    dev = preflight(app, DEV_ORIGINS[0])

    assert allowed.headers["access-control-allow-origin"] == "https://notes.example.com"
    assert "access-control-allow-origin" not in dev.headers
    assert dev.status_code == 400


def test_allowed_origins_accepts_a_comma_separated_list_with_spaces(monkeypatch) -> None:
    app = load_app(monkeypatch, " https://a.example.com , https://b.example.com ")

    for origin in ("https://a.example.com", "https://b.example.com"):
        assert preflight(app, origin).headers["access-control-allow-origin"] == origin
    assert "access-control-allow-origin" not in preflight(app, "https://c.example.com").headers


def test_unlisted_origin_is_rejected_on_preflight(monkeypatch) -> None:
    app = load_app(monkeypatch, "https://notes.example.com")

    r = preflight(app, "https://evil.example.com")

    assert r.status_code == 400
    assert "access-control-allow-origin" not in r.headers


def test_cors_allows_delete_and_arbitrary_headers(monkeypatch) -> None:
    app = load_app(monkeypatch, "https://notes.example.com")

    r = TestClient(app).options(
        "/notes/1",
        headers={
            "Origin": "https://notes.example.com",
            "Access-Control-Request-Method": "DELETE",
            "Access-Control-Request-Headers": "authorization, x-custom",
        },
    )

    assert r.status_code == 200
    assert "DELETE" in r.headers["access-control-allow-methods"]
    assert "x-custom" in r.headers["access-control-allow-headers"].lower()


def test_cors_headers_are_added_to_a_simple_response(monkeypatch) -> None:
    app = load_app(monkeypatch, "https://notes.example.com")

    r = TestClient(app).get("/health", headers={"Origin": "https://notes.example.com"})

    assert r.status_code == 200
    assert r.headers["access-control-allow-origin"] == "https://notes.example.com"
    assert r.headers["access-control-allow-credentials"] == "true"


def test_health_is_get_only() -> None:
    from app.main import app

    assert TestClient(app).post("/health").status_code == 405
