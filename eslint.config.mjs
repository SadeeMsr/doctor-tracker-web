// @ts-check
import pluginQuery from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-config-prettier';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  ...pluginQuery.configs['flat/recommended'],
  {
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      'no-console': ['warn', { allow: ['error'] }],
      eqeqeq: ['error', 'always'],
    },
  },
  prettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
