#!/usr/bin/env bash
set -Eeuo pipefail

web_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
repository_root="$(cd -- "$web_directory/../.." && pwd)"
api_directory="$repository_root/apps/api"
compose_environment="$api_directory/test/config/.env.compose.local"

pnpm --dir "$api_directory" run test:config:generate

compose=(
  docker compose
  --project-name trip-auth-web-e2e
  --env-file "$compose_environment"
  -f "$repository_root/infra/docker/compose.yaml"
)

cleanup() {
  "${compose[@]}" down --volumes
}
trap cleanup EXIT INT TERM

# The fixed project name and fixed test-only port scope destructive cleanup to
# this isolated E2E database, never the development Compose project.
"${compose[@]}" down --volumes
"${compose[@]}" up --detach --wait postgres

pnpm --dir "$api_directory" run migration:test:show
pnpm --dir "$api_directory" run migration:test:run
pnpm --dir "$api_directory" run migration:test:show
pnpm --dir "$api_directory" run build
WEB_INTERNAL_API_ORIGIN=http://localhost:43001 \
  pnpm --dir "$web_directory" run build
pnpm --dir "$web_directory" run test:e2e

# Rebuild with a deliberately unused loopback origin, start only Web, and
# verify that a real upstream connection failure is not treated as a 401.
WEB_INTERNAL_API_ORIGIN=http://127.0.0.1:59999 \
  pnpm --dir "$web_directory" run build
WEB_INTERNAL_API_ORIGIN=http://127.0.0.1:59999 \
  pnpm --dir "$web_directory" exec playwright test \
  --config playwright.outage.config.ts
