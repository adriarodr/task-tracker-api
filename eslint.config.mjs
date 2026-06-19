import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'warn',
      'arrow-body-style': ['warn', 'as-needed'],
      'prefer-destructuring': 'warn',
      'prefer-template': 'error',
      eqeqeq: 'error',
    },
  },
  { files: ['**/*.js'], languageOptions: { sourceType: 'commonjs' } },
  eslintConfigPrettier,
]);
