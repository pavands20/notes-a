# Notes A — SDLC Documentation

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start overview -->
A one-page app where a user can add a short note, see the list of notes, and delete a note. No login, no file uploads, no AI. React frontend, FastAPI backend, Postgres.

**Documentation version:** v1
<!-- sdlc:auto:end overview -->

## Contents

<!-- sdlc:auto:start contents -->
| Document | State |
|---|---|
| [Requirements](requirements/README.md) | v1 approved |
| [Architecture](architecture/README.md) | 1 entry |
| [Development](development/README.md) | 1 entry |
| [Testing](testing/README.md) | 1 entry |
| [Deployment](deployment/README.md) | 1 entry |
| [Maintenance](maintenance/README.md) | 1 entry |
| [Data model](architecture/data-model.md) | not generated yet |
| [API (OpenAPI)](architecture/api/openapi.yaml) | not generated yet |
| [Decisions (ADRs)](architecture/adr/README.md) | 0 decisions |
| [Sprint plan](development/sprint-plan.md) | not generated yet |
| [Developer guide](development/developer-guide.md) | not generated yet |
| [API reference](development/api-reference.md) | 0 routes |
| [Test report](testing/test-report.md) | not run yet |
| [Tests](testing/test-cases.md) | 0 tests |
| [Deployment guide](deployment/deployment-guide.md) | not deployed yet |
| [Runbook](deployment/runbook.md) | not deployed yet |
| [Release notes](deployment/release-notes.md) | 0 releases |
| [Traceability matrix](traceability-matrix.md) | 9 requirements |
| [Changelog](CHANGELOG.md) | 1 version |
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

- Architecture phase has not started: no system design, data model, API contract, or AWS deployment topology is recorded.

### Development

- Development phase has not started: no sprint plan, tickets or implementation records exist.

### Testing

- Testing phase has not started: no test plan, cases or results are recorded for AC-001 to AC-028 or NFR-001 to NFR-010.

### Deployment

- No deployment recorded yet.

### Maintenance

- No maintenance or post-deployment activity recorded; the application has not been deployed.
<!-- sdlc:auto:end open-gaps -->
