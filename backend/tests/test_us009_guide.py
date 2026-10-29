"""US-009 acceptance: the README guide and docker-compose.yml contract.

Starting Docker itself cannot be done inside this sandbox, so AC-026/NFR-005
are verified statically (compose defines db, backend, frontend, with ports and
ordering) plus README steps.
"""

import re
from pathlib import Path

import pytest

ROOT = Path(__file__).resolve().parents[2]
README = (ROOT / "README.md").read_text(encoding="utf-8")
COMPOSE = (ROOT / "docker-compose.yml").read_text(encoding="utf-8")
LOW = README.lower()


def has(*patterns: str) -> bool:
    return all(re.search(p, LOW) for p in patterns)


def test_ac026_nfr005_compose_defines_three_services():
    for svc in ("db", "backend", "frontend"):
        assert re.search(rf"^  {svc}:", COMPOSE, re.M), f"missing service {svc}"
    assert "postgres" in COMPOSE
    assert "5173" in COMPOSE or "4173" in COMPOSE or "80:" in COMPOSE
    assert "8000" in COMPOSE
    assert "depends_on" in COMPOSE


def test_ac026_nfr005_readme_start_steps_and_urls():
    assert has(r"docker compose (up|-f)|docker-compose up")
    assert has(r"docker") and has(r"git clone|checkout|repository")
    assert has(r"localhost:(5173|4173|3000|8080)|127\.0\.0\.1:(5173|4173|3000|8080)")
    assert has(r"localhost:8000|127\.0\.0\.1:8000")


def test_ac027_nfr006_usage_add_view_delete_and_migration():
    assert has(r"\badd")
    assert has(r"\bview|\bsee\b|\blist")
    assert has(r"\bdelet")
    assert has(r"migrat")
    assert has(r"alembic upgrade head|migration")


@pytest.mark.parametrize(
    "name,pattern",
    [
        ("280 limit", r"280"),
        (
            "no editing",
            r"no edit|cannot (be )?edit|can't (be )?edit|not (be )?edit|edit(ing)? (is )?(not|un)",
        ),
        ("permanent delete", r"permanent"),
        ("no confirmation", r"without (a )?confirm|no confirm|not ask for confirm|no confirmation"),
        ("anyone can delete any", r"anyone|any user|any note"),
        ("no rate limiting", r"rate.limit"),
        ("no spam protection", r"spam"),
        ("no pagination", r"paginat"),
    ],
)
def test_ac028_nfr006_limits_documented(name, pattern):
    assert re.search(pattern, LOW), f"README does not state: {name}"


def test_ac028_limits_stated_as_absent():
    assert re.search(r"no (\w+[ ,/]+){0,4}rate.limit|rate.limit\w*[^.\n]*(no|not|none)", LOW)
    assert re.search(r"no (\w+[ ,/]+){0,6}paginat|paginat\w*[^.\n]*(no|not|none)", LOW)
