import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import type { Response } from "express";
import type { ApiErrorBody } from "./api-error-body.js";
import { ApiException, apiCodes, type PublicError } from "./api-exception.js";
import type { CorrelatedRequest } from "./request-context.js";

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  public catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const request = http.getRequest<CorrelatedRequest>();
    const response = http.getResponse<Response>();

    let status = 500;
    let publicError: PublicError = {
      code: apiCodes.internal,
      message: "An unexpected error occurred.",
    };
    if (exception instanceof ApiException) {
      status = exception.getStatus();
      publicError = exception.publicError;
    } else if (exception instanceof NotFoundException) {
      status = 404;
      publicError = { code: apiCodes.notFound, message: "Resource not found." };
    }

    if (request.path.startsWith("/api/v1/auth/")) {
      response.setHeader("Cache-Control", "no-store");
    }
    this.logger.error({
      requestId: request.requestId,
      method: request.method,
      path: request.path,
      status,
      category:
        exception instanceof Error
          ? exception.constructor.name
          : "NonErrorThrow",
    });
    response.status(status).json({
      ...publicError,
      requestId: request.requestId,
    } satisfies ApiErrorBody);
  }
}
