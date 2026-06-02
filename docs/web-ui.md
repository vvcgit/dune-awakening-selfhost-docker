# Web UI Guide

The Arrakis Server Console is organized by operational task.

| Page | Purpose |
|---|---|
| Home | Server overview and quick start/stop/restart controls |
| Setup | First-time setup and preflight checks |
| Server Control | Lifecycle, readiness, ports, doctor, service restart |
| Services | Container/service list with restart and log shortcuts |
| Players | Player list, profile drawer, inventory/profile tabs, player actions |
| Admin Tools | Catalogs, global live actions, broadcast, command history |
| Live Map | Relative coordinate plot plus marker table |
| Maps | Map mode, reconcile, spawn/despawn, autoscaler, memory, Sietches, Deep Desert |
| Market | Read-only market items/listings/sales/stats/catalog where schema supports it |
| Starter Kit | Disabled-by-default config, manual grants, grant history |
| Database | Direct DB browser and SQL console with read-only safety |
| Storage | Storage browser, item export, safe give-item where schema supports it |
| Bases | Base list and read-only base-as-blueprint export |
| Blueprints | Blueprint list and full read-only export |
| Backups | Backup list/create/restore/delete |
| Logs | Service log viewer, stream, download |
| Updates | Game and stack update tasks |
| Settings | Runtime setup state |

## Error Handling

Unsupported features show backend reasons. Dangerous actions require a browser confirmation and a backend phrase. Async actions return tasks and show task progress.

## Blocked Features In The UI

Blocked features should remain disabled or return a clear unsupported response:

- Whisper
- Market automation
- Starter Kit automatic scanner
- Blueprint/base import, clone, and delete

Do not add buttons that claim success for those features until the backend has a verified RedBlink CLI, direct DB, or RabbitMQ path.
