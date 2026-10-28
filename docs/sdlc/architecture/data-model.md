# Data Model

<!-- sdlc:auto:start entities -->
### notes

| Field | Type | PK | FK | Nullable |
|---|---|---|---|---|
| id | bigint identity | True | — | False |
| text | varchar(280) CHECK (char_length(btrim(text)) >= 1) | False | — | False |
| created_at | timestamptz DEFAULT now() | False | — | False |
<!-- sdlc:auto:end entities -->

<!-- sdlc:auto:start relationships -->
_No relationships recorded._
<!-- sdlc:auto:end relationships -->

<!-- sdlc:auto:start er-diagram -->
```mermaid
erDiagram
  notes {
    bigint_identity id PK
    varchar_280__CHECK__char_length_btrim_text______1_ text
    timestamptz_DEFAULT_now__ created_at
  }
```
<!-- sdlc:auto:end er-diagram -->
