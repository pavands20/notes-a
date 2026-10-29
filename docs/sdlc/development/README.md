# Development

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEV-PLAN-V1 · approved · source: plan:version-1

Development plan version 1 for Notes A is approved. It defines 2 sprints (capacity 20 each), 6 epics and 9 stories totalling 24 story points.

- Plan status: approved, version 1.
- Project scope: one-page notes app (add, list, delete). No login, no file uploads, no AI. React frontend, FastAPI backend, Postgres.
- Sprints: Sprint 1 (capacity 20), Sprint 2 (capacity 20).
- Epics and stories (grouping taken from plan list order):
  - EPIC-001 Shared notes list: US-001 (3 pts, frontend-agent), US-002 (1 pt, qa-agent)
  - EPIC-002 Add notes: US-003 (3 pts, frontend-agent), US-004 (3 pts, frontend-agent), US-005 (1 pt, backend-agent)
  - EPIC-003 Delete notes: US-006 (3 pts, frontend-agent)
  - EPIC-004 Persistence: US-007 (3 pts, devops-agent)
  - EPIC-005 Notes service (REST API): US-008 (5 pts, backend-agent)
  - EPIC-006 Setup and usage guide: US-009 (2 pts, devops-agent)
- Epics have no points and no assigned role.
- Total story points: 24.

**Related:** US-001, US-002, US-003, US-004, US-005, US-006, US-007, US-008, US-009, EPIC-001, EPIC-002, EPIC-003, EPIC-004, EPIC-005, EPIC-006, DEV-SPRINT-1, DEV-SPRINT-2

- ⚠ No approval date or approver recorded for the plan.
- ⚠ Epic-to-story grouping is inferred from the order of the plan list. The input does not state parent links explicitly.
- ⚠ Story-to-sprint assignment is not stated explicitly in the input. It is only implied by the sprint goals.

### DEV-SPRINT-1 · approved · source: plan:Sprint 1

Sprint 1 aims to deliver a working, persistent notes app: the API, the migration, Compose persistence, and the React page to view, add (with validation) and delete notes. No delivery is recorded for any story matching this goal.

- Goal: "A working, persistent notes app: the API, migration and Compose persistence, plus the React page to view, add (with validation) and delete notes."
- Capacity: 20.
- Stories that match the goal (inferred): US-001 (3), US-003 (3), US-004 (3), US-006 (3), US-007 (3), US-008 (5). Total 20 points, equal to capacity.
- Development run tickets for these stories: none recorded.

**Related:** US-001, US-003, US-004, US-006, US-007, US-008, DEV-PLAN-V1

- ⚠ Explicit sprint membership of stories is not given. The mapping is inferred from the goal text and the point total.
- ⚠ No tickets, statuses or commits recorded for US-001, US-003, US-004, US-006, US-007 or US-008, even though the development run is marked completed.
- ⚠ No sprint dates recorded.

### DEV-SPRINT-2 · approved · source: plan:Sprint 2

Sprint 2 aims to confirm the notes list is shared, confirm notes cannot be edited, and ship the README with a one-step Docker Compose start. All three stories matching this goal are recorded as delivered.

- Goal: "Confirm the list is shared and notes cannot be edited, and ship the README with a one-step Docker Compose start."
- Capacity: 20.
- Stories that match the goal (inferred): US-002 (1), US-005 (1), US-009 (2). Total 4 points.
- Ticket results:
  - US-002: delivered, commit 907d71da11369ddd0a674bdf5a1e54cd2cb1202e
  - US-005: delivered, commit 907d71da11369ddd0a674bdf5a1e54cd2cb1202e
  - US-009: delivered, commit 6e672adde93c4292fc9045e8e996e854330707ae

**Related:** US-002, US-005, US-009, DEV-PLAN-V1

- ⚠ Explicit sprint membership of stories is not given. The mapping is inferred from the goal text.
- ⚠ Sprint 2 builds on Sprint 1 (confirming shared list and immutability, and documenting startup), yet no Sprint 1 delivery is recorded.
- ⚠ No sprint dates recorded.

### DEV-RUN · draft · source: dev:run

The development run is marked completed. Three tickets are recorded, all delivered, across two commits.

- Run status: completed.
- Tickets recorded: 3 of 9 planned stories.
  - US-002 "Shared list is the same for everyone": delivered, commit 907d71da11369ddd0a674bdf5a1e54cd2cb1202e
  - US-005 "Notes cannot be edited": delivered, commit 907d71da11369ddd0a674bdf5a1e54cd2cb1202e (same commit as US-002)
  - US-009 "Run the app from the guide": delivered, commit 6e672adde93c4292fc9045e8e996e854330707ae
- Stories with no ticket record: US-001, US-003, US-004, US-006, US-007, US-008.

**Related:** US-002, US-005, US-009, DEV-PLAN-V1

- ⚠ Discrepancy: the run status is 'completed', but only 3 of 9 planned stories have ticket records. It is unclear whether the other 6 were delivered in an earlier run, are untracked, or were not built.
- ⚠ No dates, authors or code review approvals recorded for the run or its commits.
- ⚠ No test results are attached to any delivered ticket.

### DEV-US-001 · draft · source: plan:US-001

Story: view all notes, newest first. Planned at 3 points for frontend-agent. No development ticket recorded.

- Title: View all notes newest first
- Points: 3
- Role: frontend-agent
- Epic: EPIC-001 Shared notes list (inferred from list order)
- Ticket status: not recorded
- Commit: none recorded

