export default {
  "*.{js,jsx,ts,tsx}": [
    "prettier --write",
    "eslint --fix",
    // 'jest --bail --findRelatedTests',
  ],
};
