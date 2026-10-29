# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:version-1

Plan version 1 is approved. It has two sprints (capacity 20 each), six epics and nine stories totalling 24 points.

Plan status: approved, version 1.
Epics and stories, in the order the plan lists them:
- EPIC-001 Shared notes list (unassigned)
  - US-001 View all notes newest first: 3 pts, frontend-agent
  - US-002 Shared list is the same for everyone: 1 pt, qa-agent
- EPIC-002 Add notes (unassigned)
  - US-003 Add a short plain-text note: 3 pts, frontend-agent
  - US-004 Reject empty and over-length notes: 3 pts, frontend-agent
  - US-005 Notes cannot be edited: 1 pt, backend-agent
- EPIC-003 Delete notes (unassigned)
  - US-006 Delete any note permanently: 3 pts, frontend-agent
- EPIC-004 Persistence (unassigned)
  - US-007 Notes are saved between visits: 3 pts, devops-agent
- EPIC-005 Notes service (REST API) (unassigned)
  - US-008 List, add and delete notes through the API: 5 pts, backend-agent
- EPIC-006 Setup and usage guide (unassigned)
  - US-009 Run the app from the guide: 2 pts, devops-agent
Total: 24 story points.

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009

- ⚠ The epic-to-story grouping is inferred from listing order; the input does not state parent links explicitly.
- ⚠ Story-to-sprint assignment is not explicit; it is inferred only from the sprint goal wording.
- ⚠ The plan approver and approval date are not recorded.

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 aimed to deliver a working, persistent notes app: the API, migration and Compose persistence, and the React page. Only the API and persistence parts were delivered.

Goal (verbatim): A working, persistent notes app: the API, migration and Compose persistence, plus the React page to view, add (with validation) and delete notes.
Capacity: 20.
Stories matching the goal: US-008 (API), US-007 (persistence), US-001 (view), US-003 (add), US-004 (validation), US-006 (delete). Together these total 20 points.
Outcome in the run:
- Delivered: US-007, US-008
- Skipped: US-001, US-003, US-004, US-006 (the React page)

**Related:** US-001, US-003, US-004, US-006, US-007, US-008

- ⚠ The sprint goal is not met: the React page tickets (US-001, US-003, US-004, US-006) were skipped, yet the run status is 'completed'.
- ⚠ No reason is recorded for skipping the frontend tickets.
- ⚠ No sprint dates are recorded.

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 aims to confirm the list is shared and that notes cannot be edited, and to ship the README with a one-step Docker Compose start. No tickets for it appear in the development run.

Goal (verbatim): Confirm the list is shared and notes cannot be edited, and ship the README with a one-step Docker Compose start.
Capacity: 20.
Stories matching the goal: US-002 (1 pt, qa-agent), US-005 (1 pt, backend-agent), US-009 (2 pts, devops-agent). Together these total 4 points.

**Related:** US-002, US-005, US-009

- ⚠ The development run has no tickets for US-002, US-005 or US-009, so it is unclear whether Sprint 2 has started.
- ⚠ The README and setup guide (US-009) are not yet recorded as delivered.

### DEV-RUN · draft · source: dev:run

The development run is marked 'completed'. It contains six tickets: two delivered and four skipped.

Run status: completed.
- US-001: skipped, no commit
- US-003: skipped, no commit
- US-004: skipped, no commit
- US-006: skipped, no commit
- US-007: delivered, commit d1e86a8e1326840b79f9b7fb231067b892feae11
- US-008: delivered, commit d1e86a8e1326840b79f9b7fb231067b892feae11

**Related:** US-001, US-003, US-004, US-006, US-007, US-008

- ⚠ Discrepancy: the run status says 'completed', but 4 of 6 tickets were skipped and the frontend is not built.
- ⚠ No run date or reviewer is recorded.

### DEV-US-008 · draft · source: dev:TICKET-US-008

The FastAPI REST API for listing, adding and deleting notes was delivered.

