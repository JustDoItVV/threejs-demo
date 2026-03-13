import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // TODO: Fix violations and re-enable these rules
  {
    rules: {
      "@typescript-eslint/no-empty-object-type": "off",
      "react-hooks/refs": "off",           // block-building.tsx: ref access during render
      "react-hooks/set-state-in-effect": "off", // blockchain-city.tsx: setState in useEffect
      "react-hooks/purity": "off",          // transaction-particles.tsx: Math.random() in useMemo
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
