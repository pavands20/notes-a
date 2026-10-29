# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:version-1

Approved development plan (version 1) for Notes A, a one-page React + FastAPI + Postgres notes app with no login, uploads or AI. It has 6 epics and 9 stories totalling 24 points across 2 sprints of capacity 20 each.

Plan status: approved, version 1.

Epics and stories:
- EPIC-001 Shared notes list (no points, unassigned)
  - US-001 View all notes newest first: 3 pts, frontend-agent
  - US-002 Shared list is the same for everyone: 1 pt, qa-agent
- EPIC-002 Add notes (no points, unassigned)
  - US-003 Add a short plain-text note: 3 pts, frontend-agent
  - US-004 Reject empty and over-length notes: 3 pts, frontend-agent
  - US-005 Notes cannot be edited: 1 pt, backend-agent
- EPIC-003 Delete notes (no points, unassigned)
  - US-006 Delete any note permanently: 3 pts, frontend-agent
- EPIC-004 Persistence (no points, unassigned)
  - US-007 Notes are saved between visits: 3 pts, devops-agent
- EPIC-005 Notes service (REST API) (no points, unassigned)
  - US-008 List, add and delete notes through the API: 5 pts, backend-agent
- EPIC-006 Setup and usage guide (no points, unassigned)
  - US-009 Run the app from the guide: 2 pts, devops-agent

Story points by role:
- frontend-agent: 12
- backend-agent: 6
- devops-agent: 5
- qa-agent: 1
- Total: 24 of 40 total capacity

**Related:** EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, SPRINT-1, SPRINT-2

- ⚠ Plan approval date and approver are not recorded.
- ⚠ The plan does not explicitly assign stories to sprints; only the sprint goal text implies the split.
- ⚠ Epics carry no points or owner role.

### SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 targets a working, persistent notes app. Scope is the API, the database migration, Compose persistence, and the React page to view, add (with validation) and delete notes. Capacity is 20.

Goal (verbatim): A working, persistent notes app: the API, migration and Compose persistence, plus the React page to view, add (with validation) and delete notes.
Capacity: 20.

Stories the goal text implies (not explicitly assigned in the plan):
- US-001
- US-003
- US-004
- US-006
- US-007
- US-008

These 6 stories total 20 points, matching the capacity.

The development run records no delivered tickets for any of these stories.

**Related:** DEV-PLAN-V1, US-001, US-003, US-004, US-006, US-007, US-008

- ⚠ No ticket, status or commit is recorded for any Sprint 1 work. It is unknown whether the sprint was executed.
- ⚠ Sprint dates are not recorded.

### SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 confirms the notes list is shared and that notes cannot be edited. It also ships the README with a one-step Docker Compose start. Capacity is 20.

Goal (verbatim): Confirm the list is shared and notes cannot be edited, and ship the README with a one-step Docker Compose start.
Capacity: 20.

Stories the goal text implies:
- US-002 (1 pt)
- US-005 (1 pt)
- US-009 (2 pts)

These total 4 points.

All three are recorded as delivered in the development run.

**Related:** DEV-PLAN-V1, US-002, US-005, US-009

- ⚠ Sprint dates are not recorded.
- ⚠ Sprint 2 verifies behavior that depends on Sprint 1 deliverables, which have no delivery record.

### US-002 · draft · source: dev:US-002

Ticket 'Shared list is the same for everyone' is delivered. The commit is shared with US-005.

- Ticket: US-002, Shared list is the same for everyone
- Owner role (plan): qa-agent, 1 pt
- Status: delivered
- Commit: 907d71da11369ddd0a674bdf5a1e54cd2cb1202e (same commit as US-005)

**Related:** EPIC-001, SPRINT-2, US-001, US-008

- ⚠ No description of what was changed or verified in this commit.
- ⚠ No review or approval is recorded.
- ⚠ No delivery date is recorded.

### US-005 · draft · source: dev:US-005

Ticket 'Notes cannot be edited' is delivered. The commit is shared with US-002.

- Ticket: US-005, Notes cannot be edited
- Owner role (plan): backend-agent, 1 pt
- Status: delivered
- Commit: 907d71da11369ddd0a674bdf5a1e54cd2cb1202e (same commit as US-002)

