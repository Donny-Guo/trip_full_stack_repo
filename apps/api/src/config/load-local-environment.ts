import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";

export function loadLocalEnvironment(
  fileName: ".env.runtime.local" | ".env.migration.local",
): void {
  const path = fileURLToPath(new URL(`../../${fileName}`, import.meta.url));
  if (existsSync(path)) {
    loadEnvFile(path);
  }
}
