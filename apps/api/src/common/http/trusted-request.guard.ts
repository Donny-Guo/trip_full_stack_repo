import {
  Inject,
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from "@nestjs/common";
import type { Request } from "express";
import type { RuntimeEnvironment } from "../../config/environment.js";
import { RUNTIME_ENVIRONMENT } from "../../config/runtime-environment.token.js";
import { ApiException } from "./api-exception.js";
import { hasTrustedProvenance, UNSAFE_METHODS } from "./request-policy.js";

@Injectable()
export class TrustedRequestGuard implements CanActivate {
  public constructor(
    @Inject(RUNTIME_ENVIRONMENT)
    environment: RuntimeEnvironment,
  ) {
    this.trustedOrigins = new Set(environment.API_TRUSTED_ORIGINS);
  }

  private readonly trustedOrigins: ReadonlySet<string>;

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (!UNSAFE_METHODS.has(request.method)) return true;
    if (!hasTrustedProvenance(request.headers, this.trustedOrigins)) {
      throw ApiException.untrustedRequest();
    }
    return true;
  }
}
