<!-- sdlc:auto:start adr -->
# ADR-0002: Use FastAPI 0.115 for Backend

Status: Accepted  
Date: 2026-10-28

## Context and Problem Statement

Which Backend technology does the project use? Decided in architecture v1.

## Considered Options

- FastAPI 0.115
- Express
- Django REST Framework

## Decision Outcome

Chosen option: FastAPI 0.115, because Approved stack. A Pydantic model with a field validator enforces the 1 to 280 character, non-whitespace rule server-side and returns 422 automatically (NFR-002). Leaving out update routes gives 405 for PUT/PATCH. SQLAlchemy handles data access and Alembic handles migrations.

## Consequences

Synchronous SQLAlchemy sessions are enough at this scale. There is no rate limiting or auth, by accepted decision.
<!-- sdlc:auto:end adr -->