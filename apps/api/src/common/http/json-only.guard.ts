import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
} from "@nestjs/common";
import type { Request } from "express";
import { ApiException } from "./api-exception.js";
import { singleHeader, UNSAFE_METHODS } from "./request-policy.js";

@Injectable()
export class JsonOnlyGuard implements CanActivate {
  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (!UNSAFE_METHODS.has(request.method)) return true;
    const contentType = singleHeader(request.headers["content-type"]);
    if (
      contentType === undefined ||
      contentType === null ||
      contentType.split(";", 1)[0]?.trim().toLowerCase() !== "application/json"
    ) {
      throw ApiException.unsupportedMediaType();
    }
    return true;
  }
}
