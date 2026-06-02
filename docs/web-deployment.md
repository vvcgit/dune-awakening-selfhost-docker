# Web Admin Deployment

The Arrakis Server Console is an optional web UI for this RedBlink Docker stack. It is an admin-only surface: it can start/stop services, read logs, run backups, inspect Postgres, publish verified RabbitMQ admin broadcasts, and run safe player admin actions.

## Production Container Mode

Build and run the web console from the repo root:

```bash
docker compose -f docker-compose.web.yml up -d --build
```

Default URL:

```text
http://SERVER_IP:8088
```

The initial password is generated at:

```text
runtime/secrets/admin-web-password.txt
```

Set `ADMIN_PASSWORD` only if you need to bootstrap a known password. Prefer changing/removing it after first login so the generated secret file is used.

## Host Mode

For development or local maintenance:

```bash
cd admin-server
npm ci
npm start
```

Build the frontend first:

```bash
cd web
npm ci
npm run build
```

The backend serves `web/dist` by default. Override with `ADMIN_STATIC_DIR` if needed.

## Important Environment Variables

| Variable | Default | Purpose |
|---|---:|---|
| `ADMIN_BIND_HOST` | `0.0.0.0` | Web bind host |
| `ADMIN_BIND_PORT` | `8088` | Web bind port |
| `ADMIN_AUTH_DISABLED` | `0` | Development-only auth bypass |
| `ADMIN_SECURE_COOKIES` | production auto | Adds `Secure` to session cookies |
| `ADMIN_PASSWORD` | generated secret | Optional explicit admin password |
| `DUNE_DOCKER_DIR` | current repo | Runtime repo path |
| `ADMIN_DATABASE_URL` | empty | Direct Postgres URL override |
| `DUNE_DB_*` / `PG*` | RedBlink defaults | Direct Postgres host/user/password overrides |
| `DUNE_COMMAND_AUTH_TOKEN` | runtime secret/built-in | Server command RabbitMQ auth token override |
| `ADMIN_TASK_RETENTION` | `200` | In-memory task retention |
| `ADMIN_COMMAND_TIMEOUT_MS` | `120000` | CLI command timeout |
| `ADMIN_MAX_JSON_BYTES` | `2097152` | JSON request body limit |
| `ADMIN_MOCK_MODE` | `0` | UI/mock development mode only |
| `ALLOW_HOST_BOOTSTRAP` | `false` | Reserved gated host bootstrap flag |

## Docker Socket Warning

`docker-compose.web.yml` mounts `/var/run/docker.sock`. This grants broad Docker control to the web container. Do not expose the web admin publicly. Put it behind a trusted VPN, SSH tunnel, or private admin network.

## Database Defaults

Direct DB features use this discovery order:

1. `ADMIN_DATABASE_URL`
2. `DUNE_DB_*` / `PG*`
3. RedBlink defaults: `127.0.0.1:15432`, database `dune`, user `dune`, password `dune`

Passwords and connection strings are redacted from API responses and logs.

## RabbitMQ Support

Broadcast and shutdown broadcast use a verified RedBlink server-command path:

- container: `dune-rmq-game`
- exchange: `heartbeats`
- routing key: `notifications`

The web admin does not expose a generic RabbitMQ publisher. Whisper remains blocked until RedBlink exposes a verified GM courier identity and `chat.whispers` routing.
