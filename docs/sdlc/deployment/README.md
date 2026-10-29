# Deployment

> Maintained by QuorQ AI SDLC. Text between `sdlc:auto` markers is regenerated; anything outside them is yours and is kept.

<!-- sdlc:auto:start narrative -->
### DEP-bfb67701aec2 · draft · source: deployment:bfb67701aec2

Notes A version bfb67701aec2 is deployed and its status is reported as live. The release has a frontend endpoint and a backend endpoint, each documented in its own entry.

- Status: live
- Version: bfb67701aec2
- Frontend URL: https://p171ec6182f4b.d13el1ykvx8z63.amplifyapp.com
- Backend URL: https://100-52-98-41.sslip.io/apps/171ec6182f4b/
- Stack (from project description): React frontend, FastAPI backend, Postgres.
- Scope (from project description): one-page app to add a short note, list notes, and delete a note. No login, no file uploads, no AI.

**Related:** DEP-bfb67701aec2-FE, DEP-bfb67701aec2-BE

- ⚠ No deployment date or timestamp recorded.
- ⚠ No record of who performed or approved the deployment.
- ⚠ Environment is not named (e.g. production vs. staging). 'Live' alone does not confirm it is production.
- ⚠ No smoke-test, health-check, or post-deploy verification results provided.
- ⚠ No rollback plan or previous version recorded.
- ⚠ No monitoring, logging, or alerting configuration recorded.
- ⚠ The version string looks like a commit hash, but the input does not confirm this or name the repository or branch.
- ⚠ The input does not state which requirements (US-001 to US-009) are included in this release, so requirement traceability for the deployment cannot be established.
- ⚠ Only one version is given. The input does not confirm that the frontend and backend were both deployed from the same version.
- ⚠ Postgres database deployment details (host, version, migrations applied) are not recorded.

### DEP-bfb67701aec2-FE · draft · source: deployment:bfb67701aec2

The React frontend for release bfb67701aec2 is served at an AWS Amplify-hosted URL.

- URL: https://p171ec6182f4b.d13el1ykvx8z63.amplifyapp.com
- Hosting: the amplifyapp.com domain indicates AWS Amplify hosting. This is inferred from the URL only.
- Release version: bfb67701aec2

**Related:** DEP-bfb67701aec2

- ⚠ No custom domain recorded. It is not stated whether the default Amplify URL is the intended public URL.
- ⚠ No record of how the frontend is configured to reach the backend URL (e.g. environment variable or build setting).

### DEP-bfb67701aec2-BE · draft · source: deployment:bfb67701aec2

The FastAPI backend for release bfb67701aec2 is served under a path on an sslip.io hostname, which resolves to an IP-derived address.

- URL: https://100-52-98-41.sslip.io/apps/171ec6182f4b/
- Hostname format: sslip.io maps the hostname to the embedded IP address (100.52.98.41).
- The path prefix /apps/171ec6182f4b/ suggests the backend runs on a shared host alongside other apps. This is inferred from the URL and not stated in the input.
- Release version: bfb67701aec2

**Related:** DEP-bfb67701aec2

- ⚠ It is not confirmed whether the IP-based sslip.io hostname is the intended long-term backend endpoint or a temporary one.
- ⚠ No health-check endpoint or result recorded for the backend.
- ⚠ No CORS configuration recorded for allowing requests from the Amplify frontend origin.
- ⚠ Database connection and Postgres hosting details for this deployment are not recorded.
<!-- sdlc:auto:end narrative -->
