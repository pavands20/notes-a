# Product Requirements

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
## Summary

### REQ-SCOPE · draft · source: requirements:scope

Delivery scope is lightweight, at requirements version 1. Scope is a single page to add, list and delete short notes, backed by a REST API and Postgres. Login, uploads, AI, editing, search, tags and sharing are explicitly excluded.

- Delivery scope: lightweight
- Requirements version: 1
- Capabilities in scope:
  - Shared notes list, newest first, with timestamps
  - Add a short plain-text note
  - Rejection of empty and over-length notes
  - Permanent delete of any note
  - Notes saved between visits
  - Notes service for listing, adding and deleting
  - Setup and usage guide
  - 280-character plain-text limit
  - Notes cannot be edited
  - Delete is permanent, with no confirmation or undo
  - Anyone can delete anyone's note (no login)
  - No rate limiting, spam protection or pagination
- Out of scope (do not design or build):
  - User login / accounts
  - File uploads
  - AI features
  - Editing notes, search, tags and sharing
- The functional requirements summary is a plain-English restatement of the stories. It adds no scope.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006

- ⚠ No sign-off or approval of the requirements set itself is recorded. Only the technology stack is stated as approved by the product owner.

### REQ-STACK · approved · source: requirements:technology_stack

The product owner approved the technology stack. Design must use exactly these technologies with no substitution: FastAPI 0.115, PostgreSQL 16, React 19 and AWS.

- Backend: FastAPI 0.115
  - Serves the REST API (GET/POST/DELETE /notes).
  - Checks the 280-character limit and rejects empty notes with little code.
  - Generates API docs automatically.
  - Fits the assumed SQLAlchemy + Alembic setup.
- Database: PostgreSQL 16
  - Specified by the user.
  - Notes are simple rows (text + creation timestamp) at small volume.
  - Newest-first sorting is a simple query.
- Frontend: React 19 (with Vite)
  - Specified by the user and kept unchanged.
  - The single-page add/list/delete interface is small.
- Cloud: AWS
  - No assumption named a cloud, so the platform default was used.
  - Runs the assumed Docker Compose setup (API + DB containers) on one small server.
  - Traffic is low and there is no deadline, so one small instance is enough.

**Related:** EPIC-005, US-008, US-009, NFR-004, NFR-005, NFR-009

- ⚠ AWS was chosen as the platform default, not named by the user. It is approved, but no specific AWS service or instance type is specified.
- ⚠ The approval date and approver identity are not recorded beyond 'product owner'.

### US-001 · draft · source: requirements:US-001

Priority high. Visitors see all notes in one list, newest first, each with its creation time. An empty-state message is shown when there are no notes, and there is no pagination.

Epic EPIC-001 (Shared notes list):
- One shared list visible to anyone.
- Assumptions: no login; small traffic and data, so no pagination.

Story: a visitor views all notes newest first with creation timestamps, to read what has been shared and how recent it is.

Acceptance criteria:
- AC-001: With several notes at different times, opening the page lists all notes in descending creation order.
- AC-002: Each displayed note shows its text and a creation timestamp.
- AC-003: With no notes, an empty-state message is shown instead of a blank area, and no error appears.
- AC-004: With more notes than fit on screen, all notes are returned and shown without pagination.

**Related:** EPIC-001, AC-001, AC-002, AC-003, AC-004, NFR-007, NFR-009

- ⚠ Timestamp display format and timezone are not specified.
- ⚠ Empty-state message wording is not specified.

### US-002 · draft · source: requirements:US-002

Priority medium. Every visitor sees the same shared list. A note added by one visitor appears for others on open or reload, with no login.

Story: a visitor sees the same notes as every other visitor, so the list works as one shared board.

Acceptance criteria:
- AC-005: If visitor A adds a note, visitor B sees it on opening or reloading the page, without logging in.

**Related:** EPIC-001, AC-005, NFR-010

- ⚠ Live updates without reload are not required by the ACs. Confirm reload-only visibility is intended.

### US-003 · draft · source: requirements:US-003

Priority critical. Visitors type and submit a 1-280 character plain-text note. The note appears at the top with a timestamp, and the input clears. HTML or script characters are shown literally.

Epic EPIC-002 (Add notes):
- Plain text only, maximum 280 characters.
- Notes cannot be edited.
- No rate limiting or spam protection.

Story: a visitor types a note and submits it to add it to the shared list.

Acceptance criteria:
- AC-006: Submitting 1-280 characters places the note at the top of the list with a timestamp and clears the input.
- AC-007: A note containing HTML or script-like characters is displayed as literal plain text, not markup.

