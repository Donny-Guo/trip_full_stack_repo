import type {
  MigrationEnvironment,
  RuntimeEnvironment,
} from "../config/environment.js";
import {
  migrationDatabaseOptions,
  runtimeDatabaseOptions,
} from "./database-options.js";

describe("database options", () => {
  const migrationEnvironment: MigrationEnvironment = Object.freeze({
    NODE_ENV: "test",
    API_MIGRATION_DATABASE_URL:
      "postgresql://trip_migrator:test@127.0.0.1:55432/trip_auth_api_test",
  });
  const runtimeEnvironment: RuntimeEnvironment = Object.freeze({
    NODE_ENV: "test",
    API_PORT: 3001,
    API_RUNTIME_DATABASE_URL:
      "postgresql://trip_runtime:test@127.0.0.1:55432/trip_auth_api_test",
    API_TRUST_PROXY_HOPS: 0,
    API_CORS_ORIGINS: Object.freeze(["http://localhost:3000"]),
    API_TRUSTED_ORIGINS: Object.freeze(["http://localhost:3000"]),
    API_JSON_BODY_LIMIT_BYTES: 16_384,
    AUTH_JWT_SECRET: Buffer.alloc(32),
    AUTH_COOKIE_SECURE: false,
    AUTH_PASSWORD_HASH_CONCURRENCY: 2,
    AUTH_PASSWORD_HASH_QUEUE_LIMIT: 32,
    AUTH_DUMMY_PASSWORD_HASH: "test-only",
  });

  it.each([
    runtimeDatabaseOptions(runtimeEnvironment),
    migrationDatabaseOptions(migrationEnvironment),
  ])(
    "disables schema and extension changes during initialization",
    (options) => {
      expect(options).toMatchObject({
        installExtensions: false,
        synchronize: false,
        migrationsRun: false,
      });
    },
  );
});
