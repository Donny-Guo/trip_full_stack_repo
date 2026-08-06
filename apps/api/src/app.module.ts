import { Module, type DynamicModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { GlobalExceptionFilter } from "./common/http/global-exception.filter.js";
import { JsonOnlyGuard } from "./common/http/json-only.guard.js";
import { TrustedRequestGuard } from "./common/http/trusted-request.guard.js";
import type { RuntimeEnvironment } from "./config/environment.js";
import { RUNTIME_ENVIRONMENT } from "./config/runtime-environment.token.js";
import { DatabaseModule } from "./database/database.module.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { HealthModule } from "./modules/health/health.module.js";

@Module({})
export class AppModule {
  public static register(environment: RuntimeEnvironment): DynamicModule {
    return {
      module: AppModule,
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
          ignoreEnvFile: true,
          load: [() => environment],
        }),
        DatabaseModule.register(environment),
        AuthModule.register(environment),
        HealthModule,
      ],
      providers: [
        { provide: RUNTIME_ENVIRONMENT, useValue: environment },
        { provide: APP_GUARD, useClass: JsonOnlyGuard },
        { provide: APP_GUARD, useClass: TrustedRequestGuard },
        { provide: APP_FILTER, useClass: GlobalExceptionFilter },
      ],
    };
  }
}
