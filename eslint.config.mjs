import { defineConfig } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

export default defineConfig([
  ...nextVitals,
  {
    rules: {
      // Client-only localStorage hydration intentionally updates state in effects.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);