**Related:** EPIC-002, AC-006, AC-007, NFR-001, NFR-008

- ⚠ The submit trigger is not specified (button, Enter key, or both).
- ⚠ Line breaks / multiline input are not specified.

### US-004 · draft · source: requirements:US-004

Priority high. Empty, whitespace-only and over-280-character notes are rejected with a clear message in the UI and a 4xx error from the API. Exactly 280 characters is accepted.

Story: a visitor is told when a note is empty or too long, so they can correct it before saving.

Acceptance criteria:
- AC-008: Empty or whitespace-only input creates no note and shows a clear 'cannot be empty' message.
- AC-009: Input over 280 characters creates no note and shows a message stating the 280-character limit.
- AC-010: An empty or over-280 note sent directly to POST /notes gets a 4xx validation error, and nothing is stored.
- AC-011: Exactly 280 characters is accepted.

**Related:** EPIC-002, AC-008, AC-009, AC-010, AC-011, NFR-002, NFR-007

- ⚠ It is not specified whether surrounding whitespace is trimmed before the length check or before storage.
- ⚠ It is not specified how characters are counted (e.g. Unicode code points vs UTF-16 units vs bytes).
- ⚠ The exact 4xx code (400 vs 422) is not specified.

### US-005 · draft · source: requirements:US-005

Priority low. Notes are fixed once added. The UI offers no edit control, and the API has no update operation.

Story: notes stay fixed once added, keeping the list simple.

Acceptance criteria:
- AC-012: No edit control is offered on displayed notes.
- AC-013: PUT or PATCH /notes/{id} does not exist, and the API returns method-not-allowed or not-found.

**Related:** EPIC-002, AC-012, AC-013

- ⚠ AC-013 allows either 405 or 404. The expected response is ambiguous for testing.

### US-006 · draft · source: requirements:US-006

Priority high. Any visitor can delete any note instantly and permanently, with no confirmation or undo. Deleting an already-deleted note returns 404, and the UI refreshes safely.

Epic EPIC-003 (Delete notes):
- Permanent deletion with no confirmation or undo.
- No login, so anyone can delete anyone's note.

Story: a visitor deletes a note to remove it from the shared list.

Acceptance criteria:
- AC-014: Activating a note's delete control removes it immediately, with no confirmation dialog.
- AC-015: After deletion, the note does not appear on reload and is hard-deleted from the database, with no undo.
- AC-016: Deleting a note you did not create succeeds (no ownership).
- AC-017: DELETE /notes/{id} for a nonexistent id returns 404, and the UI refreshes the list without crashing.

**Related:** EPIC-003, AC-014, AC-015, AC-016, AC-017, NFR-007, NFR-008, NFR-010

### US-007 · draft · source: requirements:US-007

Priority critical. Notes persist in Postgres across browser reopen, backend restart and Docker Compose restart (when volumes are kept).

Epic EPIC-004 (Persistence): notes are stored in Postgres so they survive visits and restarts.

Story: a visitor finds their notes still there on return.

Acceptance criteria:
- AC-018: After closing and reopening the browser, the same notes are listed.
- AC-019: After the backend container restarts, the notes are still listed.
- AC-020: After a Docker Compose restart without removing volumes, the notes are still present.

**Related:** EPIC-004, AC-018, AC-019, AC-020, NFR-003

- ⚠ No backup or restore expectation is stated for the AWS-hosted database.

### US-008 · draft · source: requirements:US-008

Priority critical. The FastAPI REST service exposes GET, POST and DELETE on /notes, using SQLAlchemy and Alembic migrations on Postgres. It needs no auth, keys or external services, and applies no rate limiting.

Epic EPIC-005 (Notes service):
- FastAPI with GET/POST/DELETE /notes.
- SQLAlchemy for data access; Alembic for migrations on Postgres.
- No external services or API keys.
- No rate limiting or spam protection.

Story: a frontend developer gets REST endpoints to list, create and delete notes for the React app.

Acceptance criteria:
- AC-021: GET /notes returns 200 with all notes (id, text, created timestamp), newest first.
- AC-022: POST /notes with a valid 1-280 character body returns 201 with the created note, including id and timestamp.
- AC-023: DELETE /notes/{id} on an existing id removes the note and returns 200 or 204.
- AC-024: Alembic migrations on a fresh database create the notes table, and the service can serve requests.
- AC-025: The service needs no login, API key or external service, and applies no rate limiting.

**Related:** EPIC-005, AC-021, AC-022, AC-023, AC-024, AC-025, NFR-002, NFR-004, NFR-009, NFR-010

