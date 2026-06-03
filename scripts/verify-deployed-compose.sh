#!/bin/sh
set -eu

service="${1:-av-efi-frontend}"
timeout_seconds="${2:-120}"
interval_seconds=5
elapsed_seconds=0

container_id="$(docker compose ps -q "$service")"

if [ -z "$container_id" ]; then
  echo "No container found for service: $service" >&2
  docker compose ps >&2
  exit 1
fi

while [ "$elapsed_seconds" -lt "$timeout_seconds" ]; do
  health="$(docker inspect --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}missing{{end}}' "$container_id")"
  state="$(docker inspect --format='{{.State.Status}}' "$container_id")"
  echo "Deployment health: service=$service state=$state health=$health elapsed=${elapsed_seconds}s"

  if [ "$state" != "running" ]; then
    docker logs --tail 200 "$container_id" >&2
    exit 1
  fi

  if [ "$health" = "healthy" ]; then
    exit 0
  fi

  if [ "$health" = "unhealthy" ]; then
    docker logs --tail 200 "$container_id" >&2
    exit 1
  fi

  sleep "$interval_seconds"
  elapsed_seconds=$((elapsed_seconds + interval_seconds))
done

echo "Timed out waiting for healthy deployment: service=$service" >&2
docker logs --tail 200 "$container_id" >&2
exit 1
