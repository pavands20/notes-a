<!-- sdlc:auto:start adr -->
# ADR-0001: Use React 19 for Frontend

Status: Accepted  
Date: 2026-10-28

## Context and Problem Statement

Which Frontend technology does the project use? Decided in architecture v1.

## Considered Options

- React 19
- Vue
- Svelte

## Decision Outcome

Chosen option: React 19, because Approved stack. A single page with a form and a list built from three components (NoteForm, NoteList, NoteItem). It is built with Vite as the requirements assume. React escapes text nodes by default, which satisfies the plain-text display requirement (NFR-001). It uses the native fetch API and Intl for timestamps.

## Consequences

Updates are not real-time: other visitors see changes on reload, which AC-005 accepts. Not using dangerouslySetInnerHTML must be enforced through code review or an ESLint rule.
<!-- sdlc:auto:end adr -->