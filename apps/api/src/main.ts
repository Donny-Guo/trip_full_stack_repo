import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { configureApp } from "./configure-app";

const DEFAULT_API_PORT = 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? DEFAULT_API_PORT);
}

bootstrap().catch(() => {
  console.error("API bootstrap failed.");
  process.exitCode = 1;
});
