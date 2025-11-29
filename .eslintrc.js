module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  globals: {
    React: "readonly",
    google: "readonly"
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "prettier"
  ],
  settings: {
    react: {
      version: "detect"
    },
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      },
      alias: {
        map: [
          ["@", "./src"],
          ["db", "./db.ts"]
        ],
        extensions: [".js", ".jsx", ".ts", ".tsx"]
      }
    }
  },
  ignorePatterns: ["generated/*", ".next/*", "out/*", "node_modules/*", "src/prisma/migrations/*"],
  rules: {
    "for-direction": "error",
    "no-cond-assign": ["error", "always"],
    "no-console": ["warn", { "allow": ["warn", "error", "info"] }],
    "no-constant-condition": "warn",
    "no-unreachable": "error",
    "curly": ["warn", "all"],
    "default-case": "warn",
    "eqeqeq": ["error", "always", { "null": "ignore" }],
    "no-alert": "warn",
    "no-empty-function": "warn",
    "no-eval": "error",
    "no-implicit-coercion": "error",
    "prefer-const": "error",
    "react/display-name": "off",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/no-unescaped-entities": "off",
    "import/named": "off",
    // Turn off base eslint unused vars rule in favor of typescript-eslint version
    "no-unused-vars": "off"
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: "latest",
        sourceType: "module"
      },
      plugins: ["@typescript-eslint"],
      rules: {
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            "ignoreRestSiblings": true,
            "argsIgnorePattern": "^_",
            "varsIgnorePattern": "^_",
            "caughtErrorsIgnorePattern": "^_"
          }
        ],
        "@typescript-eslint/ban-types": "warn",
        // Completely disable import/named for all TypeScript files
        "import/named": "off"
      }
    },
    {
      files: ["**/*.js", "**/*.mjs"],
      env: {
        node: true
      }
    },
    {
      // Next.js specific rules
      files: ["src/app/**/*.ts", "src/app/**/*.tsx"],
      extends: [
        "next",
        "next/core-web-vitals"
      ],
      rules: {
        "@next/next/no-img-element": "off",
        "@next/next/no-html-link-for-pages": "off"
      }
    }
  ]
};