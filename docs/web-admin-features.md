# Web Admin Features

This page summarizes what the current web admin can safely do. The authoritative parity ledger is `docs/web-feature-parity-status.md`.

## Done

- Server status, readiness, ports, services, doctor
- Start, stop, restart, restart service
- Service logs, streaming logs, log download
- Backup list/create/restore/delete
- Game and stack update check/apply tasks
- Direct DB browser: schemas, tables, columns, preview, count, search, SQL, export
- Player list/search/online/profile/inventory/currency/factions/specs/position
- CLI-backed player actions: Give Item, Give Item by ID, Give Multiple Items, Add XP, Set Skill Points, Set Skill Module, Refill Water, Kick, Kick All Online, Teleport, Spawn Vehicle, Clean Inventory, Reset Progression
- Direct DB mutations where schema supports them: Add Currency/Solaris, Add Faction Reputation, Repair Gear, Refuel Vehicle, Inventory Delete, Storage Give Item
- Broadcast and shutdown broadcast through verified RedBlink RabbitMQ server-command envelopes
- Live Map relative marker view for players, vehicles, bases, storage, and map services where schema supports transforms
- Maps, autoscaler, memory, Sietch, and Deep Desert controls through validated RedBlink CLI wrappers
- Market read views where the `dune_exchange_*` schema exists
- Starter Kit config/manual grant/history through existing RedBlink admin commands
- Full read-only blueprint export where blueprint tables exist
- Read-only base-as-blueprint export where base/placeable tables exist

## Partial

- Storage Give Item checks slot count only; full volume/stack rules require deeper schema confirmation.
- Live Map uses raw world coordinates; calibrated map image transforms remain unverified.
- Player progression/events/stats/history return unsupported capability responses until exact RedBlink schema mappings are verified.
- Settings exposes setup/runtime state and map memory, not a full `.env`/UserGame/UserEngine editor.
- Starter Kit has manual grants, but no automatic new-player scanner.

## Blocked

- Whisper: missing verified GM courier identity, sender Funcom ID, sender hex FLS ID, recipient Funcom ID mapping, and `chat.whispers` routing exposure.
- Market automation: no RedBlink-compatible market-bot runtime or CLI wrapper exists.
- Blueprint import/clone/delete: unsafe until offline-player inventory ownership, blueprint item stat wiring, and ID remapping rules are verified.
- Base import/delete: unsafe until building/placeable/inventory graph remapping and deletion rules are verified.

Blocked features are intentionally visible only as unsupported capability responses or disabled UI affordances. They are not fake successes.
