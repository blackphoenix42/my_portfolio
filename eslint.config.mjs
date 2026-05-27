import next from "eslint-config-next/core-web-vitals";
import tsParser from "@typescript-eslint/parser";

// eslint-config-next ships a Next-bundled @babel/eslint-parser whose internal
// eslint-scope lacks the addGlobals API introduced in ESLint v9+. Swap in the
// TypeScript-ESLint parser globally — it handles both JS and TS and exposes a
// modern ScopeManager.
const patched = next.map((entry) => {
  if (entry?.languageOptions?.parser) {
    return {
      ...entry,
      languageOptions: {
        ...entry.languageOptions,
        parser: tsParser,
        parserOptions: {
          ...(entry.languageOptions.parserOptions ?? {}),
          ecmaFeatures: { jsx: true },
          sourceType: "module",
        },
      },
    };
  }
  return entry;
});

export default [
  {
    ignores: [
      ".next/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "node_modules/**",
      "public/**",
      "out/**",
      "dist/**",
      "next-env.d.ts",
      "*.config.js",
      "*.config.mjs",
      "*.config.cjs",
      "*.config.ts",
    ],
  },
  ...patched,
  {
    // eslint-plugin-react 7.x has a known ESLint 10 incompat in its React-version
    // detection (uses removed context.getFilename). Pinning the version skips it.
    settings: { react: { version: "19.2.6" } },
    rules: {
      "react/no-unescaped-entities": "off",
      // New opinionated rules in eslint-plugin-react-hooks v6 — opt out for now.
      // `setMounted(true)` in a mount effect is a standard SSR-hydration pattern,
      // and `react-hooks/immutability` over-flags hoisted function declarations.
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/immutability": "off",
    },
  },
];
