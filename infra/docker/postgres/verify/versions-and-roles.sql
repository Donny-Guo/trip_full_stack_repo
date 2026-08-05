SELECT
  current_setting('server_version') AS server_version,
  current_setting('server_version_num') AS server_version_num;

SELECT name, default_version, installed_version
FROM pg_available_extensions
WHERE name = 'vector';

SELECT
  extension.extname,
  extension.extversion,
  pg_get_userbyid(extension.extowner) AS extension_owner,
  namespace.nspname AS extension_schema
FROM pg_extension AS extension
JOIN pg_namespace AS namespace ON namespace.oid = extension.extnamespace
WHERE extension.extname = 'vector';

SELECT
  db.datname,
  pg_get_userbyid(db.datdba) AS database_owner
FROM pg_database AS db
WHERE db.datname = current_database();

SELECT
  namespace.nspname,
  pg_get_userbyid(namespace.nspowner) AS schema_owner
FROM pg_namespace AS namespace
WHERE namespace.nspname IN ('public', 'app')
ORDER BY namespace.nspname;

SELECT
  current_setting('log_destination') AS log_destination,
  current_setting('logging_collector') AS logging_collector,
  current_setting('shared_preload_libraries') AS shared_preload_libraries,
  current_setting('session_preload_libraries') AS session_preload_libraries,
  current_setting('local_preload_libraries') AS local_preload_libraries;

SELECT
  count(*) AS valid_host_rules,
  bool_and(rule.auth_method = 'scram-sha-256') AS all_host_rules_use_scram
FROM pg_hba_file_rules AS rule
WHERE rule.error IS NULL
  AND rule.type LIKE 'host%';

SELECT count(*) AS invalid_hba_rules
FROM pg_hba_file_rules AS rule
WHERE rule.error IS NOT NULL;

SELECT
  role.rolname,
  role.rolpassword IS NOT NULL
    AND role.rolpassword LIKE 'SCRAM-SHA-256$%' AS has_scram_verifier
FROM pg_authid AS role
WHERE role.rolname IN (:'provisioner_user', :'migrator_user', :'runtime_user')
ORDER BY role.rolname;

SELECT
  role.rolname,
  role.rolcanlogin,
  role.rolinherit,
  role.rolsuper,
  role.rolcreatedb,
  role.rolcreaterole,
  role.rolreplication,
  role.rolbypassrls,
  has_database_privilege(role.rolname, current_database(), 'CONNECT') AS can_connect,
  has_database_privilege(role.rolname, current_database(), 'CREATE') AS can_create_schema,
  has_database_privilege(role.rolname, current_database(), 'TEMPORARY') AS can_create_temp,
  has_schema_privilege(role.rolname, 'public', 'USAGE') AS can_use_public,
  has_schema_privilege(role.rolname, 'public', 'CREATE') AS can_create_in_public,
  has_schema_privilege(role.rolname, 'app', 'USAGE') AS can_use_app,
  has_schema_privilege(role.rolname, 'app', 'CREATE') AS can_create_in_app
FROM pg_roles AS role
WHERE role.rolname IN (:'provisioner_user', :'migrator_user', :'runtime_user')
ORDER BY role.rolname;

SELECT
  member_role.rolname AS member_role,
  granted_role.rolname AS granted_role
FROM pg_auth_members AS membership
JOIN pg_roles AS member_role ON member_role.oid = membership.member
JOIN pg_roles AS granted_role ON granted_role.oid = membership.roleid
WHERE member_role.rolname IN (:'migrator_user', :'runtime_user')
ORDER BY member_role.rolname, granted_role.rolname;

SELECT system_identifier
FROM pg_control_system();
