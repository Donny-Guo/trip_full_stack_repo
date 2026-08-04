import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "../src/app.module";
import { configureApp } from "../src/configure-app";

describe("Health liveness (HTTP)", () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const testingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = testingModule.createNestApplication<INestApplication<App>>();
    configureApp(app);
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("serves GET /api/v1/health/live", async () => {
    await request(app.getHttpServer())
      .get("/api/v1/health/live")
      .expect(200)
      .expect({ status: "ok" });
  });

  it("does not expose liveness outside the API prefix", async () => {
    await request(app.getHttpServer()).get("/health/live").expect(404);
  });
});
