import { randomBytes } from "node:crypto";
import { access, chmod, writeFile } from "node:fs/promises";
import { argon2id, hash } from "argon2";

const targets = {
  compose: new URL("./config/.env.compose.local", import.meta.url),
  runtime: new URL("./config/.env.runtime.local", import.meta.url),
  migration: new URL("./config/.env.migration.local", import.meta.url),
};

async function exists(url) {
  try {
    await access(url);
    return true;
  } catch {
    return false;
  }
}

const states = await Promise.all(Object.values(targets).map(exists));
if (states.every(Boolean)) {
  await Promise.all(
    Object.values(targets).map((target) => chmod(target, 0o600)),
  );
  process.exit(0);
}
if (states.some(Boolean)) {
  throw new Error(
    "Refusing to replace a partial test configuration. Reconcile apps/api/test/config manually.",
  );
}

const provisionerPassword = randomBytes(32).toString("hex");
const migratorPassword = randomBytes(32).toString("hex");
const runtimePassword = randomBytes(32).toString("hex");
const jwtSecret = randomBytes(32).toString("base64");
const dummyHash = await hash(randomBytes(32).toString("base64"), {
  type: argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
  hashLength: 32,
});

await Promise.all([
  writeFile(
    targets.compose,
    `TRIP_DB_PORT=55432
TRIP_DB_NAME=trip_auth_api_test
TRIP_DB_PROVISIONER_USER=trip_provisioner
TRIP_DB_PROVISIONER_PASSWORD=${provisionerPassword}
TRIP_DB_MIGRATOR_USER=trip_migrator
TRIP_DB_MIGRATOR_PASSWORD=${migratorPassword}
TRIP_DB_RUNTIME_USER=trip_runtime
TRIP_DB_RUNTIME_PASSWORD=${runtimePassword}
`,
    { mode: 0o600, flag: "wx" },
  ),
  writeFile(
    targets.runtime,
    `NODE_ENV=test
API_PORT=3001
API_RUNTIME_DATABASE_URL=postgresql://trip_runtime:${runtimePassword}@127.0.0.1:55432/trip_auth_api_test
API_TRUST_PROXY_HOPS=0
API_CORS_ORIGINS=http://localhost:3000
API_TRUSTED_ORIGINS=http://localhost:3000
API_JSON_BODY_LIMIT_BYTES=16384
AUTH_JWT_SECRET_BASE64=${jwtSecret}
AUTH_COOKIE_SECURE=false
AUTH_PASSWORD_HASH_CONCURRENCY=2
AUTH_PASSWORD_HASH_QUEUE_LIMIT=32
AUTH_DUMMY_PASSWORD_HASH=${dummyHash}
`,
    { mode: 0o600, flag: "wx" },
  ),
  writeFile(
    targets.migration,
    `NODE_ENV=test
API_MIGRATION_DATABASE_URL=postgresql://trip_migrator:${migratorPassword}@127.0.0.1:55432/trip_auth_api_test
`,
    { mode: 0o600, flag: "wx" },
  ),
]);

await Promise.all(Object.values(targets).map((target) => chmod(target, 0o600)));
