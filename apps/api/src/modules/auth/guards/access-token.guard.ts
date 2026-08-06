import {
  createParamDecorator,
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from "@nestjs/common";
import { ApiException } from "../../../common/http/api-exception.js";
import type { CorrelatedRequest } from "../../../common/http/request-context.js";
import { AccessCookieService } from "../session/access-cookie.service.js";
import type { AuthPrincipal } from "../session/auth-principal.js";
import { AccessTokenService } from "../session/access-token.service.js";

export interface AuthenticatedRequest extends CorrelatedRequest {
  auth?: AuthPrincipal;
}

export const CurrentPrincipal = createParamDecorator(
  (_data: unknown, context: ExecutionContext): AuthPrincipal => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (request.auth === undefined) throw ApiException.unauthenticated();
    return request.auth;
  },
);

@Injectable()
export class AccessTokenGuard implements CanActivate {
  public constructor(
    private readonly cookies: AccessCookieService,
    private readonly tokens: AccessTokenService,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.cookies.read(request.headers.cookie);
    if (token === null) throw ApiException.unauthenticated();

    try {
      request.auth = await this.tokens.verify(token);
      return true;
    } catch {
      throw ApiException.unauthenticated();
    }
  }
}
