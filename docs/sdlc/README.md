# Notes A — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
A one-page app where a user can add a short note, see the list of notes, and delete a note. No login, no file uploads, no AI. React frontend, FastAPI backend, Postgres.

**Documentation version:** v7
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 15 entries |
| [Development](development/README.md) | 13 entries |
| [Testing](testing/README.md) | 1 entry |
| [Deployment](deployment/README.md) | 3 entries |
| [Maintenance](maintenance/README.md) | 1 entry |
| [Data model](architecture/data-model.md) | generated |
| [API (OpenAPI)](architecture/api/openapi.yaml) | generated |
| [Decisions (ADRs)](architecture/adr/README.md) | 4 decisions |
| [Sprint plan](development/sprint-plan.md) | 2 sprints |
| [Developer guide](development/developer-guide.md) | generated |
| [API reference](development/api-reference.md) | 4 routes |
| [Test report](testing/test-report.md) | not run yet |
| [Tests](testing/test-cases.md) | 0 tests |
| [Deployment guide](deployment/deployment-guide.md) | deployed |
| [Runbook](deployment/runbook.md) | deployed |
| [Release notes](deployment/release-notes.md) | 2 releases |
| [Traceability matrix](traceability-matrix.md) | 9 requirements |
| [Changelog](CHANGELOG.md) | 7 versions |
<!-- sdlc:auto:end contents -->

## Open gaps

<!-- sdlc:auto:start open-gaps -->
### Requirements

- No sign-off or approval of the requirements set itself is recorded. Only the technology stack is stated as approved by the product owner.
- AWS was chosen as the platform default, not named by the user. It is approved, but no specific AWS service or instance type is specified.
- The approval date and approver identity are not recorded beyond 'product owner'.
- Timestamp display format and timezone are not specified.
- Empty-state message wording is not specified.
- Live updates without reload are not required by the ACs. Confirm reload-only visibility is intended.
- The submit trigger is not specified (button, Enter key, or both).
- Line breaks / multiline input are not specified.
- It is not specified whether surrounding whitespace is trimmed before the length check or before storage.
- It is not specified how characters are counted (e.g. Unicode code points vs UTF-16 units vs bytes).
- The exact 4xx code (400 vs 422) is not specified.
- AC-013 allows either 405 or 404. The expected response is ambiguous for testing.
- No backup or restore expectation is stated for the AWS-hosted database.
- AC-023 allows 200 or 204. The success code is ambiguous.
- The request/response JSON field names and the timestamp format (e.g. ISO 8601, UTC) are not specified.
- The id type (integer vs UUID) is not specified.
- The README covers local Docker Compose. It is not stated whether AWS deployment steps must also be documented.
- No threshold or trigger is defined for revisiting this risk if note volume grows.
- The decision-maker and date of risk acceptance are not recorded.
- Abuse or vandalism risk on a publicly reachable AWS host is accepted, but no monitoring or response is defined.
- Free-text public notes could still receive personal data typed by visitors. This is not addressed; flagged for a human to confirm, not as a legal determination.

### Architecture

