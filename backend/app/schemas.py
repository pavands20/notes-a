"""Pydantic request and response models."""

from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class NoteCreate(BaseModel):
    text: str

    @field_validator("text")
    @classmethod
    def _check_text(cls, value: str) -> str:
        # Stored exactly as submitted; only emptiness and length are checked.
        if not value.strip():
            raise ValueError("text must not be empty or whitespace-only")
        if len(value) > 280:
            raise ValueError("text must be at most 280 characters")
        return value


class NoteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    text: str
    created_at: datetime