**Related:** EPIC-002, SPRINT-2, US-003, US-008

- ⚠ The input does not state how non-editability is enforced, for example by having no update endpoint.
- ⚠ No review or approval is recorded.
- ⚠ No delivery date is recorded.

### US-009 · draft · source: dev:US-009

Ticket 'Run the app from the guide' is delivered. Per the Sprint 2 goal, this is the README with a one-step Docker Compose start.

- Ticket: US-009, Run the app from the guide
- Owner role (plan): devops-agent, 2 pts
- Status: delivered
- Commit: 6e672adde93c4292fc9045e8e996e854330707ae

**Related:** EPIC-006, SPRINT-2, US-007

- ⚠ README contents and the exact start command are not provided.
- ⚠ No review or approval is recorded.
- ⚠ No delivery date is recorded.

### US-001 · draft · source: plan:version-1

Planned story 'View all notes newest first' (3 pts, frontend-agent). No delivery is recorded.

- Present in the approved plan
- Absent from the development run ticket list

**Related:** EPIC-001, SPRINT-1

- ⚠ No ticket status or commit is recorded, although the run is marked completed. Delivery is unconfirmed.

### US-003 · draft · source: plan:version-1

Planned story 'Add a short plain-text note' (3 pts, frontend-agent). No delivery is recorded.

- Present in the approved plan
- Absent from the development run ticket list

**Related:** EPIC-002, SPRINT-1

- ⚠ No ticket status or commit is recorded. Delivery is unconfirmed.
- ⚠ The maximum note length is not specified in the input.

### US-004 · draft · source: plan:version-1

Planned story 'Reject empty and over-length notes' (3 pts, frontend-agent). No delivery is recorded.

- Present in the approved plan
- Absent from the development run ticket list

**Related:** EPIC-002, SPRINT-1, US-003

- ⚠ No ticket status or commit is recorded. Delivery is unconfirmed.
- ⚠ The length limit and validation messages are not specified.
- ⚠ The input does not say whether validation also runs on the backend.

### US-006 · draft · source: plan:version-1

Planned story 'Delete any note permanently' (3 pts, frontend-agent). No delivery is recorded.

- Present in the approved plan
- Absent from the development run ticket list

**Related:** EPIC-003, SPRINT-1

- ⚠ No ticket status or commit is recorded. Delivery is unconfirmed.
- ⚠ The input does not say whether a delete confirmation is required.

### US-007 · draft · source: plan:version-1

Planned story 'Notes are saved between visits' (3 pts, devops-agent). It covers the migration and Compose persistence. No delivery is recorded.

- Present in the approved plan
- Absent from the development run ticket list

**Related:** EPIC-004, SPRINT-1, US-009

- ⚠ No ticket status or commit is recorded. Delivery is unconfirmed.

### US-008 · draft · source: plan:version-1

Planned story 'List, add and delete notes through the API' (5 pts, backend-agent). No delivery is recorded.

- Present in the approved plan
- Absent from the development run ticket list

**Related:** EPIC-005, SPRINT-1, US-001, US-003, US-006

- ⚠ No ticket status or commit is recorded. Delivery is unconfirmed.
- ⚠ API endpoints and contracts are not provided.

### DEV-GAPS · draft

Phase-level gaps: the completion claim conflicts with the delivery records, and no user guide can be written yet.

Discrepancy: the development run status is 'completed', but only 3 of 9 planned stories have ticket and commit records. The 6 missing stories (US-001, US-003, US-004, US-006, US-007, US-008) carry all the core view, add, validate, delete, persist and API functionality.

Both facts are reported as given. Neither is assumed correct.

**Related:** US-001, US-003, US-004, US-006, US-007, US-008, SPRINT-1

- ⚠ Conflict: the run is marked completed, but Sprint 1 stories US-001, US-003, US-004, US-006, US-007 and US-008 have no delivery records. Someone needs to confirm whether they were delivered under other ticket ids or not built.
- ⚠ User guide not produced: core screen functionality (view, add, delete notes) cannot be confirmed as built, so there is nothing confirmed to document usage for.
- ⚠ No App Design screen keys were provided.
- ⚠ No run dates, reviewers or test results are recorded for this phase.
<!-- sdlc:auto:end narrative -->
