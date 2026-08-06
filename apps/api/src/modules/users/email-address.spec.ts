import { normalizeEmail } from "./email-address.js";

describe("normalizeEmail", () => {
  it("trims and lowercases an ASCII email", () => {
    expect(normalizeEmail("  Alice@Example.COM  ")).toEqual({
      ok: true,
      value: "alice@example.com",
    });
  });

  it.each([
    ["", "EMAIL_REQUIRED"],
    ["tést@example.com", "EMAIL_ASCII_REQUIRED"],
    ["missing-at.example.com", "EMAIL_INVALID"],
    ["two@@example.com", "EMAIL_INVALID"],
  ])("rejects %p with %s", (input, expectedCode) => {
    const result = normalizeEmail(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.codes).toContain(expectedCode);
  });
});
