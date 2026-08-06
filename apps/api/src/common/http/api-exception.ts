import { HttpException } from "@nestjs/common";
import type { ValidationError } from "class-validator";

export const apiCodes = {
  validation: "VALIDATION_ERROR",
  emailExists: "EMAIL_ALREADY_EXISTS",
  invalidCredentials: "INVALID_CREDENTIALS",
  unauthenticated: "UNAUTHENTICATED",
  untrustedRequest: "UNTRUSTED_REQUEST",
  unsupportedMediaType: "UNSUPPORTED_MEDIA_TYPE",
  payloadTooLarge: "PAYLOAD_TOO_LARGE",
  serviceUnavailable: "SERVICE_UNAVAILABLE",
  notFound: "NOT_FOUND",
  internal: "INTERNAL_ERROR",
} as const;

export type PublicError = Readonly<{
  code: string;
  message: string;
  fieldErrors?: Readonly<Record<string, readonly string[]>>;
}>;

export class ApiException extends HttpException {
  public constructor(
    status: number,
    public readonly publicError: PublicError,
  ) {
    super(publicError.message, status);
  }

  public static validation(
    fieldErrors: Readonly<Record<string, readonly string[]>>,
  ): ApiException {
    return new ApiException(400, {
      code: apiCodes.validation,
      message: "One or more fields are invalid.",
      fieldErrors,
    });
  }

  public static emailAlreadyExists(): ApiException {
    return new ApiException(409, {
      code: apiCodes.emailExists,
      message: "An account with that email already exists.",
    });
  }

  public static invalidCredentials(): ApiException {
    return new ApiException(401, {
      code: apiCodes.invalidCredentials,
      message: "Email or password is invalid.",
    });
  }

  public static unauthenticated(): ApiException {
    return new ApiException(401, {
      code: apiCodes.unauthenticated,
      message: "Authentication is required.",
    });
  }

  public static untrustedRequest(): ApiException {
    return new ApiException(403, {
      code: apiCodes.untrustedRequest,
      message: "Request provenance is not trusted.",
    });
  }

  public static unsupportedMediaType(): ApiException {
    return new ApiException(415, {
      code: apiCodes.unsupportedMediaType,
      message: "Content-Type must be application/json.",
    });
  }

  public static serviceUnavailable(): ApiException {
    return new ApiException(503, {
      code: apiCodes.serviceUnavailable,
      message: "The service is temporarily unavailable.",
    });
  }
}

export function validationExceptionFactory(
  errors: readonly ValidationError[],
): ApiException {
  const byField = new Map<string, Set<string>>();
  for (const error of errors) {
    const codes = byField.get(error.property) ?? new Set<string>();
    for (const [constraint, message] of Object.entries(
      error.constraints ?? {},
    )) {
      codes.add(
        constraint === "whitelistValidation" ||
          !/^[A-Z][A-Z0-9_]+$/.test(message)
          ? "UNKNOWN_OR_INVALID_FIELD"
          : message,
      );
    }
    byField.set(error.property, codes);
  }
  return ApiException.validation(
    Object.fromEntries(
      [...byField].map(([field, codes]) => [
        field,
        Object.freeze([...codes].sort()),
      ]),
    ),
  );
}
