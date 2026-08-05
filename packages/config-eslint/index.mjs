// @ts-check
import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const typeScriptFiles = ["**/*.{ts,tsx,mts,cts}"];

/**
 * Creates shared type-aware rules while anchoring project discovery at the
 * consuming application rather than this configuration package.
 *
 * @param {string} tsconfigRootDir
 */
export function createTypeCheckedConfig(tsconfigRootDir) {
  return defineConfig([
    {
      name: "trip/type-checked-typescript",
      files: typeScriptFiles,
      extends: [
        js.configs.recommended,
        tseslint.configs.recommendedTypeChecked,
      ],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
    },
  ]);
}

export { eslintConfigPrettier as prettierConfig };

export default createTypeCheckedConfig;
