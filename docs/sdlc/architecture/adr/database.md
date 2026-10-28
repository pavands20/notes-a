<!-- sdlc:auto:start adr -->
# ADR-0003: Use PostgreSQL 16 for Database

Status: Accepted  
Date: 2026-10-28

## Context and Problem Statement

Which Database technology does the project use? Decided in architecture v1.

## Considered Options

- PostgreSQL 16
- SQLite
- MySQL

## Decision Outcome

Chosen option: PostgreSQL 16, because Approved stack. One notes table with a CHECK constraint as defence in depth and a created_at index for newest-first ordering. Data sits on a persistent Docker volume (NFR-003).

## Consequences

Running a database server is heavier than strictly needed for tiny volume, but it was explicitly requested and gives durable storage.
<!-- sdlc:auto:end adr -->