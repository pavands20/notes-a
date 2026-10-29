# API Reference

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start endpoints -->
| Method | Path | Handler | Source | Summary |
|---|---|---|---|---|
| GET | /health | health | `backend/app/main.py:34` | Liveness probe. |
| GET | /notes | list_notes | `backend/app/routers/notes.py:17` | — |
| POST | /notes | create_note | `backend/app/routers/notes.py:22` | — |
| DELETE | /notes/{note_id} | delete_note | `backend/app/routers/notes.py:31` | — |
<!-- sdlc:auto:end endpoints -->

<!-- sdlc:auto:start drift -->
**Designed but missing:**

- DELETE /notes/{id}

**Code only:**

- DELETE /notes/{note_id}
<!-- sdlc:auto:end drift -->

<!-- sdlc:auto:start source -->
Generated from commit `e9b2c94`
<!-- sdlc:auto:end source -->
