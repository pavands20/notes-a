"""Unit tests for app/models.py: the Note model's mapping and column rules.

Mapping checks read the declared metadata. Behaviour checks (server default,
NOT NULL, length limit) run against the real database in DATABASE_URL inside a
transaction that is always rolled back, so no rows are left behind.
"""

from datetime import datetime, timedelta

import pytest
from sqlalchemy import DateTime, String, inspect
from sqlalchemy.exc import DataError, IntegrityError
from sqlalchemy.orm import Session

from app import models
from app.database import Base, engine
from app.models import Note


@pytest.fixture
def session():
    connection = engine.connect()
    transaction = connection.begin()
    db = Session(bind=connection, autoflush=False, expire_on_commit=False)
    try:
        yield db
    finally:
        db.close()
        transaction.rollback()
        connection.close()


def test_note_is_registered_on_the_shared_base() -> None:
    assert issubclass(Note, Base)
    assert Base.metadata.tables["notes"] is Note.__table__
    assert models.Base is Base


def test_models_public_exports() -> None:
    assert set(models.__all__) == {"Base", "Note"}


def test_note_table_has_exactly_the_expected_columns() -> None:
    assert Note.__tablename__ == "notes"
    assert set(Note.__table__.columns.keys()) == {"id", "text", "created_at"}


def test_id_is_the_sole_primary_key() -> None:
    assert [c.name for c in inspect(Note).primary_key] == ["id"]


def test_text_column_is_a_required_string_of_280() -> None:
    column = Note.__table__.c.text
    assert isinstance(column.type, String)
    assert column.type.length == 280
    assert column.nullable is False


def test_created_at_is_a_required_timezone_aware_server_defaulted_column() -> None:
    column = Note.__table__.c.created_at
    assert isinstance(column.type, DateTime)
    assert column.type.timezone is True
    assert column.nullable is False
    assert column.server_default is not None


def test_note_can_be_built_with_text_only() -> None:
    note = Note(text="hello")
    assert note.text == "hello"
    assert note.id is None
    assert note.created_at is None


def test_insert_assigns_id_and_timezone_aware_created_at(session: Session) -> None:
    note = Note(text="unit-models-insert")
    session.add(note)
    session.flush()
    session.refresh(note)

    assert isinstance(note.id, int)
    assert isinstance(note.created_at, datetime)
    assert note.created_at.tzinfo is not None
    assert abs(datetime.now(note.created_at.tzinfo) - note.created_at) < timedelta(minutes=5)


def test_ids_increase_across_inserts(session: Session) -> None:
    first, second = Note(text="unit-models-a"), Note(text="unit-models-b")
    session.add_all([first, second])
    session.flush()
    assert second.id > first.id


def test_text_of_exactly_280_characters_is_stored_intact(session: Session) -> None:
    value = "x" * 280
    note = Note(text=value)
    session.add(note)
    session.flush()
    session.expire(note)
    assert note.text == value


def test_text_over_280_characters_is_rejected(session: Session) -> None:
    session.add(Note(text="x" * 281))
    with pytest.raises(DataError):
        session.flush()


def test_missing_text_is_rejected(session: Session) -> None:
    session.add(Note())
    with pytest.raises(IntegrityError):
        session.flush()


def test_explicit_null_text_is_rejected(session: Session) -> None:
    session.add(Note(text=None))
    with pytest.raises(IntegrityError):
        session.flush()


def test_unicode_text_round_trips(session: Session) -> None:
    value = "héllo ✓ 日本語 <b>&</b>"
    note = Note(text=value)
    session.add(note)
    session.flush()
    session.expire(note)
    assert note.text == value
