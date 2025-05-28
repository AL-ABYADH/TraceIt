import { config } from "@repo/eslint-config/base";


const eslintConfig = [
  ...config,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars' : 'off'
    }
  }
];

export default eslintConfig;
