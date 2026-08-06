export interface SafeUserResponse {
  readonly id: string;
  readonly email: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export type AuthSuccessMode = "login" | "sign-up";

export type JsonResponseResult =
  Readonly<{ ok: true; value: unknown }> | Readonly<{ ok: false }>;

const SAFE_USER_KEYS = ["id", "email", "createdAt", "updatedAt"] as const;
const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function hasExactKeys(
  value: Record<string, unknown>,
  keys: readonly string[],
): boolean {
  const actualKeys = Object.keys(value);
  return (
    actualKeys.length === keys.length &&
    keys.every((key) => Object.hasOwn(value, key))
  );
}

function isIsoInstant(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const parsed = new Date(value);
  return !Number.isNaN(parsed.valueOf()) && parsed.toISOString() === value;
}

export function isSafeUserResponse(value: unknown): value is SafeUserResponse {
  return (
    isRecord(value) &&
    hasExactKeys(value, SAFE_USER_KEYS) &&
    typeof value.id === "string" &&
    UUID.test(value.id) &&
    typeof value.email === "string" &&
    value.email.length > 0 &&
    isIsoInstant(value.createdAt) &&
    isIsoInstant(value.updatedAt)
  );
}

export async function readJsonResponse(
  response: Response,
): Promise<JsonResponseResult> {
  const mediaType =
    response.headers
      .get("content-type")
      ?.split(";", 1)[0]
      ?.trim()
      .toLowerCase() ?? "";
  if (mediaType !== "application/json" && !mediaType.endsWith("+json")) {
    return { ok: false };
  }

  try {
    const value: unknown = await response.json();
    return { ok: true, value };
  } catch {
    return { ok: false };
  }
}

export async function isValidAuthSuccessResponse(
  response: Response,
  mode: AuthSuccessMode,
): Promise<boolean> {
  const body = await readJsonResponse(response);
  if (!body.ok || !isRecord(body.value)) return false;

  if (mode === "sign-up") {
    return (
      hasExactKeys(body.value, ["messageCode", "user"]) &&
      body.value.messageCode === "AUTH_SIGN_UP_SUCCEEDED" &&
      isSafeUserResponse(body.value.user)
    );
  }

  return (
    hasExactKeys(body.value, ["user"]) && isSafeUserResponse(body.value.user)
  );
}

export async function isValidMeResponse(response: Response): Promise<boolean> {
  const body = await readJsonResponse(response);
  return body.ok && isSafeUserResponse(body.value);
}
