import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
  {
    ignores: ["node_modules/", ".temp/", "dist/", "**/*.svg", "src/static/"]
  },
  js.configs.recommended,
  eslintConfigPrettier,
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      sourceType: "commonjs",
      ecmaVersion: 2021,
      globals: {
        ...globals.browser
      }
    },
    rules: {
      eqeqeq: "warn",
      "no-unneeded-ternary": "error",
      "no-unused-vars": "warn",
      "prefer-const": [
        "error",
        {
          destructuring: "any",
          ignoreReadBeforeAssign: false
        }
      ],
      // complexity: ["warn", 10],
      // "max-lines-per-function": ["warn", { max: 50, skipBlankLines: true, skipComments: true }],
      "max-depth": ["warn", 2],
      "max-params": ["warn", 4]
    }
  }
]);