Ticket: List, add and delete notes through the API.
Plan: 5 pts, backend-agent.
Status: delivered.
Commit: d1e86a8e1326840b79f9b7fb231067b892feae11 (shared with US-007).

**Related:** US-008, EPIC-005, DEV-SPRINT-1

- ⚠ Endpoint paths, payloads and server-side validation rules are not described in the input.
- ⚠ No code review or test result is recorded.

### DEV-US-007 · draft · source: dev:TICKET-US-007

Persistence of notes between visits (Postgres, migration, Compose persistence per the Sprint 1 goal) was delivered.

Ticket: Notes are saved between visits.
Plan: 3 pts, devops-agent.
Status: delivered.
Commit: d1e86a8e1326840b79f9b7fb231067b892feae11 (shared with US-008).

**Related:** US-007, EPIC-004, DEV-SPRINT-1

- ⚠ Migration and volume configuration details are not described.
- ⚠ No verification is recorded that data survives a restart.

### DEV-US-001 · draft · source: dev:TICKET-US-001

The frontend view of all notes, newest first, was skipped and not built.

Plan: 3 pts, frontend-agent.
Status: skipped.
Commit: none.

**Related:** US-001, EPIC-001, DEV-SPRINT-1

- ⚠ No reason is recorded for the skip.
- ⚠ No follow-up is planned or recorded.

### DEV-US-003 · draft · source: dev:TICKET-US-003

The frontend form for adding a short plain-text note was skipped and not built.

Plan: 3 pts, frontend-agent.
Status: skipped.
Commit: none.

**Related:** US-003, EPIC-002, DEV-SPRINT-1

- ⚠ No reason is recorded for the skip.
- ⚠ No follow-up is planned or recorded.

### DEV-US-004 · draft · source: dev:TICKET-US-004

Rejection of empty and over-length notes in the frontend was skipped and not built.

Plan: 3 pts, frontend-agent.
Status: skipped.
Commit: none.

**Related:** US-004, EPIC-002, DEV-SPRINT-1

- ⚠ No reason is recorded for the skip.
- ⚠ The maximum note length is not specified in the input.
- ⚠ It is unknown whether the API (US-008) enforces this validation server-side.

### DEV-US-006 · draft · source: dev:TICKET-US-006

The frontend control for permanently deleting any note was skipped and not built.

Plan: 3 pts, frontend-agent.
Status: skipped.
Commit: none.

**Related:** US-006, EPIC-003, DEV-SPRINT-1

- ⚠ No reason is recorded for the skip.
- ⚠ No follow-up is planned or recorded.

### DEV-US-002 · draft · source: plan:US-002

Confirming that the shared list is the same for everyone is planned but has no ticket in the run.

Plan: 1 pt, qa-agent.
No development ticket exists.

**Related:** US-002, EPIC-001, DEV-SPRINT-2

- ⚠ Not started; there is no ticket or commit.

### DEV-US-005 · draft · source: plan:US-005

Ensuring notes cannot be edited is planned but has no ticket in the run.

Plan: 1 pt, backend-agent.
No development ticket exists.

**Related:** US-005, EPIC-002, DEV-SPRINT-2

- ⚠ Not started; there is no ticket or commit.
- ⚠ It is unconfirmed whether the delivered API (US-008) omits edit/update endpoints.

### DEV-US-009 · draft · source: plan:US-009

The README with a one-step Docker Compose start is planned but has no ticket in the run.

Plan: 2 pts, devops-agent.
No development ticket exists.

**Related:** US-009, EPIC-006, DEV-SPRINT-2

- ⚠ Not started; there is no ticket or commit.

### DEV-USER-GUIDE-STATUS · draft

An end-user guide cannot be written yet because the React page was not built.

All user-facing frontend tickets were skipped. Only the API and persistence exist.

**Related:** US-001, US-003, US-004, US-006

- ⚠ The application UI isn't built yet, so there is no usage to document.
- ⚠ No App Design screens (SCR keys) were provided.
<!-- sdlc:auto:end narrative -->
