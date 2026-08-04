// @ts-check
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["node_modules/**", "dist/**", "coverage/**"]),

  {
    name: "api/typescript",
    files: ["src/**/*.ts", "test/**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommendedTypeChecked],
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
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
