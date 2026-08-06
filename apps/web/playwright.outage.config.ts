import { fileURLToPath } from "node:url";
import { defineConfig, devices } from "@playwright/test";

const repositoryRoot = fileURLToPath(new URL("../../", import.meta.url));
const e2eWebOrigin = "http://localhost:43000";

export default defineConfig({
  testDir: "./e2e",
  testMatch: "outage.spec.ts",
  outputDir: "../../test-results/web-outage",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["line"]],
  use: {
    baseURL: e2eWebOrigin,
    ...devices["Desktop Chrome"],
    trace: "off",
    screenshot: "only-on-failure",
    video: "off",
  },
  webServer: {
    name: "web-with-api-unavailable",
    command: "pnpm --filter web start",
    cwd: repositoryRoot,
    env: {
      PORT: "43000",
      WEB_INTERNAL_API_ORIGIN: "http://127.0.0.1:59999",
    },
    url: `${e2eWebOrigin}/login`,
    reuseExistingServer: false,
    timeout: 120_000,
    stdout: "ignore",
    stderr: "pipe",
  },
});
