import { jest } from "@jest/globals";
import { Logger } from "@nestjs/common";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { parseSetCookie } from "cookie";
import request from "supertest";
import type { Response as SupertestResponse } from "supertest";
import {
  createApiTestHarness,
  type ApiTestHarness,
} from "./helpers/test-app.js";

const TRUSTED_ORIGIN = "http://localhost:3000";
const VALID_PASSWORD = "TripDemo9@Qz";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireSingleSetCookie(response: SupertestResponse): string {
  const value: unknown = response.headers["set-cookie"];
  if (
    !Array.isArray(value) ||
    value.length !== 1 ||
    typeof value[0] !== "string"
  ) {
    throw new Error("Expected exactly one Set-Cookie header.");
  }
  return value[0];
}

function expectApiError(
  response: SupertestResponse,
  expectedStatus: number,
  expectedCode: string,
): void {
  expect(response.status).toBe(expectedStatus);
  const body: unknown = response.body;
  if (!isRecord(body)) throw new Error("Expected an API error object.");
  expect(body.code).toBe(expectedCode);
  expect(typeof body.message).toBe("string");
  expect(typeof body.requestId).toBe("string");
  expect(response.headers["cache-control"]).toBe("no-store");
}

describe("authentication API", () => {
  let harness: ApiTestHarness;

  beforeAll(async () => {
    harness = await createApiTestHarness();
  });

  beforeEach(async () => {
    await harness.resetDatabase();
  });

  afterAll(async () => {
    await harness?.close();
  });

  function trustedPost(app: NestExpressApplication, path: string) {
    return request(app.getHttpServer())
      .post(path)
      .set("Origin", TRUSTED_ORIGIN)
      .set("Sec-Fetch-Site", "same-origin")
      .set("Content-Type", "application/json");
  }

  it("signs up, restores the session, and logs out", async () => {
    const agent = request.agent(harness.app.getHttpServer());
    const signUp = await agent
      .post("/api/v1/auth/sign-up")
      .set("Origin", TRUSTED_ORIGIN)
      .set("Sec-Fetch-Site", "same-origin")
      .send({ email: "  Alice@Example.COM  ", password: VALID_PASSWORD });

    expect(signUp.status).toBe(201);
    expect(signUp.headers["cache-control"]).toBe("no-store");
    const signUpBody: unknown = signUp.body;
    if (!isRecord(signUpBody) || !isRecord(signUpBody.user)) {
      throw new Error("Expected a safe sign-up response.");
    }
    expect(signUpBody.messageCode).toBe("AUTH_SIGN_UP_SUCCEEDED");
    expect(signUpBody.user.email).toBe("alice@example.com");
    expect("passwordHash" in signUpBody.user).toBe(false);
    expect("accessToken" in signUpBody).toBe(false);

    const accessCookie = parseSetCookie(requireSingleSetCookie(signUp));
    expect(accessCookie).toMatchObject({
      name: "trip_access_dev",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 900,
    });
    expect(accessCookie.secure).toBeUndefined();
    const serializedSignUp = JSON.stringify(signUp.body);
    expect(serializedSignUp).not.toContain(VALID_PASSWORD);
    expect(serializedSignUp).not.toContain(accessCookie.value);
    expect(serializedSignUp).not.toContain("passwordHash");
    expect(serializedSignUp).not.toContain("accessToken");

    const me = await agent.get("/api/v1/auth/me");
    expect(me.status).toBe(200);
    const meBody: unknown = me.body;
    if (!isRecord(meBody)) throw new Error("Expected a safe User response.");
    expect(meBody.email).toBe("alice@example.com");

    const logout = await agent
      .post("/api/v1/auth/logout")
      .set("Origin", TRUSTED_ORIGIN)
      .set("Sec-Fetch-Site", "same-origin")
      .send({});
    expect(logout.status).toBe(204);
    expect(parseSetCookie(requireSingleSetCookie(logout))).toMatchObject({
      name: "trip_access_dev",
      value: "",
      path: "/",
      maxAge: 0,
    });

    expectApiError(await agent.get("/api/v1/auth/me"), 401, "UNAUTHENTICATED");
  });

  it("logs in and gives unknown email and wrong password the same public error", async () => {
    await trustedPost(harness.app, "/api/v1/auth/sign-up").send({
      email: "alice@example.com",
      password: VALID_PASSWORD,
    });

    const wrongPassword = await trustedPost(
      harness.app,
      "/api/v1/auth/login",
    ).send({
      email: "alice@example.com",
      password: "WrongPass9@",
    });
    const unknownEmail = await trustedPost(
      harness.app,
      "/api/v1/auth/login",
    ).send({
      email: "unknown@example.com",
      password: "WrongPass9@",
    });
    expectApiError(wrongPassword, 401, "INVALID_CREDENTIALS");
    expectApiError(unknownEmail, 401, "INVALID_CREDENTIALS");

    const validLogin = await trustedPost(
      harness.app,
      "/api/v1/auth/login",
    ).send({
      email: "ALICE@example.com",
      password: VALID_PASSWORD,
    });
    expect(validLogin.status).toBe(200);
    expect(parseSetCookie(requireSingleSetCookie(validLogin)).name).toBe(
      "trip_access_dev",
    );
  });

  it("lets exactly one concurrent duplicate registration succeed", async () => {
    const payload = {
      email: "duplicate@example.com",
      password: VALID_PASSWORD,
    };
    const responses = await Promise.all([
      trustedPost(harness.app, "/api/v1/auth/sign-up").send(payload),
      trustedPost(harness.app, "/api/v1/auth/sign-up").send(payload),
    ]);
    expect(responses.map(({ status }) => status).sort()).toEqual([201, 409]);

    const conflict = responses.find(({ status }) => status === 409);
    if (conflict === undefined) {
      throw new Error("Expected one duplicate-registration conflict.");
    }
    expectApiError(conflict, 409, "EMAIL_ALREADY_EXISTS");

    const countRows: unknown = await harness.runtime.query(
      "SELECT count(*)::int AS count FROM app.users WHERE email = $1",
      [payload.email],
    );
    const count: unknown = Array.isArray(countRows) ? countRows[0] : undefined;
    if (!isRecord(count)) throw new Error("Expected a user count row.");
    expect(count.count).toBe(1);
  });

  it("enforces JSON and trusted provenance before mutation", async () => {
    const missingOrigin = await request(harness.app.getHttpServer())
      .post("/api/v1/auth/sign-up")
      .set("Content-Type", "application/json")
      .send({ email: "alice@example.com", password: VALID_PASSWORD });
    expectApiError(missingOrigin, 403, "UNTRUSTED_REQUEST");

    const wrongMedia = await request(harness.app.getHttpServer())
      .post("/api/v1/auth/sign-up")
      .set("Origin", TRUSTED_ORIGIN)
      .set("Content-Type", "text/plain")
      .send("not-json");
    expectApiError(wrongMedia, 415, "UNSUPPORTED_MEDIA_TYPE");
    expect(wrongMedia.headers["access-control-allow-origin"]).toBe(
      TRUSTED_ORIGIN,
    );

    const malformed = await request(harness.app.getHttpServer())
      .post("/api/v1/auth/sign-up")
      .set("Origin", TRUSTED_ORIGIN)
      .set("Sec-Fetch-Site", "same-origin")
      .set("Content-Type", "application/json")
      .send('{"email":');
    expectApiError(malformed, 400, "VALIDATION_ERROR");

    const unknownField = await trustedPost(
      harness.app,
      "/api/v1/auth/sign-up",
    ).send({
      email: "unknown-field@example.com",
      password: VALID_PASSWORD,
      role: "admin",
    });
    expectApiError(unknownField, 400, "VALIDATION_ERROR");

    const oversized = await trustedPost(
      harness.app,
      "/api/v1/auth/sign-up",
    ).send({
      email: "oversized@example.com",
      password: VALID_PASSWORD,
      padding: "x".repeat(20_000),
    });
    expectApiError(oversized, 413, "PAYLOAD_TOO_LARGE");
  });

  it("does not echo sensitive input in public errors or error logs", async () => {
    const sensitiveMarker = "DoNotLog9@UniqueMarker";
    const logger = jest
      .spyOn(Logger.prototype, "error")
      .mockImplementation(() => undefined);

    try {
      const response = await trustedPost(
        harness.app,
        "/api/v1/auth/sign-up",
      ).send({
        email: "invalid-email",
        password: sensitiveMarker,
        unexpected: sensitiveMarker,
      });
      expectApiError(response, 400, "VALIDATION_ERROR");
      expect(JSON.stringify(response.body)).not.toContain(sensitiveMarker);
      expect(JSON.stringify(logger.mock.calls)).not.toContain(sensitiveMarker);
    } finally {
      logger.mockRestore();
    }
  });

  it("rejects an invalid access cookie", async () => {
    const response = await request(harness.app.getHttpServer())
      .get("/api/v1/auth/me")
      .set("Cookie", "trip_access_dev=not-a-jwt");
    expectApiError(response, 401, "UNAUTHENTICATED");
  });

  it("accepts trusted Referer fallback and keeps logout idempotent", async () => {
    const refererSignUp = await request(harness.app.getHttpServer())
      .post("/api/v1/auth/sign-up")
      .set("Referer", `${TRUSTED_ORIGIN}/sign-up`)
      .set("Content-Type", "application/json")
      .send({ email: "referer@example.com", password: VALID_PASSWORD });
    expect(refererSignUp.status).toBe(201);

    const logout = await trustedPost(harness.app, "/api/v1/auth/logout").send(
      {},
    );
    expect(logout.status).toBe(204);
  });
});
