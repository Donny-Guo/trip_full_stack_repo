import "reflect-metadata";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { Test, type TestingModule } from "@nestjs/testing";
import { DataSource } from "typeorm";
import { AppModule } from "../../src/app.module.js";
import {
  validateMigrationEnvironment,
  validateRuntimeEnvironment,
} from "../../src/config/environment.js";
import { configureApp } from "../../src/configure-app.js";
import { migrationDatabaseOptions } from "../../src/database/database-options.js";

function readTestEnvironment(fileName: string): Record<string, unknown> {
  const path = fileURLToPath(new URL(`../config/${fileName}`, import.meta.url));
  return parseEnv(readFileSync(path, "utf8"));
}

export interface ApiTestHarness {
  readonly app: NestExpressApplication;
  readonly migrator: DataSource;
  readonly runtime: DataSource;
  resetDatabase(): Promise<void>;
  close(): Promise<void>;
}

export async function createApiTestHarness(): Promise<ApiTestHarness> {
  const migrationEnvironment = validateMigrationEnvironment(
    readTestEnvironment(".env.migration.local"),
  );
  const runtimeEnvironment = validateRuntimeEnvironment(
    readTestEnvironment(".env.runtime.local"),
  );
  const migrator = new DataSource(
    migrationDatabaseOptions(migrationEnvironment),
  );
  await migrator.initialize();
  await migrator.runMigrations();

  let testingModule: TestingModule | undefined;
  let app: NestExpressApplication | undefined;
  try {
    testingModule = await Test.createTestingModule({
      imports: [AppModule.register(runtimeEnvironment)],
    }).compile();
    app = testingModule.createNestApplication<NestExpressApplication>();
    configureApp(app, runtimeEnvironment);
    await app.init();
    const initializedApp = app;
    const runtime = initializedApp.get(DataSource);

    return {
      app: initializedApp,
      migrator,
      runtime,
      resetDatabase: async () => {
        await migrator.query("TRUNCATE TABLE app.users");
      },
      close: async () => {
        await initializedApp.close();
        if (migrator.isInitialized) await migrator.destroy();
      },
    };
  } catch (error: unknown) {
    if (app !== undefined) await app.close();
    else if (testingModule !== undefined) await testingModule.close();
    if (migrator.isInitialized) await migrator.destroy();
    throw error;
  }
}
