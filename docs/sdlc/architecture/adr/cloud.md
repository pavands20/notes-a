<!-- sdlc:auto:start adr -->
# ADR-0004: Use AWS for Cloud

Status: Accepted  
Date: 2026-10-28

## Context and Problem Statement

Which Cloud technology does the project use? Decided in architecture v1.

## Considered Options

- AWS
- Azure
- GCP

## Decision Outcome

Chosen option: AWS, because Approved stack. A single small EC2 instance runs the same Docker Compose file used locally, matching the low-traffic assumption (NFR-009).

## Consequences

There is no managed database or high availability, so backups of the EBS volume are manual. That is acceptable for MVP scale.
<!-- sdlc:auto:end adr -->