- ⚠ AC-023 allows 200 or 204. The success code is ambiguous.
- ⚠ The request/response JSON field names and the timestamp format (e.g. ISO 8601, UTC) are not specified.
- ⚠ The id type (integer vs UUID) is not specified.

### US-009 · draft · source: requirements:US-009

Priority medium. A README lets a developer start Postgres, FastAPI and React (Vite) with Docker Compose. It explains usage and the migration step, and documents all known limits and behaviours.

Epic EPIC-006 (Setup and usage guide):
- A short guide to run and use the app.
- Assumption: Docker Compose is used for running and deployment.

Story: a developer or operator uses the README to start the app and understand its behaviour.

Acceptance criteria:
- AC-026: With Docker, Docker Compose and the repo, following the README starts Postgres, FastAPI and React (Vite), and the app is reachable in a browser.
- AC-027: The guide explains adding, viewing and deleting notes, and the migration step.
- AC-028: The guide states:
  - the 280-character limit
  - no editing
  - permanent delete without confirmation
  - anyone can delete any note
  - no rate limiting, spam protection or pagination

**Related:** EPIC-006, AC-026, AC-027, AC-028, NFR-005, NFR-006

- ⚠ The README covers local Docker Compose. It is not stated whether AWS deployment steps must also be documented.

### NFR-001 · draft · source: requirements:NFR-001

Security. Note text is always displayed exactly as typed, so HTML or script characters render as literal text and never execute.

- Category: security
- Applies to: US-003
- Requirement: note text must always be displayed exactly as typed; HTML/script-like characters are shown literally and never run as part of the page.

**Related:** US-003, AC-007

### NFR-002 · draft · source: requirements:NFR-002

Security. The service validates every note server-side, even for requests that do not come from the app. Empty, whitespace-only and over-280 notes are rejected with a 4xx error and nothing is stored.

- Category: security
- Applies to: US-004, US-008
- Target:
  - 1-280 characters accepted.
  - Empty or longer rejected with a 4xx response, storing nothing.

**Related:** US-004, US-008, AC-010, AC-011

### NFR-003 · draft · source: requirements:NFR-003

Availability. Notes survive browser reopen, backend restart, and Docker Compose restart without volume removal.

- Category: availability
- Applies to: US-007
- Requirement: notes are kept in the database and remain listed after:
  - closing and reopening the browser
  - a backend restart
  - a Docker Compose restart that keeps stored data

**Related:** US-007, AC-018, AC-019, AC-020

### NFR-004 · draft · source: requirements:NFR-004

Maintainability. The database schema is created and changed only through migration scripts. Running them on a fresh database creates the notes table.

- Category: maintainability
- Applies to: US-008
- Requirement: schema changes happen only via migrations (Alembic per EPIC-005). Running them on a fresh database creates the notes table, and the service then serves requests.

**Related:** US-008, AC-024

### NFR-005 · draft · source: requirements:NFR-005

Maintainability. Database, backend and frontend all start together from the repository via Docker Compose, and the app is then reachable in a browser.

- Category: maintainability
- Applies to: US-009
- Requirement: one-step local start with Docker Compose on any machine with Docker.

**Related:** US-009, AC-026

### NFR-006 · draft · source: requirements:NFR-006

Maintainability. The guide documents how to run the app, the migration step, and all known limits and behaviours.

- Category: maintainability
- Applies to: US-009
- The guide must cover:
  - how to run the app
  - the migration step
  - the 280-character limit
  - no editing
  - permanent delete without confirmation
  - anyone can delete any note
  - no rate limiting, spam protection or pagination

**Related:** US-009, AC-027, AC-028

### NFR-007 · draft · source: requirements:NFR-007

Usability. Visitors get clear validation messages and a friendly empty-state message. The list refreshes without crashing if a note was already deleted.

- Category: usability
- Applies to: US-001, US-004, US-006
- Clear message for an empty or too-long note.
- Friendly empty-state message when there are no notes.
- Graceful list refresh if a note was already deleted by someone else.

**Related:** US-001, US-004, US-006, AC-003, AC-008, AC-009, AC-017

### NFR-008 · draft · source: requirements:NFR-008

Usability. Adds and deletes update the list immediately: the new note goes to the top, the input clears, and delete has no confirmation dialog.

- Category: usability
- Applies to: US-003, US-006
- The list updates immediately after an add or delete.
- A new note appears at the top.
- The input is cleared after adding.
- Delete shows no confirmation dialog.

**Related:** US-003, US-006, AC-006, AC-014

### NFR-009 · draft · source: requirements:NFR-009

Scalability, accepted risk. The system is built for low traffic and small data. All notes are returned without paging, on a single small server.

