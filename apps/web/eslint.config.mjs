import createTypeCheckedConfig, { prettierConfig } from "@trip/config-eslint";
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypeScript from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTypeScript,
  globalIgnores([
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  ...createTypeCheckedConfig(import.meta.dirname),
  prettierConfig,
]);

export default eslintConfig;
