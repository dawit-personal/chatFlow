import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Base JS rules
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
  },

  // CommonJS source type for all .js files
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
  },

  // Browser globals for all JS files
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
  },

  // Jest environment for backend and frontend test files
  {
    files: [
      "backend/**/*.test.js",
      "backend/**/__tests__/**/*.js",
      "frontend/**/*.test.js",
      "frontend/**/__tests__/**/*.js",
    ],
    languageOptions: {
      env: {
        jest: true,
      },
      // Explicitly declare Jest globals (optional but helpful)
      globals: {
        describe: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        jest: "readonly",
      },
    },
    // Optionally add Jest plugin if you install eslint-plugin-jest
    // plugins: { jest: require("eslint-plugin-jest") },
    // extends: ["plugin:jest/recommended"],
  },
]);
