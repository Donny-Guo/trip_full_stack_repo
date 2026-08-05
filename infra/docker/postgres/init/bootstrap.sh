#!/usr/bin/env bash
set -Eeuo pipefail

fail() {
  printf 'FAIL: %s\n' "$1" >&2
  exit 1
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

if [[ ! "$POSTGRES_DB" =~ ^[a-z][a-z0-9_]{0,62}$ ]]; then
  fail 'POSTGRES_DB is not a supported lowercase PostgreSQL identifier'
fi

role_variables=(
  POSTGRES_USER
  TRIP_DB_MIGRATOR_USER
  TRIP_DB_RUNTIME_USER
)

for variable_name in "${role_variables[@]}"; do
  role_name="${!variable_name}"
  if [[ ! "$role_name" =~ ^[a-z_][a-z0-9_]{0,62}$ ]]; then
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
    fail "$variable_name must be one 64-character lowercase hexadecimal value"
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

psql \
  --dbname="$POSTGRES_DB" \
  --username="$POSTGRES_USER" \
  --no-psqlrc \
  --set=ON_ERROR_STOP=1 \
  --set=ECHO=none \
  --set=VERBOSITY=terse \
  --set=database_name="$POSTGRES_DB" \
  --set=provisioner_user="$POSTGRES_USER" \
  --set=migrator_user="$TRIP_DB_MIGRATOR_USER" \
  --set=runtime_user="$TRIP_DB_RUNTIME_USER" <<'SQL'
\getenv migrator_password TRIP_DB_MIGRATOR_PASSWORD
\getenv runtime_password TRIP_DB_RUNTIME_PASSWORD

DO $verify$
DECLARE
  actual_version text := current_setting('server_version_num');
BEGIN
  IF actual_version <> '180004' THEN
    RAISE EXCEPTION
      'Expected PostgreSQL server_version_num 180004, got %',
      actual_version;
  END IF;
END
$verify$;

DO $verify$
DECLARE
  actual_version text;
BEGIN
  SELECT available.default_version
  INTO actual_version
  FROM pg_available_extensions AS available
  WHERE available.name = 'vector';

  IF actual_version IS DISTINCT FROM '0.8.5' THEN
    RAISE EXCEPTION
      'Expected available vector version 0.8.5, got %',
      COALESCE(actual_version, 'not available');
  END IF;
END
$verify$;

-- These session settings protect successful and failed password-bearing
-- statements from statement/parameter logging in this bootstrap session.
SET password_encryption = 'scram-sha-256';
SET log_statement = 'none';
SET log_min_error_statement = 'panic';
SET log_min_duration_statement = -1;
SET log_min_duration_sample = -1;
SET log_statement_sample_rate = 0;
SET log_transaction_sample_rate = 0;
SET log_parameter_max_length = 0;
SET log_parameter_max_length_on_error = 0;
SET log_error_verbosity = 'terse';

BEGIN;

SELECT format(
  'CREATE ROLE %I WITH NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS',
  :'migrator_user'
) \gexec

SELECT format(
  'CREATE ROLE %I WITH NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE NOINHERIT NOREPLICATION NOBYPASSRLS',
  :'runtime_user'
) \gexec

SELECT format(
  'ALTER ROLE %I WITH PASSWORD %L LOGIN',
  :'migrator_user',
  :'migrator_password'
) \gexec

SELECT format(
  'ALTER ROLE %I WITH PASSWORD %L LOGIN',
  :'runtime_user',
  :'runtime_password'
) \gexec

CREATE EXTENSION vector WITH SCHEMA public;

DO $verify$
DECLARE
  actual_version text;
BEGIN
  SELECT extension.extversion
  INTO actual_version
  FROM pg_extension AS extension
  WHERE extension.extname = 'vector';

  IF actual_version IS DISTINCT FROM '0.8.5' THEN
    RAISE EXCEPTION
      'Expected installed vector version 0.8.5, got %',
      COALESCE(actual_version, 'not installed');
  END IF;
END
$verify$;

REVOKE ALL ON DATABASE :"database_name" FROM PUBLIC;
GRANT CONNECT ON DATABASE :"database_name" TO :"migrator_user", :"runtime_user";

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO :"migrator_user", :"runtime_user";

CREATE SCHEMA app AUTHORIZATION :"migrator_user";
REVOKE ALL ON SCHEMA app FROM PUBLIC;
GRANT USAGE ON SCHEMA app TO :"runtime_user";

SELECT format(
  'ALTER ROLE %I IN DATABASE %I SET search_path TO app, public',
  :'migrator_user',
  :'database_name'
) \gexec

SELECT format(
  'ALTER ROLE %I IN DATABASE %I SET search_path TO app, public',
  :'runtime_user',
  :'database_name'
) \gexec

COMMIT;

\echo 'Sanitized database bootstrap record'

SELECT
  current_setting('server_version_num') AS server_version_num;

SELECT
  available.default_version AS available_vector_version,
  extension.extversion AS installed_vector_version,
  pg_get_userbyid(extension.extowner) AS extension_owner,
  namespace.nspname AS extension_schema
FROM pg_available_extensions AS available
JOIN pg_extension AS extension ON extension.extname = available.name
JOIN pg_namespace AS namespace ON namespace.oid = extension.extnamespace
WHERE available.name = 'vector';

SELECT
  database.datname AS database_name,
  pg_get_userbyid(database.datdba) AS database_owner
FROM pg_database AS database
WHERE database.datname = current_database();

SELECT
  namespace.nspname AS schema_name,
  pg_get_userbyid(namespace.nspowner) AS schema_owner
FROM pg_namespace AS namespace
WHERE namespace.nspname IN ('app', 'public')
ORDER BY namespace.nspname;

SELECT
  role.rolname,
  role.rolcanlogin,
  role.rolinherit,
  role.rolsuper,
  role.rolcreatedb,
  role.rolcreaterole,
  role.rolreplication,
  role.rolbypassrls,
  role.rolpassword IS NOT NULL
    AND role.rolpassword LIKE 'SCRAM-SHA-256$%' AS has_scram_verifier
FROM pg_authid AS role
WHERE role.rolname IN (
  :'provisioner_user',
  :'migrator_user',
  :'runtime_user'
)
ORDER BY role.rolname;
SQL
