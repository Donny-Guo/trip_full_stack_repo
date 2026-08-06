import { Controller, Get } from "@nestjs/common";
import { DatabaseReadinessService } from "./database-readiness.service.js";

@Controller("health")
export class HealthController {
  public constructor(
    private readonly databaseReadiness: DatabaseReadinessService,
  ) {}

  @Get("live")
  public getLiveness(): { readonly status: "ok" } {
    return { status: "ok" };
  }

  @Get("ready")
  public async getReadiness(): Promise<{ readonly status: "ready" }> {
    await this.databaseReadiness.assertReady();
    return { status: "ready" };
  }
}
