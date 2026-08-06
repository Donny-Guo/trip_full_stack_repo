import { jest } from "@jest/globals";
import request from "supertest";
import {
  createApiTestHarness,
  type ApiTestHarness,
} from "./helpers/test-app.js";

describe("health API", () => {
  let harness: ApiTestHarness;

  beforeAll(async () => {
    harness = await createApiTestHarness();
  });

  afterAll(async () => {
    await harness?.close();
  });

  it("keeps liveness process-only and reports database readiness", async () => {
    const querySpy = jest.spyOn(harness.runtime, "query");
    await request(harness.app.getHttpServer())
      .get("/api/v1/health/live")
      .expect(200)
      .expect({ status: "ok" });
    expect(querySpy).not.toHaveBeenCalled();

    await request(harness.app.getHttpServer())
      .get("/api/v1/health/ready")
      .expect(200)
      .expect({ status: "ready" });
    expect(querySpy).toHaveBeenCalledWith("SELECT 1");
    querySpy.mockRestore();
  });

  it("maps a readiness query failure to a safe 503", async () => {
    const querySpy = jest
      .spyOn(harness.runtime, "query")
      .mockRejectedValueOnce(new Error("test-only database outage"));
    const response = await request(harness.app.getHttpServer()).get(
      "/api/v1/health/ready",
    );
    expect(response.status).toBe(503);
    const body: unknown = response.body;
    expect(body).toEqual(
      expect.objectContaining({
        code: "SERVICE_UNAVAILABLE",
        message: "The service is temporarily unavailable.",
      }),
    );
    querySpy.mockRestore();
  });
});
