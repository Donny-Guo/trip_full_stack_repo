import type { TypeOrmModuleOptions } from "@nestjs/typeorm";
import type { DataSourceOptions } from "typeorm";
import type {
  MigrationEnvironment,
  RuntimeEnvironment,
} from "../config/environment.js";
import { UserEntity } from "../modules/users/user.entity.js";
import { applicationMigrations } from "./migrations/index.js";

const shared = {
  type: "postgres" as const,
  schema: "app",
  installExtensions: false,
  synchronize: false,
  migrationsRun: false,
  logging: false,
  invalidWhereValuesBehavior: {
    null: "throw" as const,
    undefined: "throw" as const,
  },
};

export function runtimeDatabaseOptions(
  env: RuntimeEnvironment,
): TypeOrmModuleOptions {
  return {
    ...shared,
    url: env.API_RUNTIME_DATABASE_URL,
    autoLoadEntities: true,
    migrations: [],
    retryAttempts: 5,
    retryDelay: 1_000,
  };
}

export function migrationDatabaseOptions(
  env: MigrationEnvironment,
): DataSourceOptions {
  return {
    ...shared,
    url: env.API_MIGRATION_DATABASE_URL,
    entities: [UserEntity],
    migrations: applicationMigrations,
    migrationsTableName: "typeorm_migrations",
    migrationsTransactionMode: "all",
  };
}
