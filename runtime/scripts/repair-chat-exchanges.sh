#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/../.."

is_running() {
  docker ps --format '{{.Names}}' 2>/dev/null | grep -qx "$1"
}

if ! is_running dune-postgres || ! is_running dune-rmq-game; then
  exit 0
fi

guild_ids="$(
  docker exec dune-postgres psql -U dune -d dune -Atc "
    select guild_id
    from dune.guilds
    where guild_id is not null
    order by guild_id;
  " 2>/dev/null || true
)"

[ -n "$guild_ids" ] || exit 0

declared=0
failed=0
bound=0
bind_failed=0

declare_guild_exchange() {
  local exchange="$1"
  local eval_code

  eval_code='XName = rabbit_misc:r(<<"/">>, exchange, <<"'"$exchange"'">>), rabbit_exchange:declare(XName, fanout, false, false, false, [], none), io:format("declared '"$exchange"'~n").'
  docker exec dune-rmq-game rabbitmqctl eval "$eval_code" >/dev/null 2>&1
}

bind_guild_queue() {
  local exchange="$1"
  local queue="$2"
  local exchange_b64 queue_b64 eval_code

  exchange_b64="$(printf '%s' "$exchange" | base64 -w 0)"
  queue_b64="$(printf '%s' "$queue" | base64 -w 0)"
  eval_code='VHost = <<"/">>,
Exchange = base64:decode(<<"'"$exchange_b64"'">>),
Queue = base64:decode(<<"'"$queue_b64"'">>),
X = rabbit_misc:r(VHost, exchange, Exchange),
Q = rabbit_misc:r(VHost, queue, Queue),
Binding = rabbit_binding:new(X, <<"">>, Q, #{}),
rabbit_binding:add(Binding, none),
io:format("bound ~s -> ~s~n", [Exchange, Queue]).'

  docker exec dune-rmq-game rabbitmqctl eval "$eval_code" >/dev/null 2>&1
}

while IFS= read -r guild_id; do
  guild_id="$(printf '%s' "$guild_id" | tr -d '[:space:]')"
  [[ "$guild_id" =~ ^[0-9]+$ ]] || continue

  exchange="chat.guild.$guild_id"
  if declare_guild_exchange "$exchange"; then
    declared=$((declared + 1))
  else
    failed=$((failed + 1))
    echo "WARN failed to declare guild chat exchange: $exchange" >&2
  fi
done <<< "$guild_ids"

guild_bindings="$(
  docker exec dune-postgres psql -U dune -d dune -At -F $'\t' -c "
    select distinct gm.guild_id, concat(ac.\"user\", '_queue') as queue_name
    from dune.guild_members gm
    join dune.player_state ps on ps.player_controller_id = gm.player_id
    join dune.accounts ac on ac.id = ps.account_id
    where gm.guild_id is not null
      and ps.online_status <> 'Offline'
      and coalesce(ac.\"user\", '') <> ''
    order by gm.guild_id, queue_name;
  " 2>/dev/null || true
)"

while IFS=$'\t' read -r guild_id queue_name; do
  guild_id="$(printf '%s' "$guild_id" | tr -d '[:space:]')"
  queue_name="$(printf '%s' "$queue_name" | tr -d '[:space:]')"
  [[ "$guild_id" =~ ^[0-9]+$ ]] || continue
  [[ "$queue_name" =~ ^[A-Za-z0-9_.:@#/+=-]+_queue$ ]] || continue

  exchange="chat.guild.$guild_id"
  if bind_guild_queue "$exchange" "$queue_name"; then
    bound=$((bound + 1))
  else
    bind_failed=$((bind_failed + 1))
    echo "WARN failed to bind guild chat queue: $exchange -> $queue_name" >&2
  fi
done <<< "$guild_bindings"

if [ "$declared" -gt 0 ]; then
  echo "Ensured guild chat exchanges: $declared"
fi

if [ "$bound" -gt 0 ]; then
  echo "Ensured guild chat queue bindings: $bound"
fi

if [ "$bind_failed" -gt 0 ]; then
  echo "WARN some guild chat queue bindings could not be repaired. They will be retried on the next repair pass." >&2
fi

if [ "$failed" -gt 0 ]; then
  exit 1
fi
