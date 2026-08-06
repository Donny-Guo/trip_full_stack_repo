export type RuntimeEnvironment = Readonly<{
  NODE_ENV: "development" | "test" | "production";
  API_PORT: number;
  API_RUNTIME_DATABASE_URL: string;
  API_TRUST_PROXY_HOPS: number;
  API_CORS_ORIGINS: readonly string[];
  API_TRUSTED_ORIGINS: readonly string[];
  API_JSON_BODY_LIMIT_BYTES: number;
  AUTH_JWT_SECRET: Buffer;
  AUTH_COOKIE_SECURE: boolean;
  AUTH_PASSWORD_HASH_CONCURRENCY: number;
  AUTH_PASSWORD_HASH_QUEUE_LIMIT: number;
  AUTH_DUMMY_PASSWORD_HASH: string;
}>;

export type MigrationEnvironment = Readonly<{
  NODE_ENV: "development" | "test" | "production";
  API_MIGRATION_DATABASE_URL: string;
}>;

function required(source: Record<string, unknown>, name: string): string {
  const value = source[name];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Invalid configuration: ${name} is required.`);
  }
  return value;
}

function integerInRange(
  source: Record<string, unknown>,
  name: string,
  minimum: number,
  maximum: number,
): number {
  const value = Number(required(source, name));
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`Invalid configuration: ${name} is out of range.`);
  }
  return value;
}

function exactBoolean(source: Record<string, unknown>, name: string): boolean {
  const value = required(source, name);
  if (value !== "true" && value !== "false") {
    throw new Error(`Invalid configuration: ${name} must be true or false.`);
  }
  return value === "true";
}

function nodeEnvironment(
  source: Record<string, unknown>,
): RuntimeEnvironment["NODE_ENV"] {
  const value = required(source, "NODE_ENV");
  if (value !== "development" && value !== "test" && value !== "production") {
    throw new Error("Invalid configuration: NODE_ENV is unsupported.");
  }
  return value;
}

function origins(
  source: Record<string, unknown>,
  name: string,
  environment: RuntimeEnvironment["NODE_ENV"],
): readonly string[] {
  const values = required(source, name).split(",");
  const result = values.map((value) => {
    if (value !== value.trim() || value === "*") {
      throw new Error(
        `Invalid configuration: ${name} contains an invalid origin.`,
      );
    }
    const url = new URL(value);
    if (
      url.origin !== value ||
      (url.protocol !== "http:" && url.protocol !== "https:") ||
      (environment === "production" && url.protocol !== "https:")
    ) {
      throw new Error(
        `Invalid configuration: ${name} must contain exact origins.`,
      );
    }
    return value;
  });
  if (new Set(result).size !== result.length) {
    throw new Error(`Invalid configuration: ${name} contains duplicates.`);
  }
  return Object.freeze(result);
}

function databaseUrl(
  source: Record<string, unknown>,
  name: string,
  expectedUsername: "trip_runtime" | "trip_migrator",
  environment: RuntimeEnvironment["NODE_ENV"],
): string {
  const value = required(source, name);
  const url = new URL(value);
  const username = decodeURIComponent(url.username);
  const databaseName = decodeURIComponent(url.pathname.slice(1));
  const allowedParameters = new Set(
    environment === "production" ? ["sslmode"] : [],
  );
  const parametersAreAllowed = [...url.searchParams.keys()].every((key) =>
    allowedParameters.has(key),
  );
  const tlsIsValid =
    environment !== "production" ||
    (url.searchParams.size === 1 &&
      url.searchParams.get("sslmode") === "verify-full");

  if (
    url.protocol !== "postgresql:" ||
    username !== expectedUsername ||
    !/^[a-z_][a-z0-9_]{0,62}$/.test(username) ||
    url.password.length === 0 ||
    url.hostname.length === 0 ||
    !/^[a-z][a-z0-9_]{0,62}$/.test(databaseName) ||
    url.hash.length > 0 ||
    !parametersAreAllowed ||
    !tlsIsValid
  ) {
    throw new Error(
      `Invalid configuration: ${name} is not a credentialed PostgreSQL URL.`,
    );
  }
  return value;
}

function base64Secret(source: Record<string, unknown>): Buffer {
  const encoded = required(source, "AUTH_JWT_SECRET_BASE64");
  if (
    !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
      encoded,
    )
  ) {
    throw new Error(
      "Invalid configuration: AUTH_JWT_SECRET_BASE64 is not canonical base64.",
    );
  }
  const decoded = Buffer.from(encoded, "base64");
  if (decoded.toString("base64") !== encoded || decoded.byteLength < 32) {
    throw new Error(
      "Invalid configuration: AUTH_JWT_SECRET_BASE64 is too weak.",
    );
  }
  return decoded;
}

function forbidPresent(
  source: Record<string, unknown>,
  names: readonly string[],
): void {
  if (
    names.some(
      (name) => typeof source[name] === "string" && source[name] !== "",
    )
  ) {
    throw new Error(
      "Invalid configuration: this process received a forbidden credential class.",
    );
  }
}

export function validateRuntimeEnvironment(
  source: Record<string, unknown>,
): RuntimeEnvironment {
  forbidPresent(source, [
    "API_MIGRATION_DATABASE_URL",
    "TRIP_DB_PROVISIONER_PASSWORD",
    "TRIP_DB_MIGRATOR_PASSWORD",
  ]);
  const environment = nodeEnvironment(source);
  const secureCookie = exactBoolean(source, "AUTH_COOKIE_SECURE");
  if (environment === "production" && !secureCookie) {
    throw new Error(
      "Invalid configuration: production cookies must be secure.",
    );
  }

  const corsOrigins = origins(source, "API_CORS_ORIGINS", environment);
  const trustedOrigins = origins(source, "API_TRUSTED_ORIGINS", environment);
  if (trustedOrigins.some((origin) => !corsOrigins.includes(origin))) {
    throw new Error(
      "Invalid configuration: every trusted origin must be allowed by CORS.",
    );
  }

  const result: RuntimeEnvironment = {
    NODE_ENV: environment,
    API_PORT: integerInRange(source, "API_PORT", 1, 65_535),
    API_RUNTIME_DATABASE_URL: databaseUrl(
      source,
      "API_RUNTIME_DATABASE_URL",
      "trip_runtime",
      environment,
    ),
    API_TRUST_PROXY_HOPS: integerInRange(source, "API_TRUST_PROXY_HOPS", 0, 8),
    API_CORS_ORIGINS: corsOrigins,
    API_TRUSTED_ORIGINS: trustedOrigins,
    API_JSON_BODY_LIMIT_BYTES: integerInRange(
      source,
      "API_JSON_BODY_LIMIT_BYTES",
      1_024,
      65_536,
    ),
    AUTH_JWT_SECRET: base64Secret(source),
    AUTH_COOKIE_SECURE: secureCookie,
    AUTH_PASSWORD_HASH_CONCURRENCY: integerInRange(
      source,
      "AUTH_PASSWORD_HASH_CONCURRENCY",
      1,
      16,
    ),
    AUTH_PASSWORD_HASH_QUEUE_LIMIT: integerInRange(
      source,
      "AUTH_PASSWORD_HASH_QUEUE_LIMIT",
      0,
      1_000,
    ),
    AUTH_DUMMY_PASSWORD_HASH: required(source, "AUTH_DUMMY_PASSWORD_HASH"),
  };
  return Object.freeze(result);
}

export function validateMigrationEnvironment(
  source: Record<string, unknown>,
): MigrationEnvironment {
  forbidPresent(source, [
    "API_RUNTIME_DATABASE_URL",
    "AUTH_JWT_SECRET_BASE64",
    "TRIP_DB_PROVISIONER_PASSWORD",
    "TRIP_DB_RUNTIME_PASSWORD",
  ]);
  const environment = nodeEnvironment(source);
  return Object.freeze({
    NODE_ENV: environment,
    API_MIGRATION_DATABASE_URL: databaseUrl(
      source,
      "API_MIGRATION_DATABASE_URL",
      "trip_migrator",
      environment,
    ),
  });
}
