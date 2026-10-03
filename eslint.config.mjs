import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

// Module boundaries (see AGENTS.md "Modularization"). Each page folder owns its components,
// hooks and lib, so one folder can be analysed without the rest of the app.
const noAppAlias = {
  group: ["@/app/**"],
  message:
    "Do not import from another route via the alias. Move shared code to src/components/shared or src/lib.",
};
const noSiblingRoutes = {
  group: ["../../**"],
  message: "Stay inside your page folder. Shared code belongs in src/components/shared or src/lib.",
};
const noApiClient = {
  group: ["@/lib/api/client", "@/lib/api/client/**", "@/lib/api/endpoints", "@/lib/api/sse"],
  message: "Components do not call the API. Use a hook in the page's hooks/ folder.",
};
const noFeatureInternals = {
  group: ["@/features/*/*"],
  message:
    "Import a feature through its index.ts (for example @/features/evidence), not its internals.",
};
const restrict = (...patterns) => ({
  "no-restricted-imports": ["error", { patterns }],
});

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"]),
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/**/*.test.{ts,tsx}", "src/lib/api/schema.d.ts", "src/components/ui/**"],
    rules: {
      "max-lines": ["error", { max: 200, skipBlankLines: true, skipComments: true }],
      ...restrict(noAppAlias, noFeatureInternals),
    },
  },
  {
    // Page-level internals: no reaching into sibling routes, components never call the API.
    files: ["src/app/**/components/**/*.{ts,tsx}", "src/app/**/hooks/**/*.{ts,tsx}"],
    rules: restrict(noAppAlias, noSiblingRoutes, noFeatureInternals),
  },
  {
    files: ["src/app/**/components/**/*.{ts,tsx}"],
    rules: restrict(noAppAlias, noSiblingRoutes, noFeatureInternals, noApiClient),
  },
  {
    files: [
      "src/app/**/components/**/*.{ts,tsx}",
      "src/components/shared/**/*.{ts,tsx}",
      "src/features/**/components/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-globals": ["error", { name: "fetch", message: "Use a hook, not fetch." }],
    },
  },
  {
    files: ["src/components/shared/**/*.{ts,tsx}", "src/features/**/components/**/*.{ts,tsx}"],
    ignores: ["src/**/*.test.{ts,tsx}"],
    rules: restrict(noAppAlias, noApiClient, noFeatureInternals),
  },
]);

export default eslintConfig;
