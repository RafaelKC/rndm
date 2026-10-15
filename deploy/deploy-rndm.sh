#!/usr/bin/env bash
# Server-side deploy script for rndm.chicovis.dev (it does not build: it pulls
# the image that GitHub Actions already built).
#
# Install it ROOT-OWNED at /usr/local/bin/deploy-rndm.sh (see docs/deploy.md). It is the *forced command*
# of the GitHub Actions SSH key: whatever the pipeline sends, this is the only thing that runs, and the
# deploy user cannot edit it. The pipeline only passes an image tag (the commit SHA), which arrives in
# $SSH_ORIGINAL_COMMAND and is strictly validated. If the new version does not become healthy,
# the previous one is restored.
set -euo pipefail

APP_DIR=/opt/rndm                    # root-owned: docker-compose.yml
STATE_DIR=/var/lib/deploy-rndm       # owned by the deploy user: lock + current tag
IMAGE=ghcr.io/rafaelkc/rndm
CONTAINER=rndm-container
COMPOSE=(docker compose -f "$APP_DIR/docker-compose.yml")

tag="${SSH_ORIGINAL_COMMAND:-latest}"
if [[ ! "$tag" =~ ^[A-Za-z0-9_][A-Za-z0-9_.-]{0,127}$ ]]; then
  echo "refused: invalid image tag" >&2
  exit 2
fi

# One deploy at a time.
exec 9>"$STATE_DIR/lock"
flock -n 9 || { echo "refused: another deploy is running" >&2; exit 3; }

previous="$(cat "$STATE_DIR/current" 2>/dev/null || true)"

echo "==> pulling $IMAGE:$tag"
docker pull "$IMAGE:$tag"

echo "==> starting $tag"
RNDM_TAG="$tag" "${COMPOSE[@]}" up -d --remove-orphans

echo "==> waiting for the container to be healthy"
healthy=false
for _ in $(seq 1 30); do
  if [[ "$(docker inspect -f '{{.State.Health.Status}}' "$CONTAINER" 2>/dev/null || true)" == "healthy" ]]; then
    healthy=true
    break
  fi
  sleep 2
done

if [[ "$healthy" != true ]]; then
  echo "!! $tag did not become healthy" >&2
  if [[ -n "$previous" ]]; then
    echo "==> rolling back to $previous" >&2
    RNDM_TAG="$previous" "${COMPOSE[@]}" up -d --remove-orphans
  fi
  exit 1
fi

echo "$tag" > "$STATE_DIR/current"
docker image prune -f >/dev/null
echo "==> deployed $tag"
