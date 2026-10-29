"""Notes endpoints. No auth by design."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Note
from app.schemas import NoteCreate, NoteOut

router = APIRouter(prefix="/notes", tags=["notes"])
Db = Annotated[Session, Depends(get_db)]


@router.get("", response_model=list[NoteOut])
def list_notes(db: Db) -> list[Note]:
    return list(db.scalars(select(Note).order_by(Note.created_at.desc(), Note.id.desc())))


@router.post("", response_model=NoteOut, status_code=201)
def create_note(body: NoteCreate, db: Db) -> Note:
    note = Note(text=body.text)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.delete("/{note_id}", status_code=204)
def delete_note(note_id: int, db: Db) -> Response:
    note = db.get(Note, note_id)
    if note is None:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(note)
    db.commit()
    return Response(status_code=204)
