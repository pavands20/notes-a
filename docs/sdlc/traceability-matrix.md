# Traceability Matrix

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start legend -->
Built from recorded links, not written by a model: requirement key → plan item (`source_stable_key`) → development ticket (`stable_key`) → the ticket's test steps → the last live deployment that started after the work finished. **AC tests** counts the story's acceptance criteria that have a test case, and those whose test cases all passed in the latest finished E2E run.
<!-- sdlc:auto:end legend -->

<!-- sdlc:auto:start matrix -->
| Requirement | Epic | Title | Plan items | Sprint | Design | Code | Commits | Ticket | Tests | AC tests | Deployed |
|---|---|---|---|---|---|---|---|---|---|---|---|
| US-001 | EPIC-001 | View all notes newest first | US-001 | 1 | GET /notes, notes, web_ui | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-002 | EPIC-001 | Shared list is the same for everyone | US-002 | 2 | GET /notes, POST /notes, notes, notes_api, web_ui | — | — | not started | not run | 0/1 tested · 0/1 passing | — |
| US-003 | EPIC-002 | Add a short plain-text note | US-003 | 1 | POST /notes, notes, web_ui | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-004 | EPIC-002 | Reject empty and over-length notes | US-004 | 1 | POST /notes, notes, notes_api, web_ui | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-005 | EPIC-002 | Notes cannot be edited | US-005 | 2 | notes, notes_api, web_ui | — | — | not started | not run | 0/2 tested · 0/2 passing | — |
| US-006 | EPIC-003 | Delete any note permanently | US-006 | 1 | DELETE /notes/{id}, notes, web_ui | — | — | not started | not run | 0/4 tested · 0/4 passing | — |
| US-007 | EPIC-004 | Notes are saved between visits | US-007 | 1 | GET /health, notes, notes_api, notes_db | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
| US-008 | EPIC-005 | List, add and delete notes through the API | US-008 | 1 | DELETE /notes/{id}, GET /notes, POST /notes, notes, notes_api, notes_db | — | — | not started | not run | 0/5 tested · 0/5 passing | — |
| US-009 | EPIC-006 | Run the app from the guide | US-009 | 2 | notes_api, notes_db, web_ui | — | — | not started | not run | 0/3 tested · 0/3 passing | — |
<!-- sdlc:auto:end matrix -->
