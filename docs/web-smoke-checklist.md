# Web Smoke Checklist

Use this on a live host after deployment. The first section is non-destructive.

## Non-Destructive

- Open the web UI.
- Log in with the admin password.
- Check Home status.
- Run Server Control -> Readiness.
- Load Services.
- Open Logs for `gateway` or `survival-1`.
- List Backups.
- Open Database and list schemas/tables.
- List Players.
- Open one player profile.
- View that player's inventory.
- Load Storage.
- Load Bases.
- Load Blueprints.
- Load Live Map markers.
- Load Maps status.
- Load Market capabilities/items/listings/stats.
- Load Starter Kit config/history.
- Run Updates -> Check Game Update.
- Run Updates -> Check Stack Update.
- Confirm Whisper returns unsupported unless GM courier identity has been explicitly implemented later.

## Destructive Or Live-Impacting

Run only on a test server or during a maintenance window.

- Create a database backup.
- Give an item to a test player.
- Add XP to a test player.
- Send a test broadcast.
- Delete a known test inventory item.
- Give an item to a known test storage container.
- Restore a backup.
- Reconcile maps.
- Change Sietch settings.
- Change Deep Desert settings.

Every destructive or live-impacting action should show a frontend confirmation, enforce a backend confirmation phrase, audit the attempt, and either create a backup before direct DB writes or use a verified live CLI/RabbitMQ path.
