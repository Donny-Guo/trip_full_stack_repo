import { QueryFailedError } from "typeorm";
import {
  createApiTestHarness,
  type ApiTestHarness,
} from "./helpers/test-app.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function postgresFailure(error: unknown): Readonly<{
  code: string | undefined;
  constraint: string | undefined;
}> {
  if (!(error instanceof QueryFailedError) || !isRecord(error.driverError)) {
    return { code: undefined, constraint: undefined };
  }
  return {
    code:
      typeof error.driverError.code === "string"
        ? error.driverError.code
        : undefined,
    constraint:
      typeof error.driverError.constraint === "string"
        ? error.driverError.constraint
        : undefined,
  };
}

async function expectPostgresFailure(
  operation: Promise<unknown>,
  code: string,
  constraint?: string,
): Promise<void> {
  try {
    await operation;
  } catch (error: unknown) {
    expect(postgresFailure(error)).toEqual({ code, constraint });
    return;
  }
  throw new Error(`Expected PostgreSQL failure ${code}.`);
}

describe("database contracts", () => {
  let harness: ApiTestHarness;

  beforeAll(async () => {
    harness = await createApiTestHarness();
  });

  beforeEach(async () => {
    await harness.resetDatabase();
  });

  afterAll(async () => {
    await harness?.close();
  });

  it("records exactly the one approved migration", async () => {
    const rows: unknown = await harness.migrator.query(
      "SELECT count(*)::int AS count FROM app.typeorm_migrations",
    );
    const firstRow: unknown = Array.isArray(rows) ? rows[0] : undefined;
    if (!isRecord(firstRow)) {
      throw new Error("Expected a migration count row.");
    }
    expect(firstRow.count).toBe(1);
  });

  it("keeps the migrator as table owner and runtime at SELECT/INSERT only", async () => {
    const ownershipRows: unknown = await harness.migrator.query(
      "SELECT tableowner FROM pg_tables WHERE schemaname = 'app' AND tablename = 'users'",
    );
    const ownership: unknown = Array.isArray(ownershipRows)
      ? ownershipRows[0]
      : undefined;
    if (!isRecord(ownership)) {
      throw new Error("Expected a users ownership row.");
    }
    expect(ownership.tableowner).toBe("trip_migrator");

    await harness.runtime.query(
      "INSERT INTO app.users (email, password_hash) VALUES ($1, $2)",
      ["runtime@example.com", "test-only-not-a-real-hash"],
    );
    const selected: unknown = await harness.runtime.query(
      "SELECT email FROM app.users WHERE email = $1",
      ["runtime@example.com"],
    );
    expect(Array.isArray(selected)).toBe(true);

    await expectPostgresFailure(
      harness.runtime.query(
        "UPDATE app.users SET updated_at = CURRENT_TIMESTAMP",
      ),
      "42501",
    );
    await expectPostgresFailure(
      harness.runtime.query("DELETE FROM app.users"),
      "42501",
    );
    await expectPostgresFailure(
      harness.runtime.query(
        "CREATE TABLE app.runtime_must_not_create (id integer)",
      ),
      "42501",
    );
  });

  it("enforces canonical and unique email in PostgreSQL", async () => {
    await expectPostgresFailure(
      harness.migrator.query(
        "INSERT INTO app.users (email, password_hash) VALUES ($1, $2)",
        ["Upper@Example.com", "test-only"],
      ),
      "23514",
      "ck_users_email_canonical",
    );

    await harness.migrator.query(
      "INSERT INTO app.users (email, password_hash) VALUES ($1, $2)",
      ["unique@example.com", "test-only"],
    );
    await expectPostgresFailure(
      harness.migrator.query(
        "INSERT INTO app.users (email, password_hash) VALUES ($1, $2)",
        ["unique@example.com", "test-only"],
      ),
      "23505",
      "uq_users_email",
    );
  });
});
