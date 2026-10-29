"""Unit tests for app/schemas.py: NoteCreate validation and NoteOut mapping."""

from datetime import datetime, timezone
from types import SimpleNamespace

import pytest
from pydantic import ValidationError

from app.schemas import NoteCreate, NoteOut


def test_note_create_accepts_ordinary_text() -> None:
    assert NoteCreate(text="hello").text == "hello"


def test_note_create_accepts_exactly_280_characters() -> None:
    text = "a" * 280
    assert NoteCreate(text=text).text == text


def test_note_create_rejects_281_characters() -> None:
    with pytest.raises(ValidationError) as exc:
        NoteCreate(text="a" * 281)
    assert "280" in str(exc.value)


@pytest.mark.parametrize("text", ["", " ", "   ", "\t", "\n", " \t\r\n "])
def test_note_create_rejects_empty_or_whitespace_only(text: str) -> None:
    with pytest.raises(ValidationError) as exc:
        NoteCreate(text=text)
    assert "empty" in str(exc.value)


def test_note_create_stores_text_exactly_as_submitted() -> None:
    text = "  padded text \n"
    assert NoteCreate(text=text).text == text


def test_note_create_length_counts_untrimmed_text() -> None:
    # 280 characters including surrounding whitespace is fine; 281 is not.
    assert NoteCreate(text=" " + "a" * 279).text == " " + "a" * 279
    with pytest.raises(ValidationError):
        NoteCreate(text=" " + "a" * 280)


def test_note_create_counts_characters_not_bytes() -> None:
    assert NoteCreate(text="é" * 280).text == "é" * 280


def test_note_create_requires_text() -> None:
    with pytest.raises(ValidationError):
        NoteCreate()  # type: ignore[call-arg]


@pytest.mark.parametrize("value", [None, 123, ["a"], {"a": 1}])
def test_note_create_rejects_non_string_text(value: object) -> None:
    with pytest.raises(ValidationError):
        NoteCreate(text=value)  # type: ignore[arg-type]


def test_note_out_serialises_all_fields() -> None:
    created = datetime(2026, 1, 2, 3, 4, 5, tzinfo=timezone.utc)
    out = NoteOut(id=1, text="hi", created_at=created)
    assert out.model_dump() == {"id": 1, "text": "hi", "created_at": created}


def test_note_out_reads_from_object_attributes() -> None:
    created = datetime(2026, 1, 2, 3, 4, 5, tzinfo=timezone.utc)
    row = SimpleNamespace(id=7, text="from orm", created_at=created)
    out = NoteOut.model_validate(row)
    assert (out.id, out.text, out.created_at) == (7, "from orm", created)


def test_note_out_does_not_apply_create_validation() -> None:
    # Responses mirror what is stored; they are not re-validated as input.
    assert NoteOut(id=1, text="", created_at=datetime.now(timezone.utc)).text == ""


def test_note_out_requires_every_field() -> None:
    with pytest.raises(ValidationError) as exc:
        NoteOut.model_validate(SimpleNamespace(id=1))
    missing = {e["loc"][0] for e in exc.value.errors()}
    assert missing == {"text", "created_at"}


def test_note_out_json_uses_iso_timestamp() -> None:
    created = datetime(2026, 1, 2, 3, 4, 5, tzinfo=timezone.utc)
    payload = NoteOut(id=1, text="hi", created_at=created).model_dump_json()
    assert "2026-01-02T03:04:05" in payload
