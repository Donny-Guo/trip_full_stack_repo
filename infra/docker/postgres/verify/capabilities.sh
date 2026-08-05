#!/usr/bin/env bash
set -Eeuo pipefail

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
}

pass() {
  printf 'PASS: %s\n' "$1"
}

denied() {
  printf 'DENIED: %s\n' "$1"
}

required_variables=(
  POSTGRES_DB
  POSTGRES_USER
  POSTGRES_PASSWORD
  TRIP_DB_MIGRATOR_USER
  TRIP_DB_MIGRATOR_PASSWORD
  TRIP_DB_RUNTIME_USER
  TRIP_DB_RUNTIME_PASSWORD
)

for variable_name in "${required_variables[@]}"; do
  if [[ -z "${!variable_name:-}" ]]; then
    fail "required environment variable $variable_name is missing"
  fi
done

identifier_variables=(
  POSTGRES_DB
  POSTGRES_USER
  TRIP_DB_MIGRATOR_USER
  TRIP_DB_RUNTIME_USER
)

for variable_name in "${identifier_variables[@]}"; do
  identifier_value="${!variable_name}"
  if [[ ! "$identifier_value" =~ ^[a-z_][a-z0-9_]{0,62}$ ]]; then
    fail "$variable_name is not a supported lowercase PostgreSQL identifier"
  fi
done

password_variables=(
  POSTGRES_PASSWORD
  TRIP_DB_MIGRATOR_PASSWORD
  TRIP_DB_RUNTIME_PASSWORD
)

for variable_name in "${password_variables[@]}"; do
  password_value="${!variable_name}"
  if [[ ! "$password_value" =~ ^[0-9a-f]{64}$ ]]; then
    fail "$variable_name is not one 64-character hexadecimal value"
  fi
done

if [[ "$POSTGRES_USER" == "$TRIP_DB_MIGRATOR_USER" ||
  "$POSTGRES_USER" == "$TRIP_DB_RUNTIME_USER" ||
  "$TRIP_DB_MIGRATOR_USER" == "$TRIP_DB_RUNTIME_USER" ]]; then
  fail 'database role names must be pairwise distinct'
fi

if [[ "$POSTGRES_PASSWORD" == "$TRIP_DB_MIGRATOR_PASSWORD" ||
  "$POSTGRES_PASSWORD" == "$TRIP_DB_RUNTIME_PASSWORD" ||
  "$TRIP_DB_MIGRATOR_PASSWORD" == "$TRIP_DB_RUNTIME_PASSWORD" ]]; then
  fail 'database role passwords must be pairwise distinct'
fi

run_sql() {
  local role_name="$1"
  local password="$2"
  local sql="$3"

  PGCONNECT_TIMEOUT=5 PGPASSWORD="$password" psql \
    --host=127.0.0.1 \
    --port=5432 \
    --username="$role_name" \
    --dbname="$POSTGRES_DB" \
    --no-password \
    --no-psqlrc \
    --quiet \
    --tuples-only \
    --no-align \
    --set=ON_ERROR_STOP=1 \
    --set=VERBOSITY=sqlstate \
    --set=provisioner_user="$POSTGRES_USER" \
    --set=migrator_user="$TRIP_DB_MIGRATOR_USER" \
    --set=runtime_user="$TRIP_DB_RUNTIME_USER" \
    <<<"$sql"
}

assert_scalar() {
  local label="$1"
  local expected="$2"
  local sql="$3"
  local actual=''

  if ! actual="$(
    run_sql "$POSTGRES_USER" "$POSTGRES_PASSWORD" "$sql" 2>&1
  )"; then
    fail "$label query failed"
  fi

  if [[ "$actual" != "$expected" ]]; then
    fail "$label did not match the expected value"
  fi

  pass "$label"
}

assert_identity() {
  local role_name="$1"
  local password="$2"
  local expected_schemas="${3:-}"
  local sql="SELECT current_user || '|' || current_database();"
  local expected="$role_name|$POSTGRES_DB"
  local actual=''

  if [[ -n "$expected_schemas" ]]; then
    sql="SELECT current_user || '|' || current_database() || '|' || array_to_string(current_schemas(false), ',');"
    expected="$expected|$expected_schemas"
  fi

  if ! actual="$(run_sql "$role_name" "$password" "$sql" 2>&1)"; then
    fail "$role_name could not connect over TCP"
  fi

  if [[ "$actual" != "$expected" ]]; then
    fail "$role_name returned an unexpected identity, database, or schema path"
  fi

  pass "$role_name TCP identity"
}

expect_success() {
  local label="$1"
  local role_name="$2"
  local password="$3"
  local sql="$4"
  local output=''

  if ! output="$(run_sql "$role_name" "$password" "$sql" 2>&1)"; then
    fail "$label unexpectedly failed"
  fi

  pass "$label"
}

expect_denied() {
  local label="$1"
  local role_name="$2"
  local password="$3"
  local sql="$4"
  local output=''
  local status=0

  if output="$(run_sql "$role_name" "$password" "$sql" 2>&1)"; then
    fail "$label unexpectedly succeeded"
  else
    status=$?
  fi

  if [[ "$status" -ne 3 ]]; then
    fail "$label returned an unexpected psql status"
  fi

  if [[ "$output" != *'42501'* ]]; then
    fail "$label did not fail with SQLSTATE 42501"
  fi

  denied "$label"
}

