import next from "eslint-config-next";

/**
 * Flat config. eslint-config-next v16 exports a flat config array directly —
 * no FlatCompat shim needed.
 */
const config = [
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      "out/**",
      "knowledge-base/**",
      ".lighthouseci/**",
      "next-env.d.ts",
    ],
  },
  ...next,
];

export default config;
