import {
  type AuthSuccessMode,
  isRecord,
  isValidAuthSuccessResponse,
  readJsonResponse,
} from "./auth-contract";

interface ApiError {
  readonly code: string;
  readonly message: string;
  readonly fieldErrors?: Readonly<Record<string, readonly string[]>>;
  readonly requestId: string;
}

export type AuthRequestFailure =
  | Readonly<{ kind: "api"; status: number; error: ApiError }>
  | Readonly<{ kind: "network" }>
  | Readonly<{ kind: "timeout" }>
  | Readonly<{ kind: "upstream-unavailable" }>
  | Readonly<{ kind: "invalid-response" }>;

export type AuthRequestResult =
  Readonly<{ ok: true }> | Readonly<{ ok: false; failure: AuthRequestFailure }>;

const AUTH_PATHS = {
  signUp: "/api/v1/auth/sign-up",
  login: "/api/v1/auth/login",
  logout: "/api/v1/auth/logout",
} as const;

const REQUEST_TIMEOUT_MS = 8_000;

function readFieldErrors(
  value: unknown,
): Readonly<Record<string, readonly string[]>> | null {
  if (!isRecord(value)) return null;

  const entries = Object.entries(value).filter(
    (entry): entry is [string, string[]] =>
      Array.isArray(entry[1]) &&
      entry[1].every((code) => typeof code === "string"),
  );

  return entries.length === Object.keys(value).length
    ? Object.freeze(Object.fromEntries(entries))
    : null;
}

async function readApiError(response: Response): Promise<ApiError | null> {
  const body = await readJsonResponse(response);
  if (!body.ok || !isRecord(body.value)) return null;

  const value = body.value;
  if (
    typeof value.code !== "string" ||
    typeof value.message !== "string" ||
    typeof value.requestId !== "string"
  ) {
    return null;
  }

  let fieldErrors: Readonly<Record<string, readonly string[]>> | undefined;
  if (Object.hasOwn(value, "fieldErrors")) {
    const parsedFieldErrors = readFieldErrors(value.fieldErrors);
    if (parsedFieldErrors === null) return null;
    fieldErrors = parsedFieldErrors;
  }

  return Object.freeze({
    code: value.code,
    message: value.message,
    requestId: value.requestId,
    ...(fieldErrors === undefined ? {} : { fieldErrors }),
  });
}

async function postJson(
  path: string,
  body: Readonly<Record<string, string>>,
  expectedStatus: number,
  successMode: AuthSuccessMode | "empty",
): Promise<AuthRequestResult> {
  try {
    const response = await fetch(path, {
      method: "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status === expectedStatus) {
      if (successMode === "empty") return { ok: true };
      return (await isValidAuthSuccessResponse(response, successMode))
        ? { ok: true }
        : { ok: false, failure: { kind: "invalid-response" } };
    }

    const error = await readApiError(response);
    if (error !== null) {
      return {
        ok: false,
        failure: { kind: "api", status: response.status, error },
      };
    }

    return response.status >= 500
      ? { ok: false, failure: { kind: "upstream-unavailable" } }
      : { ok: false, failure: { kind: "invalid-response" } };
  } catch (error: unknown) {
    if (
      error instanceof DOMException &&
      (error.name === "TimeoutError" || error.name === "AbortError")
    ) {
      return { ok: false, failure: { kind: "timeout" } };
    }
    return { ok: false, failure: { kind: "network" } };
  }
}

export function signUp(
  email: string,
  password: string,
): Promise<AuthRequestResult> {
  return postJson(AUTH_PATHS.signUp, { email, password }, 201, "sign-up");
}

export function login(
  email: string,
  password: string,
): Promise<AuthRequestResult> {
  return postJson(AUTH_PATHS.login, { email, password }, 200, "login");
}

export function logout(): Promise<AuthRequestResult> {
  return postJson(AUTH_PATHS.logout, {}, 204, "empty");
}
