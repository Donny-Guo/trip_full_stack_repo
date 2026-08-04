import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get("live")
  getLiveness(): { readonly status: "ok" } {
    return { status: "ok" };
  }
}
