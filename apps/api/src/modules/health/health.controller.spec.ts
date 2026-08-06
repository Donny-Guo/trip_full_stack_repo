import { jest } from "@jest/globals";
import { Test } from "@nestjs/testing";
import { DatabaseReadinessService } from "./database-readiness.service.js";
import { HealthController } from "./health.controller.js";

describe("HealthController", () => {
  const assertReady = jest.fn<() => Promise<void>>();
  let controller: HealthController;

  beforeEach(async () => {
    assertReady.mockReset().mockResolvedValue(undefined);
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: DatabaseReadinessService,
          useValue: { assertReady },
        },
      ],
    }).compile();
    controller = moduleRef.get(HealthController);
  });

  it("reports process liveness without checking PostgreSQL", () => {
    expect(controller.getLiveness()).toEqual({ status: "ok" });
    expect(assertReady).not.toHaveBeenCalled();
  });

  it("checks PostgreSQL for readiness", async () => {
    await expect(controller.getReadiness()).resolves.toEqual({
      status: "ready",
    });
    expect(assertReady).toHaveBeenCalledTimes(1);
  });
});
