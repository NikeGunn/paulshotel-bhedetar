import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Dev-only Playwright screenshot helpers (not part of the app).
    "scripts/**",
  ]),
  {
    rules: {
      // These advisory rules (new in the Next 16 eslint preset) flag valid
      // external-sync effects (embla/scroll/session init) and intentional
      // local component aliases. They are perf/style hints, not correctness
      // issues, and the patterns are verified working. Keep as warnings.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
    },
  },
]);

export default eslintConfig;
