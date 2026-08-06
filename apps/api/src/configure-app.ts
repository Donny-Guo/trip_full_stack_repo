import { randomUUID } from "node:crypto";
import type { NestExpressApplication } from "@nestjs/platform-express";
import type { NextFunction, Response } from "express";
import type { ApiErrorBody } from "./common/http/api-error-body.js";
import type { CorrelatedRequest } from "./common/http/request-context.js";
import { singleHeader, UNSAFE_METHODS } from "./common/http/request-policy.js";
import { createValidationPipe } from "./common/http/validation.js";
import type { RuntimeEnvironment } from "./config/environment.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function configureApp(
  app: NestExpressApplication,
  environment: RuntimeEnvironment,
): void {
  app.set("trust proxy", environment.API_TRUST_PROXY_HOPS);
  app.use(
    (request: CorrelatedRequest, response: Response, next: NextFunction) => {
      request.requestId = randomUUID();
      response.setHeader("X-Request-Id", request.requestId);
      if (request.path.startsWith("/api/v1/auth/")) {
        response.setHeader("Cache-Control", "no-store");
      }
      next();
    },
  );

  app.enableCors({
    origin: [...environment.API_CORS_ORIGINS],
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  });

  app.use(
    (request: CorrelatedRequest, response: Response, next: NextFunction) => {
      if (!UNSAFE_METHODS.has(request.method)) {
        next();
        return;
      }
      const contentType = singleHeader(request.headers["content-type"]);
      if (
        typeof contentType !== "string" ||
        contentType.split(";", 1)[0]?.trim().toLowerCase() !==
          "application/json"
      ) {
        response.status(415).json({
          code: "UNSUPPORTED_MEDIA_TYPE",
          message: "Content-Type must be application/json.",
          requestId: request.requestId,
        } satisfies ApiErrorBody);
        return;
      }
      next();
    },
  );

  app.useBodyParser("json", {
    limit: environment.API_JSON_BODY_LIMIT_BYTES,
    strict: true,
    type: "application/json",
  });

  app.use(
    (
      error: unknown,
      request: CorrelatedRequest,
      response: Response,
      next: NextFunction,
    ) => {
      if (!isRecord(error) || typeof error.type !== "string") {
        next(error);
        return;
      }
      const tooLarge = error.type === "entity.too.large";
      const malformed = error.type === "entity.parse.failed";
      if (!tooLarge && !malformed) {
        next(error);
        return;
      }
      response.status(tooLarge ? 413 : 400).json({
        code: tooLarge ? "PAYLOAD_TOO_LARGE" : "VALIDATION_ERROR",
        message: tooLarge
          ? "Request body is too large."
          : "Request body is invalid JSON.",
        requestId: request.requestId,
      } satisfies ApiErrorBody);
    },
  );

  app.setGlobalPrefix("api/v1");
  app.useGlobalPipes(createValidationPipe());
}
