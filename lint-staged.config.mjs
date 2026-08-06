export default {
  "*": "prettier --write --ignore-unknown",
  "apps/web/**/*.{js,mjs,ts,tsx}":
    "pnpm --filter web exec eslint --fix --max-warnings=0",
  "apps/api/{src,test}/**/*.ts":
    "pnpm --filter api exec eslint --fix --max-warnings=0",
};
