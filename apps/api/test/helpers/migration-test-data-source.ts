import "reflect-metadata";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { DataSource } from "typeorm";
import { validateMigrationEnvironment } from "../../src/config/environment.js";
import { migrationDatabaseOptions } from "../../src/database/database-options.js";

const environmentPath = fileURLToPath(
  new URL("../config/.env.migration.local", import.meta.url),
);
const environment = validateMigrationEnvironment(
  parseEnv(readFileSync(environmentPath, "utf8")),
);

export default new DataSource(migrationDatabaseOptions(environment));
