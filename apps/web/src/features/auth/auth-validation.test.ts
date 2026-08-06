import { describe, expect, it } from "vitest";

import { sanitizeReturnPath } from "./return-path";
import {
  getPasswordRequirements,
  normalizeEmailForSubmission,
  validateAuthFields,
} from "./auth-validation";

describe("auth validation", () => {
  it("normalizes only email surroundings and case", () => {
    expect(normalizeEmailForSubmission("  Person@Example.COM ")).toBe(
      "person@example.com",
    );
  });

  it("does not rewrite forbidden Unicode into ASCII", () => {
    expect(normalizeEmailForSubmission("K@example.com")).toBe("K@example.com");
    expect(
      validateAuthFields("sign-up", "K@example.com", "TripDemo9@Qz"),
    ).toEqual({ email: "Use an ASCII email address." });
  });

  it("reports every sign-up password requirement independently", () => {
    const requirements = getPasswordRequirements("short");
    expect(requirements.filter(({ met }) => !met).map(({ id }) => id)).toEqual(
      expect.arrayContaining(["length", "uppercase", "digit", "special"]),
    );
  });

  it("accepts the approved sign-up password shape", () => {
    expect(
      validateAuthFields("sign-up", "person@example.com", "TripDemo9@Qz"),
    ).toEqual({});
  });

  it.each([
    ["length", "Tr9@"],
    ["length", `Aa1@${"x".repeat(17)}`],
    ["uppercase", "tripdemo9@qz"],
    ["lowercase", "TRIPDEMO9@QZ"],
    ["digit", "TripDemo@Qz"],
    ["special", "TripDemo9Qz"],
    ["allowed", "TripDemo9@Qz!"],
  ])("rejects a password that misses %s", (requirementId, password) => {
    expect(
      getPasswordRequirements(password).find(({ id }) => id === requirementId)
        ?.met,
    ).toBe(false);
    expect(
      validateAuthFields("sign-up", "person@example.com", password),
    ).toEqual({ password: "Meet every password requirement." });
  });

  it.each([
    ["empty", "", "Enter your email."],
    ["format", "person.example.com", "Enter a valid email."],
    [
      "length",
      `${"a".repeat(243)}@example.com`,
      "Email must be 254 characters or fewer.",
    ],
  ])("reports the expected %s email error", (_case, email, message) => {
    expect(validateAuthFields("sign-up", email, "TripDemo9@Qz")).toEqual({
      email: message,
    });
  });

  it("does not apply sign-up composition rules during login", () => {
    expect(
      validateAuthFields("login", "person@example.com", "legacy passphrase"),
    ).toEqual({});
  });

  it("applies only the login transport cap", () => {
    expect(
      validateAuthFields("login", "person@example.com", "x".repeat(1_024)),
    ).toEqual({});
    expect(
      validateAuthFields("login", "person@example.com", "x".repeat(1_025)),
    ).toEqual({ password: "Password is too long." });
  });

  it.each([
    "https://evil.example",
    "//evil.example",
    "javascript:alert(1)",
    "/dashboard?next=https://evil.example",
    "/future-private-route",
  ])("rejects an unapproved return path: %s", (value) => {
    expect(sanitizeReturnPath(value)).toBe("/dashboard");
  });
});