- Category: scalability (accepted risk)
- Applies to: US-001, US-008
- All notes are returned and shown in one list without pagination.
- Runs on a single small server.

**Related:** US-001, US-008, AC-004, AC-021, REQ-STACK

- ⚠ No threshold or trigger is defined for revisiting this risk if note volume grows.

### NFR-010 · draft · source: requirements:NFR-010

Security, accepted risk. A deliberate decision: no login, no note ownership, no rate limiting and no spam protection. Anyone can add or delete any note.

- Category: security (accepted risk)
- Applies to: US-002, US-006, US-008
- Decision: run with no login, no ownership, no rate limiting and no spam protection.
- The service needs no API key or outside service.

**Related:** US-002, US-006, US-008, AC-016, AC-025

- ⚠ The decision-maker and date of risk acceptance are not recorded.
- ⚠ Abuse or vandalism risk on a publicly reachable AWS host is accepted, but no monitoring or response is defined.

### NFR-011 · draft · source: requirements:NFR-011

Compliance, accepted risk. The app holds only short plain-text notes and no regulated data, so no industry-specific compliance applies.

- Category: compliance (accepted risk)
- Applies to: whole system
- Rationale: only short plain-text notes, no regulated data.

- ⚠ Free-text public notes could still receive personal data typed by visitors. This is not addressed; flagged for a human to confirm, not as a legal determination.
<!-- sdlc:auto:end narrative -->

<!-- sdlc:auto:start summary -->
**Requirements version:** v1  
**Delivery scope:** lightweight  
**Approved:** 2026-10-28

**Capabilities in scope:** Shared notes list, newest first with timestamps, Add a short plain-text note, Empty and over-length note rejection, Delete any note permanently, Notes saved between visits, Notes service for listing, adding and deleting notes, Setup and usage guide, Notes limited to 280 characters of plain text, Notes cannot be edited, Delete is permanent, with no confirmation or undo, Anyone can delete anyone's note, with no login, No rate limiting, spam protection or pagination

**Approved technology stack:**

| Layer | Choice | Rationale |
|---|---|---|
| backend | FastAPI | You specified FastAPI for a REST API with GET, POST and DELETE on /notes. It checks the 280-character limit and rejects empty notes with very little code. It also generates API documentation automatically, and it works with the SQLAlchemy and Alembic setup already assumed. |
| cloud | AWS | No assumption names a cloud, so I used the platform default. AWS can run the Docker Compose setup you assumed, with the API and database containers on one small server. Traffic is low and there is no deadline, so one small instance is enough. |
| database | PostgreSQL | You specified Postgres. Notes are simple rows holding text and a creation timestamp, and the volume is small, so Postgres is more than enough. Sorting newest first is a simple query. |
| frontend | React | You specified React with Vite. A single page that adds, lists and deletes short notes is a small amount of interface, and React handles it easily. I kept your choice unchanged. |
<!-- sdlc:auto:end summary -->

<!-- sdlc:auto:start epics -->
## EPIC-001: Shared notes list

One shared list of notes visible to anyone who opens the app. Assumption: the list is shared by everyone, with no login. Assumption: traffic and data volume are small, so there is no pagination and all notes are shown.

### US-001: View all notes newest first

**Priority:** high

> As a visitor, I want to see all notes in one list with the newest at the top, each showing when it was created, so that I can read what has been shared and see how recent it is.

| ID | Given | When | Then |
|---|---|---|---|
| AC-001 | several notes exist with different creation times | I open the page | all notes are listed in descending order of creation time, newest first |
| AC-002 | a note exists | it is displayed in the list | its text and a creation timestamp are shown |
| AC-003 | no notes exist | I open the page | an empty-state message is shown instead of a blank area, and no error is displayed |
| AC-004 | more notes exist than fit on one screen | I open the page | all notes are returned and shown without pagination (assumption: data volume is small) |

### US-002: Shared list is the same for everyone

**Priority:** medium

> As a visitor, I want to see the same notes as every other visitor, so that the list works as one shared board.

| ID | Given | When | Then |
|---|---|---|---|
| AC-005 | visitor A adds a note | visitor B opens or reloads the page | visitor B sees that note in the list without logging in |

## EPIC-002: Add notes

Visitors add short plain-text notes. Assumption: notes are plain text, limited to 280 characters, and cannot be edited. No rate limiting or spam protection applies.

### US-003: Add a short plain-text note

**Priority:** critical

> As a visitor, I want to type a note and submit it, so that it is added to the shared list.