- No approval date or approver is recorded for this architecture version.
- The architecture cites AC-xxx and NFR-xxx ids, but the known requirement keys are US-001 to US-009. No mapping between them was provided, so links to the US keys cannot be established.
- The component says it is served as static assets, but the 'web' deployment node describes a Node 20 container on port 5173 running the Vite dev server in dev. How static assets are served in the AWS deployment is not specified.
- Inconsistent wording on PUT/PATCH: the component says '405 or 404', but the Backend tech decision says leaving out update routes 'gives 405'. Please confirm the expected status code.
- No rate limiting or auth on a publicly hosted EC2 service is stated as a design choice. Any accepted abuse or spam risk is not documented.
- The exact CORS origin(s) for local and AWS environments are not specified.
- The exact CHECK constraint expression is not specified, e.g. whether it also rejects whitespace-only text or only enforces length.
- No backup or snapshot strategy is described for the database volume (local or EBS).
- Column types are not specified (e.g. id integer/serial vs UUID; created_at timestamp with or without time zone).
- It is not stated whether created_at is set by the database default or by the application.
- Response body shapes (JSON field names and the timestamp format) are not specified.
- It is not stated whether the stored text is the raw input or the stripped text, or whether the 280 limit applies before or after stripping.
- Behaviour when GET /notes fails (network or server error) is not described.
- The production web serving mode on EC2 is not specified (the Vite dev server is only described for dev; static asset serving is not described).
- TLS/HTTPS, domain name and any reverse proxy for the EC2 host are not described.
- Which ports are publicly exposed on EC2 (security group rules for 5173 and 8000) is not specified.
- The instance size is given only as an example ('e.g. t3.small'); the final choice is not confirmed.
- This decision says PUT/PATCH gives 405, while the notes_api component says '405 or 404'. The discrepancy is flagged for confirmation.
- Map the AC-xxx and NFR-xxx ids to US-001 to US-009 so architecture entries can be traced to user stories.
- AC-012, AC-013, AC-018, AC-019 and AC-020 are not referenced by any critical path. Confirm whether they exist and how the architecture covers them.
- NFR-004, NFR-005 and NFR-006 are not referenced anywhere in the architecture. Confirm whether they exist and how they are addressed.
- No approval date, approver or decision record is given for the 'approved' status of Version 1.

### Development

- Plan approval date and approver are not recorded.
- The plan does not explicitly assign stories to sprints; only the sprint goal text implies the split.
- Epics carry no points or owner role.
- No ticket, status or commit is recorded for any Sprint 1 work. It is unknown whether the sprint was executed.
- Sprint dates are not recorded.
- Sprint 2 verifies behavior that depends on Sprint 1 deliverables, which have no delivery record.
- No description of what was changed or verified in this commit.
- No review or approval is recorded.
- No delivery date is recorded.
- The input does not state how non-editability is enforced, for example by having no update endpoint.
- README contents and the exact start command are not provided.
- No ticket status or commit is recorded, although the run is marked completed. Delivery is unconfirmed.
- No ticket status or commit is recorded. Delivery is unconfirmed.
- The maximum note length is not specified in the input.
- The length limit and validation messages are not specified.
- The input does not say whether validation also runs on the backend.
- The input does not say whether a delete confirmation is required.
- API endpoints and contracts are not provided.
- Conflict: the run is marked completed, but Sprint 1 stories US-001, US-003, US-004, US-006, US-007 and US-008 have no delivery records. Someone needs to confirm whether they were delivered under other ticket ids or not built.
- User guide not produced: core screen functionality (view, add, delete notes) cannot be confirmed as built, so there is nothing confirmed to document usage for.
- No App Design screen keys were provided.
- No run dates, reviewers or test results are recorded for this phase.

### Testing

- Testing phase has not started: no test plan, cases or results are recorded for AC-001 to AC-028 or NFR-001 to NFR-010.

### Deployment

- No deployment date or time recorded.
- No deployer or approver recorded. Approval status is unknown, so this entry is marked draft.
- No environment name given (e.g. production vs. staging/preview).
- No release notes or change list for version e9b2c94ec08d.
- No mapping from this deployment to requirements US-001 to US-009. It is unconfirmed which requirements this version delivers.
- No test or QA sign-off referenced for this version.
- No post-deployment smoke test or health check results recorded.
- No rollback plan or previous version recorded.
- No database (Postgres) deployment or migration details recorded.
- The input does not state which backend URL the frontend is configured to call. Assumed to be the backend URL listed below, but unconfirmed.
- No custom domain, CDN or caching configuration recorded.
- No record that this URL was verified reachable after deployment.
- The hostname is an sslip.io wildcard DNS name derived from an IP address. The input does not say whether this is the intended long-term endpoint or a temporary one.
- No API health check endpoint or verification result recorded.
- No hosting details for the Postgres database (location, backups, credential management).
- No CORS configuration recorded linking this backend to the frontend origin.

### Maintenance

- No maintenance or post-deployment activity recorded; the application has not been deployed.
<!-- sdlc:auto:end open-gaps -->
