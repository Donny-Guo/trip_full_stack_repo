#!/usr/bin/env bash
set -Eeuo pipefail

api_directory="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
repository_root="$(cd -- "$api_directory/../.." && pwd)"
compose_environment="$api_directory/test/config/.env.compose.local"
runtime_environment="$api_directory/test/config/.env.runtime.local"
migration_environment="$api_directory/test/config/.env.migration.local"

for required_file in \
  "$compose_environment" \
  "$runtime_environment" \
  "$migration_environment"; do
  if [[ ! -f "$required_file" ]]; then
    printf 'Missing test configuration: %s\n' "$required_file" >&2
    exit 1
  fi
done

compose=(
  docker compose
  --project-name trip-auth-api-test
  --env-file "$compose_environment"
  -f "$repository_root/infra/docker/compose.yaml"
)

cleanup() {
  "${compose[@]}" down --volumes
}
trap cleanup EXIT INT TERM

# The fixed project name makes this destructive reset target only the isolated
# test database, never the development Compose project or its named volume.
"${compose[@]}" down --volumes
"${compose[@]}" up --detach --wait postgres

pnpm --dir "$api_directory" run migration:test:show
pnpm --dir "$api_directory" run migration:test:run
pnpm --dir "$api_directory" run migration:test:show
pnpm --dir "$api_directory" run test:integration