# Assert safe state through the provisioner connection. These checks print only
# PASS labels; they never print stored password verifiers or raw query output.
assert_scalar \
  'PostgreSQL version' \
  '180004' \
  "SELECT current_setting('server_version_num');"

assert_scalar \
  'available vector version' \
  '0.8.5' \
  "SELECT default_version FROM pg_available_extensions WHERE name = 'vector';"

assert_scalar \
  'installed vector version' \
  '0.8.5' \
  "SELECT extversion FROM pg_extension WHERE extname = 'vector';"

assert_scalar \
  'database owner' \
  "$POSTGRES_USER" \
  "SELECT pg_get_userbyid(datdba) FROM pg_database WHERE datname = current_database();"

assert_scalar \
  'public schema owner' \
  'pg_database_owner' \
  "SELECT pg_get_userbyid(nspowner) FROM pg_namespace WHERE nspname = 'public';"

assert_scalar \
  'app schema owner' \
  "$TRIP_DB_MIGRATOR_USER" \
  "SELECT pg_get_userbyid(nspowner) FROM pg_namespace WHERE nspname = 'app';"

assert_scalar \
  'vector owner and schema' \
  "$POSTGRES_USER|public" \
  "SELECT pg_get_userbyid(extension.extowner) || '|' || namespace.nspname
   FROM pg_extension AS extension
   JOIN pg_namespace AS namespace ON namespace.oid = extension.extnamespace
   WHERE extension.extname = 'vector';"

assert_scalar \
  'server-log coverage' \
  'stderr|off|true|true|true' \
  "SELECT current_setting('log_destination') || '|' ||
          current_setting('logging_collector') || '|' ||
          (current_setting('shared_preload_libraries') = '')::text || '|' ||
          (current_setting('session_preload_libraries') = '')::text || '|' ||
          (current_setting('local_preload_libraries') = '')::text;"

assert_scalar \
  'host HBA rules use SCRAM' \
  't' \
  "SELECT count(*) > 0 AND bool_and(rule.auth_method = 'scram-sha-256')
   FROM pg_hba_file_rules AS rule
   WHERE rule.error IS NULL AND rule.type LIKE 'host%';"

assert_scalar \
  'HBA parse errors' \
  '0' \
  "SELECT count(*) FROM pg_hba_file_rules WHERE error IS NOT NULL;"

assert_scalar \
  'stored password verifiers use SCRAM' \
  't' \
  "SELECT count(*) = 3
          AND bool_and(role.rolpassword LIKE 'SCRAM-SHA-256\$%')
   FROM pg_authid AS role
   WHERE role.rolname IN (
     :'provisioner_user',
     :'migrator_user',
     :'runtime_user'
   );"

assert_scalar \
  'provisioner role flags' \
  't' \
  "SELECT count(*) = 1
          AND bool_and(role.rolcanlogin AND role.rolsuper)
   FROM pg_roles AS role
   WHERE role.rolname = :'provisioner_user';"

assert_scalar \
  'subordinate role flags' \
  't' \
  "SELECT count(*) = 2
          AND bool_and(
            role.rolcanlogin
            AND NOT role.rolinherit
            AND NOT role.rolsuper
            AND NOT role.rolcreatedb
            AND NOT role.rolcreaterole
            AND NOT role.rolreplication
            AND NOT role.rolbypassrls
          )
   FROM pg_roles AS role
   WHERE role.rolname IN (:'migrator_user', :'runtime_user');"

assert_scalar \
  'subordinate database and schema privileges' \
  't' \
  "SELECT count(*) = 2
          AND bool_and(
            has_database_privilege(role.rolname, current_database(), 'CONNECT')
            AND NOT has_database_privilege(role.rolname, current_database(), 'CREATE')
            AND NOT has_database_privilege(role.rolname, current_database(), 'TEMPORARY')
            AND has_schema_privilege(role.rolname, 'public', 'USAGE')
            AND NOT has_schema_privilege(role.rolname, 'public', 'CREATE')
            AND has_schema_privilege(role.rolname, 'app', 'USAGE')
            AND (
              (
                role.rolname = :'migrator_user'
                AND has_schema_privilege(role.rolname, 'app', 'CREATE')
              )
              OR (
                role.rolname = :'runtime_user'
                AND NOT has_schema_privilege(role.rolname, 'app', 'CREATE')
              )
            )
          )
   FROM pg_roles AS role
   WHERE role.rolname IN (:'migrator_user', :'runtime_user');"

assert_scalar \
  'subordinate direct memberships' \
  '0' \
  "SELECT count(*)
   FROM pg_auth_members AS membership
   JOIN pg_roles AS member_role ON member_role.oid = membership.member
   WHERE member_role.rolname IN (:'migrator_user', :'runtime_user');"

