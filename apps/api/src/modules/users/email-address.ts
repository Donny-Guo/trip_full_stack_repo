import { isEmail } from "class-validator";

export type NormalizedEmail = string & {
  readonly __normalizedEmail: unique symbol;
};

export type EmailNormalizationResult =
  | Readonly<{ ok: true; value: NormalizedEmail }>
  | Readonly<{ ok: false; codes: readonly string[] }>;

export function normalizeEmail(input: string): EmailNormalizationResult {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { ok: false, codes: ["EMAIL_REQUIRED"] };
  }
  if ([...trimmed].some((character) => character.charCodeAt(0) > 0x7f)) {
    return { ok: false, codes: ["EMAIL_ASCII_REQUIRED"] };
  }

  const normalized = trimmed.toLowerCase();
  if (normalized.length > 254) {
    return { ok: false, codes: ["EMAIL_TOO_LONG"] };
  }
  if (
    normalized.split("@").length !== 2 ||
    !isEmail(normalized, { allow_utf8_local_part: false, require_tld: true })
  ) {
    return { ok: false, codes: ["EMAIL_INVALID"] };
  }

  return { ok: true, value: normalized as NormalizedEmail };
}
