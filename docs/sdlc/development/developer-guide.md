# Developer Guide

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start status -->
_Up to date._
<!-- sdlc:auto:end status -->

<!-- sdlc:auto:start source -->
Generated from commit `bfb6770` · model `auto`
<!-- sdlc:auto:end source -->

<!-- sdlc:auto:start overview -->
Notes A is a one-page notes app: a user can add a short note (up to 280 characters), see the list of notes, and delete a note. There is no login and no auth. One repository holds two applications. `frontend/` is a Vite + React 19 + TypeScript SPA styled with Tailwind CSS v4 and routed with react-router-dom; its single `/notes` screen still renders seeded sample data. `src/lib/api.ts` provides an `apiFetch` helper for wiring it to the API, but the screens do not use it yet. `backend/` is a FastAPI service using SQLAlchemy 2.0 and Alembic. It exposes `GET /health`, `GET /notes`, `POST /notes` and `DELETE /notes/{note_id}`. The root README still says the backend has only a health check; the code now includes the notes router. The backend uses SQLite (`sqlite:///./app.db`) unless `DATABASE_URL` is set. `docker-compose.yml` provides a local PostgreSQL 16. The frontend deploys to AWS Amplify and the API image to ECR via the GitHub Actions workflow `.github/workflows/deploy.yml`.
<!-- sdlc:auto:end overview -->

<!-- sdlc:auto:start prerequisites -->
- Node.js with npm (a version supported by Vite 6 / TypeScript 5.6)
- Python 3.12 with pip (the backend Dockerfile uses python:3.12-slim)
- Docker with Docker Compose (optional: for the local PostgreSQL 16 in docker-compose.yml and for building the backend image)
- Chromium for Playwright (installed via `npm run test:e2e:install`; only needed for end-to-end tests)
<!-- sdlc:auto:end prerequisites -->

<!-- sdlc:auto:start setup -->
1. cd backend
2. python -m venv .venv
3. .venv/bin/pip install -r requirements.txt
4. .venv/bin/alembic upgrade head
5. .venv/bin/uvicorn app.main:app --reload
6. In a second terminal: cd frontend
7. npm install
8. npm run dev
<!-- sdlc:auto:end setup -->

