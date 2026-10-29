"""Unit tests for app/database.py: engine configuration, session factory and
the request-scoped `get_db` dependency.

The module reads DATABASE_URL at import time, so configuration cases load a
private copy of the file under another name. Reloading `app.database` itself
would replace `Base` and `SessionLocal` out from under the models and the other
tests.
"""

import importlib.util
from pathlib import Path
from types import ModuleType

import pytest
from sqlalchemy import text
from sqlalchemy.orm import DeclarativeBase, Session

from app import database

DATABASE_FILE = Path(database.__file__)


def load_fresh_copy(monkeypatch: pytest.MonkeyPatch, url: str | None) -> ModuleType:
    if url is None:
        monkeypatch.delenv("DATABASE_URL", raising=False)
    else:
        monkeypatch.setenv("DATABASE_URL", url)
    spec = importlib.util.spec_from_file_location("app_database_copy", DATABASE_FILE)
    assert spec is not None and spec.loader is not None
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_default_url_is_sqlite_when_unset(monkeypatch: pytest.MonkeyPatch) -> None:
    module = load_fresh_copy(monkeypatch, None)

    assert module.DATABASE_URL == "sqlite:///./app.db"
    assert module.engine.dialect.name == "sqlite"


def test_database_url_env_var_is_honoured(monkeypatch: pytest.MonkeyPatch) -> None:
    module = load_fresh_copy(monkeypatch, "sqlite:///:memory:")

    assert module.DATABASE_URL == "sqlite:///:memory:"
    assert str(module.engine.url) == "sqlite:///:memory:"


def test_sqlite_connection_may_cross_threads(monkeypatch: pytest.MonkeyPatch) -> None:
    """FastAPI runs sync dependencies in a threadpool, so a SQLite connection
    must be usable from a thread other than the one that opened it."""
    import threading

    module = load_fresh_copy(monkeypatch, "sqlite:///:memory:")
    errors: list[BaseException] = []

    with module.engine.connect() as connection:

        def use_connection() -> None:
            try:
                connection.execute(text("SELECT 1"))
            except BaseException as exc:  # noqa: BLE001 - reported below
                errors.append(exc)

        worker = threading.Thread(target=use_connection)
        worker.start()
        worker.join()

    assert errors == []


def test_non_sqlite_url_gets_no_sqlite_connect_args(monkeypatch: pytest.MonkeyPatch) -> None:
    """create_engine is not connected eagerly, so a Postgres URL can be built
    here without a server; it must not be handed SQLite-only arguments."""
    module = load_fresh_copy(
        monkeypatch, "postgresql+psycopg://user:pw@localhost:5432/example"
    )

    assert module.engine.dialect.name == "postgresql"
    assert "check_same_thread" not in module._connect_args
    assert module._connect_args == {}


def test_base_is_a_declarative_base_models_can_inherit() -> None:
    assert issubclass(database.Base, DeclarativeBase)

    class Probe(database.Base):
        __tablename__ = "database_probe_table"
        from sqlalchemy.orm import Mapped, mapped_column

        id: Mapped[int] = mapped_column(primary_key=True)

    try:
        assert "database_probe_table" in database.Base.metadata.tables
    finally:
        database.Base.metadata.remove(Probe.__table__)


def test_session_factory_is_bound_to_the_engine_with_expected_flags() -> None:
    session = database.SessionLocal()
    try:
        assert isinstance(session, Session)
        assert session.get_bind() is database.engine
        assert session.autoflush is False
        assert session.expire_on_commit is False
    finally:
        session.close()


def test_get_db_yields_a_usable_session() -> None:
    generator = database.get_db()
    session = next(generator)
    try:
        assert isinstance(session, Session)
        assert session.execute(text("SELECT 1")).scalar() == 1
    finally:
        generator.close()


def test_get_db_closes_the_session_after_normal_use(monkeypatch: pytest.MonkeyPatch) -> None:
    closed: list[Session] = []
    original_close = Session.close

    def tracking_close(self: Session) -> None:
        closed.append(self)
        original_close(self)

    monkeypatch.setattr(Session, "close", tracking_close)

    generator = database.get_db()
    session = next(generator)
    assert closed == []

    with pytest.raises(StopIteration):
        next(generator)

    assert closed == [session]


def test_get_db_closes_the_session_when_the_handler_raises(
    monkeypatch: pytest.MonkeyPatch,
) -> None:
    closed: list[Session] = []
    original_close = Session.close

    def tracking_close(self: Session) -> None:
        closed.append(self)
        original_close(self)

    monkeypatch.setattr(Session, "close", tracking_close)

    generator = database.get_db()
    session = next(generator)

    with pytest.raises(RuntimeError, match="handler failed"):
        generator.throw(RuntimeError("handler failed"))

    assert closed == [session]


def test_get_db_gives_each_call_its_own_session() -> None:
    first_gen, second_gen = database.get_db(), database.get_db()
    first, second = next(first_gen), next(second_gen)
    try:
        assert first is not second
    finally:
        first_gen.close()
        second_gen.close()
