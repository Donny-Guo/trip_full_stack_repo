import { describe, expect, it } from "vitest";

import type { AuthRequestFailure } from "./auth-api";
import { presentAuthFailure } from "./auth-errors";
import type { AuthField } from "./auth-validation";

const REQUEST_ID = "00000000-0000-4000-8000-000000000001";

function apiFailure(
  code: string,
  status: number,
  fieldErrors?: Readonly<Record<string, readonly string[]>>,
): AuthRequestFailure {
  return {
    kind: "api",
    status,
    error: {
      code,
      message: "Safe API fallback.",
      requestId: REQUEST_ID,
      ...(fieldErrors === undefined ? {} : { fieldErrors }),
    },
  };
}

const FIELD_CASES: readonly (readonly [AuthField, string, string])[] = [
  ["email", "EMAIL_REQUIRED", "Enter your email."],
  ["email", "EMAIL_ASCII_REQUIRED", "Use an ASCII email address."],
  ["email", "EMAIL_TOO_LONG", "Email must be 254 characters or fewer."],
  ["email", "EMAIL_INVALID", "Enter a valid email."],
  ["email", "EMAIL_MUST_BE_STRING", "Enter a valid email."],
  ["password", "PASSWORD_REQUIRED", "Enter your password."],
  ["password", "PASSWORD_MUST_BE_STRING", "Enter your password."],
  ["password", "PASSWORD_TRANSPORT_TOO_LARGE", "Password is too long."],
  ["password", "PASSWORD_TOO_SHORT", "Password must be at least 8 characters."],
  ["password", "PASSWORD_TOO_LONG", "Password must be at most 20 characters."],
  [
    "password",
    "PASSWORD_UNSUPPORTED_CHARACTER",
    "Use only letters, numbers, $, #, @, and %.",
  ],
  ["password", "PASSWORD_UPPERCASE_REQUIRED", "Add an uppercase letter."],
  ["password", "PASSWORD_LOWERCASE_REQUIRED", "Add a lowercase letter."],
  ["password", "PASSWORD_DIGIT_REQUIRED", "Add a number."],
  ["password", "PASSWORD_SPECIAL_REQUIRED", "Add one of $, #, @, or %."],
];

const REQUEST_FAILURE_CASES: readonly (readonly [
  AuthRequestFailure,
  string,
])[] = [
  [
    { kind: "network" },
    "We could not reach the authentication service. Try again.",
  ],
  [{ kind: "timeout" }, "The request took too long. Try again."],
  [
    { kind: "upstream-unavailable" },
    "The authentication service is unavailable. Try again.",
  ],
  [
    { kind: "invalid-response" },
    "The service returned an unexpected response. Try again.",
  ],
];

describe("presentAuthFailure", () => {
  it.each(FIELD_CASES)(
    "maps %s field code %s",
    (field, code, expectedMessage) => {
      expect(
        presentAuthFailure(
          "sign-up",
          apiFailure("VALIDATION_ERROR", 400, { [field]: [code] }),
        ),
      ).toEqual({ fieldErrors: { [field]: expectedMessage } });
    },
  );

  it("keeps multiple field messages", () => {
    expect(
      presentAuthFailure(
        "sign-up",
        apiFailure("VALIDATION_ERROR", 400, {
          email: ["EMAIL_REQUIRED"],
          password: ["PASSWORD_UPPERCASE_REQUIRED", "PASSWORD_DIGIT_REQUIRED"],
        }),
      ),
    ).toEqual({
      fieldErrors: {
        email: "Enter your email.",
        password: "Add an uppercase letter. Add a number.",
      },
    });
  });

  it("falls back safely for an unknown validation code", () => {
    expect(
      presentAuthFailure(
        "sign-up",
        apiFailure("VALIDATION_ERROR", 400, {
          password: ["FUTURE_PASSWORD_CODE"],
        }),
      ),
    ).toEqual({
      fieldErrors: {},
      formError: `The request was rejected. Try again. Reference: ${REQUEST_ID}`,
    });
  });

  it.each(REQUEST_FAILURE_CASES)(
    "presents the %s failure",
    (failure, formError) => {
      expect(presentAuthFailure("login", failure)).toEqual({
        fieldErrors: {},
        formError,
      });
    },
  );

  it("maps stable form-level API failures", () => {
    expect(
      presentAuthFailure("sign-up", apiFailure("EMAIL_ALREADY_EXISTS", 409))
        .formError,
    ).toBe("An account with that email already exists.");
    expect(
      presentAuthFailure("login", apiFailure("INVALID_CREDENTIALS", 401))
        .formError,
    ).toBe("Email or password is invalid.");
    expect(
      presentAuthFailure("login", apiFailure("UNTRUSTED_REQUEST", 403))
        .formError,
    ).toBe("Refresh this page and try again.");
    expect(
      presentAuthFailure("login", apiFailure("SERVICE_UNAVAILABLE", 503))
        .formError,
    ).toBe("The authentication service is unavailable. Try again.");
    expect(
      presentAuthFailure("login", apiFailure("FUTURE_ERROR", 500)).formError,
    ).toBe(`Something went wrong. Try again. Reference: ${REQUEST_ID}`);
  });
});
