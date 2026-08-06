import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module.js";
import { validateRuntimeEnvironment } from "./config/environment.js";
import { loadLocalEnvironment } from "./config/load-local-environment.js";
import { configureApp } from "./configure-app.js";

async function bootstrap(): Promise<void> {
  loadLocalEnvironment(".env.runtime.local");
  const environment = validateRuntimeEnvironment(process.env);
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule.register(environment),
  );
  configureApp(app, environment);
  app.enableShutdownHooks();
  await app.listen(environment.API_PORT);
}

bootstrap().catch(() => {
  console.error("API bootstrap failed.");
  process.exitCode = 1;
});
