# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-e9b2c94ec08d · draft · source: deployment:e9b2c94ec08d

Notes A is reported as live at version e9b2c94ec08d. The deployment has two parts: a React frontend and a FastAPI backend. The input confirms only the status, version and URLs.

- Project: Notes A, a one-page app to add, list and delete short notes. It has no login, no file uploads and no AI.
- Stack, from the project description: React frontend, FastAPI backend, Postgres.
- Deployment status: live
- Version: e9b2c94ec08d
- Frontend URL: https://p171ec6182f4b.d13el1ykvx8z63.amplifyapp.com
- Backend URL: https://100-52-98-41.sslip.io/apps/171ec6182f4b/
- Date, deployer, approver and environment name: not provided.

**Related:** DEP-e9b2c94ec08d-FE, DEP-e9b2c94ec08d-BE

- ⚠ No deployment date or time recorded.
- ⚠ No deployer or approver recorded. Approval status is unknown, so this entry is marked draft.
- ⚠ No environment name given (e.g. production vs. staging/preview).
- ⚠ No release notes or change list for version e9b2c94ec08d.
- ⚠ No mapping from this deployment to requirements US-001 to US-009. It is unconfirmed which requirements this version delivers.
- ⚠ No test or QA sign-off referenced for this version.
- ⚠ No post-deployment smoke test or health check results recorded.
- ⚠ No rollback plan or previous version recorded.
- ⚠ No database (Postgres) deployment or migration details recorded.

### DEP-e9b2c94ec08d-FE · draft · source: deployment:e9b2c94ec08d

Frontend endpoint for the live Notes A deployment. The URL is on an amplifyapp.com domain.

- Frontend URL: https://p171ec6182f4b.d13el1ykvx8z63.amplifyapp.com
- Component: React frontend, per the project description.
- Version: e9b2c94ec08d

**Related:** DEP-e9b2c94ec08d

- ⚠ The input does not state which backend URL the frontend is configured to call. Assumed to be the backend URL listed below, but unconfirmed.
- ⚠ No custom domain, CDN or caching configuration recorded.
- ⚠ No record that this URL was verified reachable after deployment.

### DEP-e9b2c94ec08d-BE · draft · source: deployment:e9b2c94ec08d

Backend endpoint for the live Notes A deployment, served under an app-specific path on an sslip.io hostname.

- Backend URL: https://100-52-98-41.sslip.io/apps/171ec6182f4b/
- Component: FastAPI backend with Postgres, per the project description.
- Version: e9b2c94ec08d

**Related:** DEP-e9b2c94ec08d

- ⚠ The hostname is an sslip.io wildcard DNS name derived from an IP address. The input does not say whether this is the intended long-term endpoint or a temporary one.
- ⚠ No API health check endpoint or verification result recorded.
- ⚠ No hosting details for the Postgres database (location, backups, credential management).
- ⚠ No CORS configuration recorded linking this backend to the frontend origin.
<!-- sdlc:auto:end narrative -->
