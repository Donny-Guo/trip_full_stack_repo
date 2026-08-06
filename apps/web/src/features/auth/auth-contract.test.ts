import { describe, expect, it } from "vitest";

import { isValidAuthSuccessResponse, isValidMeResponse } from "./auth-contract";

const SAFE_USER = {
  id: "00000000-0000-4000-8000-000000000001",
  email: "person@example.com",
  createdAt: "2026-08-06T12:00:00.000Z",
  updatedAt: "2026-08-06T12:00:00.000Z",
} as const;

function jsonResponse(value: unknown): Response {
  return new Response(JSON.stringify(value), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("auth response contracts", () => {
  it("accepts the exact documented success shapes", async () => {
    await expect(
      isValidAuthSuccessResponse(
        jsonResponse({
          messageCode: "AUTH_SIGN_UP_SUCCEEDED",
          user: SAFE_USER,
        }),
        "sign-up",
      ),
    ).resolves.toBe(true);
    await expect(
      isValidAuthSuccessResponse(jsonResponse({ user: SAFE_USER }), "login"),
    ).resolves.toBe(true);
    await expect(isValidMeResponse(jsonResponse(SAFE_USER))).resolves.toBe(
      true,
    );
  });

  it("rejects HTML, missing fields, and sensitive extra fields", async () => {
    await expect(
      isValidMeResponse(
        new Response("<html>gateway error</html>", {
          headers: { "Content-Type": "text/html" },
        }),
      ),
    ).resolves.toBe(false);
    await expect(isValidMeResponse(jsonResponse({}))).resolves.toBe(false);
    await expect(
      isValidMeResponse(
        jsonResponse({ ...SAFE_USER, passwordHash: "must-not-appear" }),
      ),
    ).resolves.toBe(false);
  });
});