| ID | Given | When | Then |
|---|---|---|---|
| AC-006 | I have entered text of 1 to 280 characters | I submit the note | it appears at the top of the list with a timestamp and the input is cleared |
| AC-007 | I submit a note containing HTML or script-like characters | the note is displayed | it is shown as literal plain text and is not interpreted as markup |

### US-004: Reject empty and over-length notes

**Priority:** high

> As a visitor, I want to be told when my note is empty or too long, so that I can correct it before it is saved.

| ID | Given | When | Then |
|---|---|---|---|
| AC-008 | the input is empty or only whitespace | I try to submit | no note is created and a clear message says a note cannot be empty |
| AC-009 | the input is longer than 280 characters | I try to submit | no note is created and a clear message states the 280-character limit |
| AC-010 | a client sends an empty or over-280-character note directly to POST /notes | the API receives it | it responds with a 4xx validation error and stores nothing |
| AC-011 | the input is exactly 280 characters | I submit | the note is accepted |

### US-005: Notes cannot be edited

**Priority:** low

> As a visitor, I want notes to be fixed once added, so that the list stays simple.

| ID | Given | When | Then |
|---|---|---|---|
| AC-012 | a note is displayed | I look at the page | no edit control is offered |
| AC-013 | the API is running | a client attempts to update a note (e.g. PUT or PATCH /notes/{id}) | no such operation exists and the API returns a method-not-allowed or not-found response |

## EPIC-003: Delete notes

Any visitor can delete any note. Assumptions: deletion is permanent with no confirmation or undo; because there is no login, anyone can delete anyone's note.

### US-006: Delete any note permanently

**Priority:** high

> As a visitor, I want to delete a note, so that it is removed from the shared list.

| ID | Given | When | Then |
|---|---|---|---|
| AC-014 | a note is shown in the list | I activate its delete control | the note is removed immediately from the list with no confirmation dialog |
| AC-015 | a note was deleted | anyone reloads the page | the note does not appear, and it is permanently removed from the database (hard delete) with no undo |
| AC-016 | I did not create the note | I delete it | the deletion succeeds, since there is no ownership or login |
| AC-017 | a note id that does not exist (e.g. already deleted by someone else) | DELETE /notes/{id} is called | the API returns a 404 and the UI refreshes the list without crashing |

## EPIC-004: Persistence

Notes are stored in Postgres so they survive between visits and restarts.

### US-007: Notes are saved between visits

**Priority:** critical

> As a visitor, I want my notes to still be there when I come back, so that the list is dependable.

| ID | Given | When | Then |
|---|---|---|---|
| AC-018 | notes have been added | I close and reopen the browser and page | the same notes are listed |
| AC-019 | notes exist in Postgres | the backend container is restarted | the notes are still listed |
| AC-020 | the stack is restarted with Docker Compose without removing volumes | the page is opened | the notes are still present |

## EPIC-005: Notes service (REST API)

FastAPI backend exposing GET/POST/DELETE /notes, using SQLAlchemy for data access and Alembic for migrations against Postgres. No external services or API keys are needed. No rate limiting or spam protection.

### US-008: List, add and delete notes through the API

**Priority:** critical

> As a frontend developer, I want REST endpoints to list, create and delete notes, so that the React app can manage the shared list.

| ID | Given | When | Then |
|---|---|---|---|
| AC-021 | notes exist | GET /notes is called | it returns 200 with all notes, each with id, text and created timestamp, newest first |
| AC-022 | a valid note body of 1 to 280 characters | POST /notes is called | it returns 201 with the created note including id and timestamp |
| AC-023 | an existing note id | DELETE /notes/{id} is called | the note is removed and a success response (200 or 204) is returned |
| AC-024 | a fresh database | Alembic migrations are run | the notes table is created and the service can serve requests |
| AC-025 | the service is running | it handles requests | it needs no login, API key or external service, and applies no rate limiting |

## EPIC-006: Setup and usage guide

A short guide so a developer can run and use the app. Assumption: Docker Compose is used for running and deployment.

### US-009: Run the app from the guide

**Priority:** medium

> As a developer or operator, I want a README covering setup and usage, so that I can start the app and understand how it behaves.

| ID | Given | When | Then |
|---|---|---|---|
| AC-026 | a machine with Docker and Docker Compose and the repository checked out | I follow the README steps | the Postgres, FastAPI and React (Vite) services start and the app is reachable in a browser |
| AC-027 | I read the guide | I look for usage information | it explains adding, viewing and deleting notes, and the migration step |
| AC-028 | I read the guide | I look for limits and behaviours | it states the 280-character limit, no editing, permanent delete without confirmation, anyone can delete any note, and no rate limiting, spam protection or pagination |
<!-- sdlc:auto:end epics -->