# Prove all three credentials work over TCP. The effective schema list for the
# subordinate roles must reflect their per-database search_path setting.
assert_identity "$POSTGRES_USER" "$POSTGRES_PASSWORD"
assert_identity \
  "$TRIP_DB_MIGRATOR_USER" \
  "$TRIP_DB_MIGRATOR_PASSWORD" \
  'app,public'
assert_identity \
  "$TRIP_DB_RUNTIME_USER" \
  "$TRIP_DB_RUNTIME_PASSWORD" \
  'app,public'

artifact_count_sql="
SELECT
  (
    SELECT count(*)
    FROM pg_roles
    WHERE rolname IN (
      'f05_migrator_forbidden_role',
      'f05_runtime_forbidden_role'
    )
  ) +
  (
    SELECT count(*)
    FROM pg_namespace
    WHERE nspname IN (
      'f05_migrator_forbidden_schema',
      'f05_runtime_forbidden_schema'
    )
  ) +
  (
    SELECT count(*)
    FROM pg_class AS relation
    JOIN pg_namespace AS namespace ON namespace.oid = relation.relnamespace
    WHERE (namespace.nspname, relation.relname) IN (
      ('app', 'f05_migrator_ddl_probe'),
      ('app', 'f05_runtime_ddl_probe'),
      ('public', 'f05_migrator_public_ddl_probe'),
      ('public', 'f05_runtime_public_ddl_probe')
    )
  );"

assert_scalar 'persistent probe artifacts before tests' '0' "$artifact_count_sql"

expect_success \
  'migrator DDL in app' \
  "$TRIP_DB_MIGRATOR_USER" \
  "$TRIP_DB_MIGRATOR_PASSWORD" \
  'BEGIN;
   CREATE TABLE app.f05_migrator_ddl_probe (id integer);
   ROLLBACK;'

expect_denied \
  'runtime DDL in app' \
  "$TRIP_DB_RUNTIME_USER" \
  "$TRIP_DB_RUNTIME_PASSWORD" \
  'BEGIN;
   CREATE TABLE app.f05_runtime_ddl_probe (id integer);
   ROLLBACK;'

expect_denied \
  'migrator DDL in public' \
  "$TRIP_DB_MIGRATOR_USER" \
  "$TRIP_DB_MIGRATOR_PASSWORD" \
  'BEGIN;
   CREATE TABLE public.f05_migrator_public_ddl_probe (id integer);
   ROLLBACK;'

expect_denied \
  'runtime DDL in public' \
  "$TRIP_DB_RUNTIME_USER" \
  "$TRIP_DB_RUNTIME_PASSWORD" \
  'BEGIN;
   CREATE TABLE public.f05_runtime_public_ddl_probe (id integer);
   ROLLBACK;'

expect_denied \
  'migrator database CREATE' \
  "$TRIP_DB_MIGRATOR_USER" \
  "$TRIP_DB_MIGRATOR_PASSWORD" \
  'BEGIN;
   CREATE SCHEMA f05_migrator_forbidden_schema;
   ROLLBACK;'

expect_denied \
  'runtime database CREATE' \
  "$TRIP_DB_RUNTIME_USER" \
  "$TRIP_DB_RUNTIME_PASSWORD" \
  'BEGIN;
   CREATE SCHEMA f05_runtime_forbidden_schema;
   ROLLBACK;'

expect_denied \
  'migrator database TEMPORARY' \
  "$TRIP_DB_MIGRATOR_USER" \
  "$TRIP_DB_MIGRATOR_PASSWORD" \
  'BEGIN;
   CREATE TEMP TABLE f05_migrator_forbidden_temp (id integer);
   ROLLBACK;'

expect_denied \
  'runtime database TEMPORARY' \
  "$TRIP_DB_RUNTIME_USER" \
  "$TRIP_DB_RUNTIME_PASSWORD" \
  'BEGIN;
   CREATE TEMP TABLE f05_runtime_forbidden_temp (id integer);
   ROLLBACK;'

expect_denied \
  'migrator extension management' \
  "$TRIP_DB_MIGRATOR_USER" \
  "$TRIP_DB_MIGRATOR_PASSWORD" \
  'BEGIN;
   DROP EXTENSION vector;
   ROLLBACK;'

expect_denied \
  'runtime extension management' \
  "$TRIP_DB_RUNTIME_USER" \
  "$TRIP_DB_RUNTIME_PASSWORD" \
  'BEGIN;
   DROP EXTENSION vector;
   ROLLBACK;'

expect_denied \
  'migrator role management' \
  "$TRIP_DB_MIGRATOR_USER" \
  "$TRIP_DB_MIGRATOR_PASSWORD" \
  'BEGIN;
   CREATE ROLE f05_migrator_forbidden_role;
   ROLLBACK;'

expect_denied \
  'runtime role management' \
  "$TRIP_DB_RUNTIME_USER" \
  "$TRIP_DB_RUNTIME_PASSWORD" \
  'BEGIN;
   CREATE ROLE f05_runtime_forbidden_role;
   ROLLBACK;'

assert_scalar 'persistent probe artifacts after tests' '0' "$artifact_count_sql"

printf '%s\n' 'PASS: database capability matrix verified without persistent probe objects.'
