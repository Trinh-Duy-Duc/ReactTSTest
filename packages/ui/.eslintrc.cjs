/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  ignorePatterns: [".eslintrc.cjs"],
  extends: ["@repo/eslint-config/index.js"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  plugins: [
    'react-hooks',
  ],
  rules: {
    'react-hooks/exhaustive-deps': 'warn',  // Cảnh báo khi thiếu dependencies trong useEffect
  },
};
