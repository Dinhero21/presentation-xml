// @ts-check

import eslint from '@eslint/js';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { languageOptions: { globals: globals.browser } },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      // 'import/order': [
      //   'error',
      //   {
      //     groups: [
      //       'type',
      //       'index',
      //       'sibling',
      //       'parent',
      //       'internal',
      //       'builtin',
      //       'external',
      //       'object',
      //     ],
      //   },
      // ],
      'simple-import-sort/exports': 'off',
      'simple-import-sort/imports': 'error',
      'no-case-declarations': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'no-constant-condition': ['error', { checkLoops: false }],
    },
  },
  prettier,
);
