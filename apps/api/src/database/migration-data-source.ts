import "reflect-metadata";
import { DataSource } from "typeorm";
import { loadLocalEnvironment } from "../config/load-local-environment.js";
import { validateMigrationEnvironment } from "../config/environment.js";
import { migrationDatabaseOptions } from "./database-options.js";

loadLocalEnvironment(".env.migration.local");
const environment = validateMigrationEnvironment(process.env);

export default new DataSource(migrationDatabaseOptions(environment));
