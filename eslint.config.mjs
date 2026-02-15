import antfu from "@antfu/eslint-config";
// import tailwind from "eslint-plugin-tailwindcss";

// https://github.com/antfu/eslint-config/tree/main
export default antfu(
  {
    ignores: [
      // Default ignores of eslint-config-next:
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    // Imports eslint-config-next, which should import recommended rulesets
    // from eslint-plugin-react and eslint-plugin-react-hooks
    nextjs: true,
    // Imports a host of other react related eslint plugins that may or may not be relevant here.
    react: true,
    typescript: true,
    formatters: {
      css: true,
    },
    stylistic: {
      quotes: "double",
      semi: true,
      overrides: {
        "style/member-delimiter-style": [
          "error",
          {
            multiline: {
              delimiter: "semi",
              requireLast: true,
            },
            singleline: {
              delimiter: "semi",
              requireLast: true,
            },
            multilineDetection: "brackets",
          },
        ],
      },
    },
  },
  // TODO eslint-plugin-tailwindcss not updated for tailwind v5, usable but with maybe warning logs..
  // ...tailwind.configs["flat/recommended"],
  {
    rules: {
      "antfu/no-top-level-await": "off", // Allow top-level await
      "style/brace-style": ["error", "1tbs"], // Use the default brace style
      "style/operator-linebreak": ["error", "after"],
      "style/quote-props": ["error", "as-needed"],
      "ts/consistent-type-definitions": ["error", "type"], // Use `type` instead of `interface`
      "node/prefer-global/process": "off", // Allow using `process.env`
      // TODO when jest, testing-library brought in, consider enabling these rules
      // "test/padding-around-all": "error", // Add padding in test files
      // "test/prefer-lowercase-title": "off", // Allow using uppercase titles in test titles
    },
  },
);
