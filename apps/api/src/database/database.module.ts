import { Module, type DynamicModule } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import type { RuntimeEnvironment } from "../config/environment.js";
import { runtimeDatabaseOptions } from "./database-options.js";

@Module({})
export class DatabaseModule {
  public static register(environment: RuntimeEnvironment): DynamicModule {
    return {
      module: DatabaseModule,
      imports: [TypeOrmModule.forRoot(runtimeDatabaseOptions(environment))],
      exports: [TypeOrmModule],
    };
  }
}
