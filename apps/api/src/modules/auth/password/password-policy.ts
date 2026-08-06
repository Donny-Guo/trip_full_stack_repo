import { Injectable } from "@nestjs/common";

export const passwordErrorCodes = {
  tooShort: "PASSWORD_TOO_SHORT",
  tooLong: "PASSWORD_TOO_LONG",
  unsupported: "PASSWORD_UNSUPPORTED_CHARACTER",
  uppercase: "PASSWORD_UPPERCASE_REQUIRED",
  lowercase: "PASSWORD_LOWERCASE_REQUIRED",
  digit: "PASSWORD_DIGIT_REQUIRED",
  special: "PASSWORD_SPECIAL_REQUIRED",
} as const;

@Injectable()
export class PasswordPolicy {
  public validate(password: string): readonly string[] {
    const errors = new Set<string>();
    if (password.length < 8) errors.add(passwordErrorCodes.tooShort);
    if (password.length > 20) errors.add(passwordErrorCodes.tooLong);

    let hasUppercase = false;
    let hasLowercase = false;
    let hasDigit = false;
    let hasSpecial = false;

    for (const character of password) {
      if (character >= "A" && character <= "Z") hasUppercase = true;
      else if (character >= "a" && character <= "z") hasLowercase = true;
      else if (character >= "0" && character <= "9") hasDigit = true;
      else if ("$#@%".includes(character)) hasSpecial = true;
      else errors.add(passwordErrorCodes.unsupported);
    }

    if (!hasUppercase) errors.add(passwordErrorCodes.uppercase);
    if (!hasLowercase) errors.add(passwordErrorCodes.lowercase);
    if (!hasDigit) errors.add(passwordErrorCodes.digit);
    if (!hasSpecial) errors.add(passwordErrorCodes.special);
    return Object.freeze([...errors]);
  }
}
