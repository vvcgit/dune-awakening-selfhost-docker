# Web Setup Wizard

The Setup page is a helper for first-time RedBlink setup. It does not replace `dune manager`; it wraps the same runtime files and scripts.

## Current Flow

1. Check setup state with `GET /api/setup/state`.
2. Run preflight with `POST /api/setup/preflight`.
3. Write allowlisted `.env` keys with `POST /api/setup/write-config`.
4. Save the Funcom token to `runtime/secrets/funcom-token.txt`.
5. Start `dune init` as a tracked task.

## Safety

- Only allowlisted `.env` keys are written.
- The Funcom token is written with restrictive permissions and audited as redacted.
- `dune init` is a task so output is visible and redacted.
- Host bootstrap remains disabled unless `ALLOW_HOST_BOOTSTRAP=true`; no broad host install flow is exposed by default.

## Recovery

If setup fails:

1. Open Logs and inspect `orchestrator`, `postgres`, `gateway`, and map logs.
2. Run Server Control -> Doctor.
3. Run Readiness.
4. Check `runtime/secrets/funcom-token.txt` exists and is not empty.
5. Use `dune manager` for deeper recovery if the web UI cannot complete setup.
