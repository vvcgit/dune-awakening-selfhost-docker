# Web Admin Release Checklist

Run this before publishing a release that includes Arrakis Server Console changes.

## Code Quality

- `npm test` passes in `admin-server/`.
- `npm run build` passes in `web/`.
- `git diff --check` passes.
- No frontend page contains fake success states for unsupported features.
- No new route bypasses auth/CSRF for state-changing requests.
- No new command path bypasses `buildDuneArgs` or a validated direct DB/RMQ helper.

## Security

- `ADMIN_AUTH_DISABLED=0` in production.
- `ADMIN_SECURE_COOKIES=1` when served over HTTPS.
- Web admin is behind VPN, SSH tunnel, reverse proxy auth, or private admin network.
- Docker socket exposure is understood and accepted.
- Direct DB write routes create a backup before mutation.
- Dangerous actions require backend confirmation phrases.
- Secrets are redacted from API responses, task logs, and audit details.
- `runtime/generated/web-admin-audit.jsonl` is included in operator log retention planning.

## Packaging

- `docker compose -f docker-compose.web.yml config` passes.
- Container build uses lockfiles with `npm ci`.
- `.env.example` includes web admin, DB, RabbitMQ, task, and mock-mode variables.
- README links to deployment, UI, security, testing, and smoke-check docs.

## Live Smoke

Use `docs/web-smoke-checklist.md`.

Run the non-destructive checklist on every release candidate. Run destructive checks only on a test server or during maintenance.

## Known Blockers To Preserve

These must remain Blocked until separately verified:

- Whisper
- Market automation
- Starter Kit automatic scanner
- Blueprint import/clone/delete
- Base import/delete
