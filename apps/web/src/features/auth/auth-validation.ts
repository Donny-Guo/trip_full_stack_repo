export type AuthMode = "login" | "sign-up";
export type AuthField = "email" | "password";
export type AuthFieldErrors = Partial<Record<AuthField, string>>;

export interface PasswordRequirement {
  readonly id:
    "length" | "uppercase" | "lowercase" | "digit" | "special" | "allowed";
  readonly label: string;
  readonly met: boolean;
}

const BASIC_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_PASSWORD_CHARACTER = /^[A-Za-z0-9$#@%]$/;
const ASCII_UPPERCASE = /[A-Z]/g;

export function normalizeEmailForSubmission(value: string): string {
  return value
    .trim()
    .replace(ASCII_UPPERCASE, (character) => character.toLowerCase());
}

export function getPasswordRequirements(
  password: string,
): readonly PasswordRequirement[] {
  return [
    {
      id: "length",
      label: "8–20 characters",
      met: password.length >= 8 && password.length <= 20,
    },
    {
      id: "uppercase",
      label: "One uppercase letter",
      met: /[A-Z]/.test(password),
    },
    {
      id: "lowercase",
      label: "One lowercase letter",
      met: /[a-z]/.test(password),
    },
    {
      id: "digit",
      label: "One number",
      met: /[0-9]/.test(password),
    },
    {
      id: "special",
      label: "One of $ # @ %",
      met: /[$#@%]/.test(password),
    },
    {
      id: "allowed",
      label: "Letters, numbers, $, #, @, and % only",
      met:
        password.length > 0 &&
        [...password].every((character) =>
          ALLOWED_PASSWORD_CHARACTER.test(character),
        ),
    },
  ];
}

function validateEmail(value: string): string | undefined {
  const normalized = normalizeEmailForSubmission(value);
  if (normalized.length === 0) return "Enter your email.";
  if ([...normalized].some((character) => character.charCodeAt(0) > 0x7f)) {
    return "Use an ASCII email address.";
  }
  if (normalized.length > 254) return "Email must be 254 characters or fewer.";
  if (!BASIC_EMAIL.test(normalized)) return "Enter a valid email.";
  return undefined;
}

function validatePassword(mode: AuthMode, value: string): string | undefined {
  if (value.length === 0) return "Enter your password.";

  if (mode === "sign-up") {
    return getPasswordRequirements(value).every(({ met }) => met)
      ? undefined
      : "Meet every password requirement.";
  }

  if (new TextEncoder().encode(value).byteLength > 1_024) {
    return "Password is too long.";
  }

  return undefined;
}

export function validateAuthFields(
  mode: AuthMode,
  email: string,
  password: string,
): AuthFieldErrors {
  const emailError = validateEmail(email);
  const passwordError = validatePassword(mode, password);

  return {
    ...(emailError === undefined ? {} : { email: emailError }),
    ...(passwordError === undefined ? {} : { password: passwordError }),
  };
}
