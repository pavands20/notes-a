# Sprint Plan

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start sprints -->
## Sprint 1: Sprint 1

A working, persistent notes app: the API, migration and Compose persistence, plus the React page to view, add (with validation) and delete notes.

Capacity: 20 points · Committed: 20

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-001 | Story | View all notes newest first | 3 | frontend-agent | US-008 |
| US-003 | Story | Add a short plain-text note | 3 | frontend-agent | US-001, US-008 |
| US-004 | Story | Reject empty and over-length notes | 3 | frontend-agent | US-003 |
| US-006 | Story | Delete any note permanently | 3 | frontend-agent | US-001, US-008 |
| US-007 | Story | Notes are saved between visits | 3 | devops-agent | US-008 |
| US-008 | Story | List, add and delete notes through the API | 5 | backend-agent | — |

## Sprint 2: Sprint 2

Confirm the list is shared and notes cannot be edited, and ship the README with a one-step Docker Compose start.

Capacity: 20 points · Committed: 4

| Key | Type | Title | Points | Role | Depends on |
|---|---|---|---|---|---|
| US-002 | Story | Shared list is the same for everyone | 1 | qa-agent | US-001, US-003 |
| US-005 | Story | Notes cannot be edited | 1 | backend-agent | US-008 |
| US-009 | Story | Run the app from the guide | 2 | devops-agent | US-007 |

## Unscheduled

_Nothing unscheduled._
<!-- sdlc:auto:end sprints -->
