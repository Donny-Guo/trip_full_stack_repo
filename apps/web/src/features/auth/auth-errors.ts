import type { AuthRequestFailure } from "./auth-api";
import type { AuthField, AuthFieldErrors, AuthMode } from "./auth-validation";

interface PresentedAuthError {
  readonly fieldErrors: AuthFieldErrors;
  readonly formError?: string;
}

const FIELD_MESSAGES: Readonly<Record<string, string>> = {
  EMAIL_REQUIRED: "Enter your email.",
  EMAIL_ASCII_REQUIRED: "Use an ASCII email address.",
  EMAIL_TOO_LONG: "Email must be 254 characters or fewer.",
  EMAIL_INVALID: "Enter a valid email.",
  EMAIL_MUST_BE_STRING: "Enter a valid email.",
  PASSWORD_REQUIRED: "Enter your password.",
  PASSWORD_MUST_BE_STRING: "Enter your password.",
  PASSWORD_TRANSPORT_TOO_LARGE: "Password is too long.",
  PASSWORD_TOO_SHORT: "Password must be at least 8 characters.",
  PASSWORD_TOO_LONG: "Password must be at most 20 characters.",
  PASSWORD_UNSUPPORTED_CHARACTER: "Use only letters, numbers, $, #, @, and %.",
  PASSWORD_UPPERCASE_REQUIRED: "Add an uppercase letter.",
  PASSWORD_LOWERCASE_REQUIRED: "Add a lowercase letter.",
  PASSWORD_DIGIT_REQUIRED: "Add a number.",
  PASSWORD_SPECIAL_REQUIRED: "Add one of $, #, @, or %.",
};

function mapFieldErrors(
  value: Readonly<Record<string, readonly string[]>> | undefined,
): AuthFieldErrors {
  if (value === undefined) return {};

  const result: AuthFieldErrors = {};
  for (const field of ["email", "password"] satisfies readonly AuthField[]) {
    const messages = (value[field] ?? [])
      .map((code) => FIELD_MESSAGES[code])
      .filter((message): message is string => message !== undefined);
    if (messages.length > 0) result[field] = messages.join(" ");
  }
  return result;
}

export function presentAuthFailure(
  mode: AuthMode,
  failure: AuthRequestFailure,
): PresentedAuthError {
  if (failure.kind === "network") {
    return {
      fieldErrors: {},
      formError: "We could not reach the authentication service. Try again.",
    };
  }

  if (failure.kind === "timeout") {
    return {
      fieldErrors: {},
      formError: "The request took too long. Try again.",
    };
  }

  if (failure.kind === "upstream-unavailable") {
    return {
      fieldErrors: {},
      formError: "The authentication service is unavailable. Try again.",
    };
  }

  if (failure.kind === "invalid-response") {
    return {
      fieldErrors: {},
      formError: "The service returned an unexpected response. Try again.",
    };
  }

  if (
    failure.error.code === "VALIDATION_ERROR" &&
    failure.error.fieldErrors !== undefined
  ) {
    const fieldErrors = mapFieldErrors(failure.error.fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return { fieldErrors };
    return {
      fieldErrors: {},
      formError: `The request was rejected. Try again. Reference: ${failure.error.requestId}`,
    };
  }

  if (mode === "sign-up" && failure.error.code === "EMAIL_ALREADY_EXISTS") {
    return {
      fieldErrors: {},
      formError: "An account with that email already exists.",
    };
  }

  if (mode === "login" && failure.error.code === "INVALID_CREDENTIALS") {
    return {
      fieldErrors: {},
      formError: "Email or password is invalid.",
    };
  }

  if (failure.error.code === "UNTRUSTED_REQUEST") {
    return {
      fieldErrors: {},
      formError: "Refresh this page and try again.",
    };
  }

  if (failure.error.code === "SERVICE_UNAVAILABLE" || failure.status === 503) {
    return {
      fieldErrors: {},
      formError: "The authentication service is unavailable. Try again.",
    };
  }

  return {
    fieldErrors: {},
    formError: `Something went wrong. Try again. Reference: ${failure.error.requestId}`,
  };
}
