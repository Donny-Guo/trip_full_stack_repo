import { createSecretKey } from "node:crypto";
import { Module, type DynamicModule } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import type { RuntimeEnvironment } from "../../config/environment.js";
import { UsersModule } from "../users/users.module.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";
import {
  AUTH_CLOCK,
  AUTH_COOKIE_SECURE,
  AUTH_DUMMY_HASH,
} from "./auth.tokens.js";
import { AccessTokenGuard } from "./guards/access-token.guard.js";
import {
  PASSWORD_HASH_CAPACITY,
  PasswordHashCapacity,
  PasswordHasher,
  validateDummyHash,
} from "./password/password-hasher.service.js";
import { PasswordPolicy } from "./password/password-policy.js";
import { AccessCookieService } from "./session/access-cookie.service.js";
import {
  AccessTokenService,
  SYSTEM_CLOCK,
} from "./session/access-token.service.js";

@Module({})
export class AuthModule {
  public static register(environment: RuntimeEnvironment): DynamicModule {
    const dummyHash = validateDummyHash(environment.AUTH_DUMMY_PASSWORD_HASH);
    return {
      module: AuthModule,
      imports: [
        UsersModule,
        JwtModule.register({
          secret: createSecretKey(environment.AUTH_JWT_SECRET),
          signOptions: {
            algorithm: "HS256",
            issuer: "trip-api",
            audience: "trip-web",
          },
          verifyOptions: {
            algorithms: ["HS256"],
            issuer: "trip-api",
            audience: "trip-web",
            clockTolerance: 30,
          },
        }),
      ],
      controllers: [AuthController],
      providers: [
        { provide: AUTH_CLOCK, useValue: SYSTEM_CLOCK },
        {
          provide: AUTH_COOKIE_SECURE,
          useValue: environment.AUTH_COOKIE_SECURE,
        },
        { provide: AUTH_DUMMY_HASH, useValue: dummyHash },
        {
          provide: PASSWORD_HASH_CAPACITY,
          useValue: new PasswordHashCapacity(
            environment.AUTH_PASSWORD_HASH_CONCURRENCY,
            environment.AUTH_PASSWORD_HASH_QUEUE_LIMIT,
          ),
        },
        AccessCookieService,
        AccessTokenService,
        AuthService,
        PasswordHasher,
        PasswordPolicy,
        AccessTokenGuard,
      ],
      exports: [AccessTokenGuard],
    };
  }
}
