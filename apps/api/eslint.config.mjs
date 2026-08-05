// @ts-check
import createTypeCheckedConfig, { prettierConfig } from "@trip/config-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";

export default defineConfig([
  globalIgnores(["node_modules/**", "dist/**", "coverage/**"]),
  ...createTypeCheckedConfig(import.meta.dirname),
  prettierConfig,
  {
    name: "api/node",
    files: ["src/**/*.ts", "test/**/*.ts"],
    languageOptions: {
      globals: globals.node,
    },
  },

  {
    name: "api/jest",
    files: ["src/**/*.spec.ts", "test/**/*.ts"],
    languageOptions: {
      globals: globals.jest,
    },
  },
]);
