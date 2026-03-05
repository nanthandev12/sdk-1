// @ts-check

import { baseConfig } from "@decibeltrade/eslint-config/base";
import { dirname } from "path";
import tseslint from "typescript-eslint";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default tseslint.config(
  {
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        projectService: {
          allowDefaultProject: ["*.mjs"],
        },
        tsconfigRootDir: __dirname,
      },
    },
  },
  baseConfig,
  {
    files: ["src/eip55.ts"],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
    },
  },
);