**Related:** US-001, EPIC-001, DEV-SPRINT-1

- ⚠ No ticket, status or commit recorded. Delivery cannot be confirmed.

### DEV-US-002 · draft · source: dev:US-002

Story: the notes list is the same for everyone. Delivered in commit 907d71da, which is shared with US-005.

- Title: Shared list is the same for everyone
- Points: 1
- Planned role: qa-agent
- Epic: EPIC-001 Shared notes list (inferred from list order)
- Ticket status: delivered
- Commit: 907d71da11369ddd0a674bdf5a1e54cd2cb1202e (also used for US-005)

**Related:** US-002, EPIC-001, DEV-SPRINT-2, DEV-US-005

- ⚠ The role is qa-agent, so the story may be a verification task. The input does not say what the commit contains (tests or code).
- ⚠ The shared-list behaviour depends on US-001 and US-008, which have no recorded delivery.

### DEV-US-003 · draft · source: plan:US-003

Story: add a short plain-text note. Planned at 3 points for frontend-agent. No development ticket recorded.

- Title: Add a short plain-text note
- Points: 3
- Role: frontend-agent
- Epic: EPIC-002 Add notes (inferred from list order)
- Ticket status: not recorded
- Commit: none recorded

**Related:** US-003, EPIC-002, DEV-SPRINT-1

- ⚠ No ticket, status or commit recorded. Delivery cannot be confirmed.
- ⚠ The maximum note length is not specified in the input.

### DEV-US-004 · draft · source: plan:US-004

Story: reject empty and over-length notes. Planned at 3 points for frontend-agent. No development ticket recorded.

- Title: Reject empty and over-length notes
- Points: 3
- Role: frontend-agent
- Epic: EPIC-002 Add notes (inferred from list order)
- Ticket status: not recorded
- Commit: none recorded

**Related:** US-004, EPIC-002, DEV-SPRINT-1

- ⚠ No ticket, status or commit recorded. Delivery cannot be confirmed.
- ⚠ The length limit value is not given in the input.
- ⚠ The story is assigned to frontend-agent only. The input does not say whether the API also enforces validation.

### DEV-US-005 · draft · source: dev:US-005

Story: notes cannot be edited. Delivered in commit 907d71da, which is shared with US-002.

- Title: Notes cannot be edited
- Points: 1
- Planned role: backend-agent
- Epic: EPIC-002 Add notes (inferred from list order)
- Ticket status: delivered
- Commit: 907d71da11369ddd0a674bdf5a1e54cd2cb1202e (also used for US-002)

**Related:** US-005, EPIC-002, DEV-SPRINT-2, DEV-US-002

- ⚠ The input does not say how immutability is enforced (for example, no update endpoint, or a rejected PUT/PATCH).
- ⚠ The planned role is backend-agent, but the commit is shared with US-002 (qa-agent). Authorship is not recorded.

### DEV-US-006 · draft · source: plan:US-006

Story: delete any note permanently. Planned at 3 points for frontend-agent. No development ticket recorded.

- Title: Delete any note permanently
- Points: 3
- Role: frontend-agent
- Epic: EPIC-003 Delete notes (inferred from list order)
- Ticket status: not recorded
- Commit: none recorded

**Related:** US-006, EPIC-003, DEV-SPRINT-1

- ⚠ No ticket, status or commit recorded. Delivery cannot be confirmed.
- ⚠ The input does not say whether deletion asks the user to confirm first.

### DEV-US-007 · draft · source: plan:US-007

Story: notes are saved between visits (migration and Compose persistence). Planned at 3 points for devops-agent. No development ticket recorded.

- Title: Notes are saved between visits
- Points: 3
- Role: devops-agent
- Epic: EPIC-004 Persistence (inferred from list order)
- The Sprint 1 goal mentions a migration and Compose persistence.
- Ticket status: not recorded
- Commit: none recorded

**Related:** US-007, EPIC-004, DEV-SPRINT-1

- ⚠ No ticket, status or commit recorded. Delivery cannot be confirmed.

### DEV-US-008 · draft · source: plan:US-008

Story: list, add and delete notes through the REST API (FastAPI). Planned at 5 points for backend-agent. No development ticket recorded.

- Title: List, add and delete notes through the API
- Points: 5
- Role: backend-agent
- Epic: EPIC-005 Notes service (REST API) (inferred from list order)
- Ticket status: not recorded
- Commit: none recorded

**Related:** US-008, EPIC-005, DEV-SPRINT-1

- ⚠ No ticket, status or commit recorded. Delivery cannot be confirmed.
- ⚠ Endpoint paths and contracts are not provided in the input.

### DEV-US-009 · draft · source: dev:US-009

Story: run the app from the guide (README with a one-step Docker Compose start). Delivered in commit 6e672add.

- Title: Run the app from the guide
- Points: 2
- Planned role: devops-agent
- Epic: EPIC-006 Setup and usage guide (inferred from list order)
- Sprint 2 goal: ship the README with a one-step Docker Compose start.
- Ticket status: delivered
- Commit: 6e672adde93c4292fc9045e8e996e854330707ae

**Related:** US-009, EPIC-006, DEV-SPRINT-2

- ⚠ The README contents and the exact startup command are not included in the input.
- ⚠ The guide documents an app whose core stories (US-001, US-003, US-004, US-006, US-007, US-008) have no recorded delivery.
<!-- sdlc:auto:end narrative -->
