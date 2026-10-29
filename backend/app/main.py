"""Application entrypoint. The schema is created by Alembic (`alembic upgrade head`)."""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import notes

app = FastAPI(
    title="Notes A",
    description=(
        "A one-page app to add, list and delete short notes. "
        "React frontend, FastAPI backend, Postgres."
    ),
    version="0.1.0",
)

# In development the origin is the Vite dev server; when deployed, the platform injects
# the frontend's URL as ALLOWED_ORIGINS (comma separated).
_dev_origins = ["http://localhost:5173", "http://127.0.0.1:5173"]
_allowed_origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins or _dev_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes.router)


@app.get("/health")
async def health() -> dict[str, str]:
    """Liveness probe."""
    return {"status": "ok"}
