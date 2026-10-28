# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-922eb33eae0e · draft · source: deployment:922eb33eae0e

Notes A version 922eb33eae0e is recorded as live. It has a separately hosted React frontend and FastAPI backend, each with its own URL.

- Status: live
- Version: 922eb33eae0e
- Frontend URL: https://p171ec6182f4b.d13el1ykvx8z63.amplifyapp.com
- Backend URL: https://100-52-98-41.sslip.io/apps/171ec6182f4b/
- Stack, from the project description: React frontend, FastAPI backend, Postgres.
- Scope, from the project description: one-page app to add a short note, list notes and delete a note. No login, no file uploads, no AI.

**Related:** DEP-922eb33eae0e-FE, DEP-922eb33eae0e-BE

- ⚠ No deployment date or time recorded.
- ⚠ No deployer or approver recorded. Entry status is left as draft because no approval was provided.
- ⚠ Environment not named (e.g. production vs. staging), although status is 'live'.
- ⚠ Input does not state which requirements (US-001 to US-009) are included in this version, so the requirement-to-release link cannot be confirmed.
- ⚠ No release notes or change list for this version.
- ⚠ No post-deployment verification, health-check or smoke-test results recorded.
- ⚠ No rollback plan or previous version recorded.
- ⚠ No monitoring, logging or alerting configuration recorded.
- ⚠ Version format looks like a commit hash, but the input does not confirm what it refers to (commit, build or image tag).

### DEP-922eb33eae0e-FE · draft · source: deployment:922eb33eae0e

Frontend endpoint for the live Notes A deployment. The URL is an amplifyapp.com domain.

- URL: https://p171ec6182f4b.d13el1ykvx8z63.amplifyapp.com
- Component: React frontend, per the project description.
- Hosting: the amplifyapp.com domain suggests AWS Amplify Hosting. This is inferred from the URL only and is not stated in the input.

**Related:** DEP-922eb33eae0e

- ⚠ Hosting platform not explicitly stated; the AWS Amplify inference is based on the domain only.
- ⚠ No custom domain recorded. Whether the generated amplifyapp.com URL is the intended user-facing address is not stated.
- ⚠ Frontend build or configuration details (e.g. the backend API base URL it is configured with) not recorded.

### DEP-922eb33eae0e-BE · draft · source: deployment:922eb33eae0e

Backend endpoint for the live Notes A deployment. It is served under an app-specific path on an sslip.io hostname.

- URL: https://100-52-98-41.sslip.io/apps/171ec6182f4b/
- Component: FastAPI backend, per the project description.
- Hostname: uses sslip.io wildcard DNS, which maps the name to IP 100.52.98.41. The path segment /apps/171ec6182f4b/ suggests a shared host serving multiple apps. This is inferred from the URL and not stated in the input.
- Database: Postgres per the project description. No database deployment details were provided.

**Related:** DEP-922eb33eae0e

- ⚠ No Postgres deployment details recorded (host, managed vs. self-hosted, migrations applied, backups).
- ⚠ Backend is addressed via an IP-based sslip.io hostname rather than a named domain. Whether this is intended for a live deployment is not stated.
- ⚠ No API health or readiness check result recorded.
- ⚠ No configuration or secrets management details recorded (e.g. CORS allowed origins for the frontend URL, database credentials handling).
<!-- sdlc:auto:end narrative -->
