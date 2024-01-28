/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ["*.js"],
  root: true,
  extends: ["@repo/eslint-config/next.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
};
