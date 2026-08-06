#!/usr/bin/env bash
set -Eeuo pipefail

repository_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
api_directory="$repository_root/apps/api"
compose_environment="$api_directory/test/config/.env.compose.local"

pnpm --dir "$api_directory" run test:config:generate

compose=(
  docker compose
  --project-name trip-root-test
  --env-file "$compose_environment"
  -f "$repository_root/infra/docker/compose.yaml"
)

cleanup() {
  "${compose[@]}" down --volumes
}
trap cleanup EXIT INT TERM

"${compose[@]}" down --volumes
"${compose[@]}" up --detach --wait postgres

pnpm --dir "$api_directory" run migration:test:show
pnpm --dir "$api_directory" run migration:test:run
pnpm --dir "$api_directory" run migration:test:show
pnpm --dir "$repository_root" exec turbo run test --force
