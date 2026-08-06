import { PasswordPolicy, passwordErrorCodes } from "./password-policy.js";

describe("PasswordPolicy", () => {
  const policy = new PasswordPolicy();

  it.each(["$", "#", "@", "%"])(
    "accepts the allowed %s special character",
    (special) => {
      expect(policy.validate(`Abcdef1${special}`)).toEqual([]);
    },
  );

  it.each([
    ["Ab1@xyz", passwordErrorCodes.tooShort],
    ["Abcdefghijklmnopqr1@x", passwordErrorCodes.tooLong],
    ["abcdef1@", passwordErrorCodes.uppercase],
    ["ABCDEF1@", passwordErrorCodes.lowercase],
    ["Abcdefg@", passwordErrorCodes.digit],
    ["Abcdefg1", passwordErrorCodes.special],
    ["Abcdef1!", passwordErrorCodes.unsupported],
  ])("rejects %p with %s", (password, expectedCode) => {
    expect(policy.validate(password)).toContain(expectedCode);
  });

  it("does not trim or rewrite a password", () => {
    expect(policy.validate(" Abcdef1@")).toContain(
      passwordErrorCodes.unsupported,
    );
  });
});
