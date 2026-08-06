import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseEnv } from "node:util";
import { defineConfig, devices } from "@playwright/test";

const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));
const apiEnvironmentFile = new URL(
  "../api/test/config/.env.runtime.local",
  import.meta.url,
);
const e2eWebOrigin = "http://localhost:43000";
const e2eApiOrigin = "http://localhost:43001";

function readEnvironmentFile(url: URL): Record<string, string> {
  const parsed = parseEnv(readFileSync(url, "utf8"));
  const environment: Record<string, string> = {};

  for (const [name, value] of Object.entries(parsed)) {
    if (value === undefined) {
      throw new Error(`Environment variable ${name} has no value.`);
    }
    environment[name] = value;
  }

  return environment;
}

const apiEnvironment = readEnvironmentFile(apiEnvironmentFile);

export default defineConfig({
  testDir: "./e2e",
  testIgnore: "outage.spec.ts",
  outputDir: "../../test-results/web",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI === "true" ? 1 : 0,
  reporter: [
    ["line"],
    ["html", { outputFolder: "../../playwright-report", open: "never" }],
  ],
  use: {
    baseURL: e2eWebOrigin,
    ...devices["Desktop Chrome"],
    trace: "off",
    screenshot: "only-on-failure",
    video: "off",
  },
  webServer: [
    {
      name: "api",
      command: "pnpm --filter api start:prod",
      cwd: repositoryRoot,
      env: {
        ...apiEnvironment,
        API_PORT: "43001",
        API_CORS_ORIGINS: e2eWebOrigin,
        API_TRUSTED_ORIGINS: e2eWebOrigin,
      },
      url: `${e2eApiOrigin}/api/v1/health/ready`,
      reuseExistingServer: false,
      timeout: 120_000,
      stdout: "ignore",
      stderr: "pipe",
    },
    {
      name: "web",
      command: "pnpm --filter web start",
      cwd: repositoryRoot,
      env: {
        PORT: "43000",
        WEB_INTERNAL_API_ORIGIN: e2eApiOrigin,
      },
      url: `${e2eWebOrigin}/login`,
      reuseExistingServer: false,
      timeout: 120_000,
      stdout: "ignore",
      stderr: "pipe",
    },
  ],
});
