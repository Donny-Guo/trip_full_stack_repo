import { describe, expect, it } from "@jest/globals";
import {
  validateMigrationEnvironment,
  validateRuntimeEnvironment,
} from "./environment.js";

const jwtSecret = Buffer.alloc(32, 7);

function runtimeSource(
  overrides: Readonly<Record<string, string>> = {},
): Record<string, string> {
  return {
    NODE_ENV: "test",
    API_PORT: "3001",
    API_RUNTIME_DATABASE_URL:
      "postgresql://trip_runtime:runtime-password@127.0.0.1:55432/trip_auth_api_test",
    API_TRUST_PROXY_HOPS: "0",
    API_CORS_ORIGINS: "http://localhost:3000",
    API_TRUSTED_ORIGINS: "http://localhost:3000",
    API_JSON_BODY_LIMIT_BYTES: "16384",
    AUTH_JWT_SECRET_BASE64: jwtSecret.toString("base64"),
    AUTH_COOKIE_SECURE: "false",
    AUTH_PASSWORD_HASH_CONCURRENCY: "2",
    AUTH_PASSWORD_HASH_QUEUE_LIMIT: "8",
    AUTH_DUMMY_PASSWORD_HASH:
      "$argon2id$v=19$m=19456,t=2,p=1$test-salt$test-hash",
    ...overrides,
  };
}

function migrationSource(
  overrides: Readonly<Record<string, string>> = {},
): Record<string, string> {
  return {
    NODE_ENV: "test",
    API_MIGRATION_DATABASE_URL:
      "postgresql://trip_migrator:migrator-password@127.0.0.1:55432/trip_auth_api_test",
    ...overrides,
  };
}

describe("environment validation", () => {
  it("accepts a separated runtime configuration with a 256-bit secret", () => {
    const environment = validateRuntimeEnvironment(runtimeSource());

    expect(environment.AUTH_JWT_SECRET).toEqual(jwtSecret);
    expect(environment.API_RUNTIME_DATABASE_URL).toContain("trip_runtime");
  });

  it("rejects a missing JWT secret", () => {
    const source = runtimeSource();
    delete source.AUTH_JWT_SECRET_BASE64;

    expect(() => validateRuntimeEnvironment(source)).toThrow(
      "AUTH_JWT_SECRET_BASE64 is required",
    );
  });

  it("rejects a JWT secret shorter than 256 bits", () => {
    expect(() =>
      validateRuntimeEnvironment(
        runtimeSource({
          AUTH_JWT_SECRET_BASE64: Buffer.alloc(31, 7).toString("base64"),
        }),
      ),
    ).toThrow("AUTH_JWT_SECRET_BASE64 is too weak");
  });

  it("rejects a migrator identity in the runtime database URL", () => {
    expect(() =>
      validateRuntimeEnvironment(
        runtimeSource({
          API_RUNTIME_DATABASE_URL:
            "postgresql://trip_migrator:password@127.0.0.1:55432/trip_auth_api_test",
        }),
      ),
    ).toThrow("API_RUNTIME_DATABASE_URL is not a credentialed PostgreSQL URL");
  });

  it("rejects migration credentials in the runtime process", () => {
    expect(() =>
      validateRuntimeEnvironment(
        runtimeSource({
          API_MIGRATION_DATABASE_URL:
            "postgresql://trip_migrator:password@127.0.0.1:55432/trip_auth_api_test",
        }),
      ),
    ).toThrow("this process received a forbidden credential class");
  });

  it("requires secure cookies in production", () => {
    expect(() =>
      validateRuntimeEnvironment(
        runtimeSource({
          NODE_ENV: "production",
          AUTH_COOKIE_SECURE: "false",
          API_CORS_ORIGINS: "https://trip.example",
          API_TRUSTED_ORIGINS: "https://trip.example",
          API_RUNTIME_DATABASE_URL:
            "postgresql://trip_runtime:password@db.example/trip_auth_api?sslmode=verify-full",
        }),
      ),
    ).toThrow("production cookies must be secure");
  });

  it("rejects a runtime identity in the migration database URL", () => {
    expect(() =>
      validateMigrationEnvironment(
        migrationSource({
          API_MIGRATION_DATABASE_URL:
            "postgresql://trip_runtime:password@127.0.0.1:55432/trip_auth_api_test",
        }),
      ),
    ).toThrow(
      "API_MIGRATION_DATABASE_URL is not a credentialed PostgreSQL URL",
    );
  });

  it("rejects runtime credentials in the migration process", () => {
    expect(() =>
      validateMigrationEnvironment(
        migrationSource({
          AUTH_JWT_SECRET_BASE64: jwtSecret.toString("base64"),
        }),
      ),
    ).toThrow("this process received a forbidden credential class");
  });
});