<!-- sdlc:auto:start run -->
| Name | Command | Description |
|---|---|---|
| frontend dev | `cd frontend && npm run dev` | Starts the Vite dev server (default origin http://localhost:5173, which the backend's CORS allows by default). |
| frontend build | `cd frontend && npm run build` | Bundles the SPA into frontend/dist with `vite build`. It does not typecheck. |
| frontend preview | `cd frontend && npm run preview` | Serves the built bundle locally with `vite preview`. |
| migrate | `cd backend && alembic upgrade head` | Applies the Alembic migrations (creates the `notes` table). main.py does not create tables itself. |
| backend dev | `cd backend && uvicorn app.main:app --reload` | Runs the FastAPI app with auto-reload on http://localhost:8000. Uses SQLite at ./app.db unless DATABASE_URL is set. |
| postgres | `docker compose up -d db` | Starts PostgreSQL 16 on localhost:5432 (user/password/db: app/app/app) from docker-compose.yml. |
| backend image | `docker build -t notes-a-backend ./backend` | Builds the API image. The container runs `alembic upgrade head` and then serves uvicorn on port 8000 as an unprivileged user, with a /health healthcheck. |
| format frontend | `cd frontend && npm run format` | Rewrites frontend files with Prettier (`npm run format:check` only checks). |
| format backend | `cd backend && ruff format .` | Formats backend Python with Ruff. |
<!-- sdlc:auto:end run -->

<!-- sdlc:auto:start structure -->
| Path | Purpose |
|---|---|
| `.github/` | GitHub configuration. |
| `.github/workflows/` | deploy.yml: on push/PR to main, builds and pushes the backend image to ECR (main only) and builds and deploys the frontend to an AWS Amplify branch using OIDC credentials. |
| `.quorq/` | Quorq platform metadata (handoff.json, prepared.json). Contents not shown here. |
| `backend/` | FastAPI service: Dockerfile, requirements.txt, alembic.ini, pytest.ini, ruff.toml. |
| `backend/app/` | Application code: main.py (app, CORS, /health), database.py (engine, session, get_db), models.py (SQLAlchemy Note), schemas.py (Pydantic NoteCreate/NoteOut), routers/notes.py (notes endpoints). |
| `backend/alembic/` | Alembic environment and migrations (versions/0001_create_notes.py). |
| `backend/scripts/` | Utility scripts (check_connections.py; contents not shown). |
| `backend/tests/` | Pytest tests for the health check and the notes API. |
| `frontend/` | Vite + React SPA: package.json, vite.config.ts, tsconfig.json, eslint.config.js, .prettierrc, playwright.config.ts, index.html. |
| `frontend/src/` | App source: main.tsx (router bootstrap), App.tsx (nav shell and route table), screens/ (one module per approved screen, e.g. Notes.tsx), lib/ (api.ts client, ui.tsx/icons.tsx component vocabulary, brand.ts tokens, navigate.ts), index.css (brand CSS variables), test-setup.ts. |
| `frontend/e2e/` | Playwright end-to-end specs (notes.spec.ts, example.spec.ts). |
<!-- sdlc:auto:end structure -->

<!-- sdlc:auto:start conventions -->
- Frontend imports use the `@/` alias for `src/` (configured in vite.config.ts and tsconfig.json).
- One module per screen in `src/screens/`; routes are declared centrally in `src/App.tsx`. Unknown paths redirect to `/notes`.
- Styling uses Tailwind CSS v4 utility classes plus `--brand-*` CSS variables defined in `src/index.css` and mirrored in `src/lib/brand.ts`.
- Component tests (`*.test.tsx`) sit beside the components they cover and run under Vitest with jsdom and globals. Playwright specs live only in `e2e/`.
- TypeScript runs in `strict` mode but with `noImplicitAny` and `strictNullChecks` turned off. `npm run build` does not typecheck; use `npm run typecheck`.
- Frontend API calls are meant to go through `apiFetch` in `src/lib/api.ts`. It reads `VITE_API_BASE_URL` (default http://localhost:8000) and `VITE_API_SECRET_KEY`, and sends a Bearer header when the key is set. No screen uses it yet.
- Backend: one APIRouter per component under `app/routers/`, each with a `prefix` and `tags`, included in `app/main.py`.
- Request/response models are Pydantic v2 classes named `<Entity>Create` / `<Entity>Out`. Output models use `from_attributes=True`.
- SQLAlchemy 2.0 typed models (`Mapped[...]`, `mapped_column`) inherit `app.database.Base`. The schema changes only through Alembic migrations.
- Handlers are sync functions using the `Db = Annotated[Session, Depends(get_db)]` dependency (one session per request).
- Configuration comes from env vars read in code: `DATABASE_URL` (backend DB), `ALLOWED_ORIGINS` (comma-separated CORS origins; defaults to localhost:5173), and `VITE_API_BASE_URL` / `VITE_API_SECRET_KEY` (frontend, baked in at build time).
- Linting and formatting: ESLint and Prettier on the frontend, Ruff (check and format) on the backend.
<!-- sdlc:auto:end conventions -->

<!-- sdlc:auto:start testing -->
| Name | Command | Description |
|---|---|---|
| backend tests | `cd backend && pytest` | Runs the pytest suite in backend/tests. pytest.ini sets `pythonpath = .` so `import app` works when run from backend/. |
| backend lint | `cd backend && ruff check .` | Lints backend Python with Ruff. |
| frontend unit tests | `cd frontend && npm test` | Runs Vitest component tests matching src/**/*.{test,spec}.{ts,tsx} (passes when there are no tests). |
| frontend lint | `cd frontend && npm run lint` | Runs ESLint over the frontend. The platform uses this as a gate; `npm run lint:fix` applies automatic fixes. |
| typecheck | `cd frontend && npm run typecheck` | Runs `tsc --noEmit`. This is not part of the build. |
| format check | `cd frontend && npm run format:check` | Checks Prettier formatting without writing changes. |
| e2e install | `cd frontend && npm run test:e2e:install` | Downloads the Chromium browser for Playwright. |
| e2e | `cd frontend && npm run test:e2e` | Runs the Playwright specs in e2e/. Without E2E_BASE_URL it starts the backend from backend/.venv on port 8000 and a built preview of the frontend on port 4173. With E2E_BASE_URL set, it runs against that URL instead. |
<!-- sdlc:auto:end testing -->

<!-- sdlc:auto:start troubleshooting -->
| Problem | Solution |
|---|---|
| API calls fail with "no such table: notes" (or the Postgres equivalent). | The app does not create tables itself. Run `alembic upgrade head` from backend/ against the same database the app uses. Check that backend/alembic/env.py and alembic.ini (not shown here) point at the same DATABASE_URL. |
| You expect Postgres, but data lands in backend/app.db. | The backend defaults to SQLite when DATABASE_URL is unset. Start Postgres with `docker compose up -d db`, then set DATABASE_URL to a SQLAlchemy URL for it using the installed psycopg v3 driver and the compose credentials (app/app, database app, port 5432). Then rerun migrations. |
| The browser reports CORS errors calling the API. | By default only http://localhost:5173 and http://127.0.0.1:5173 are allowed. If the frontend runs elsewhere (e.g. `npm run preview` on 4173), set ALLOWED_ORIGINS to a comma-separated list of origins before starting uvicorn. |
| Notes added in the UI don't reach the backend. | This is expected for now. The screens render seeded sample data and do not call the API yet. Wire screens to the endpoints via `apiFetch` in src/lib/api.ts. |
| `npm run build` passes but `npm run typecheck` fails. | The build does not typecheck. Fix the reported types, often an untyped `useState({})` that is later read for named fields. |
| `npm run test:e2e` fails to start the backend web server. | Playwright runs `.venv/bin/python -m uvicorn` from backend/. Create backend/.venv and install requirements.txt into it, and run `npm run test:e2e:install` for Chromium. |
| pytest cannot `import app`. | Run `pytest` from the backend/ directory so pytest.ini's `pythonpath = .` applies. |
| Security: `.github/workflows/deploy.yml` hardcodes `VITE_API_SECRET_KEY` / `NEXT_PUBLIC_API_SECRET_KEY` in plain text, despite its comment that nothing there can leak. Vite also inlines `VITE_` values into the public bundle. | Treat that value as exposed. Rotate it, and move it to a GitHub Actions secret if it must stay. Note that the shown backend code does not check any bearer token: the notes endpoints have no auth by design. |
<!-- sdlc:auto:end troubleshooting -->
