// @ts-check
import pluginQuery from '@tanstack/eslint-plugin-query';
import prettier from 'eslint-config-prettier';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig, globalIgnores } from 'eslint/config';

/**
 * Reusability tiers (see AGENTS.md): imports only point down
 *   app → features → components (composites) → components/ui → lib
 */
const restrict = (groups, message, regex) => ({
  'no-restricted-imports': [
    'error',
    { patterns: [{ group: groups, message }, ...(regex ? [{ regex, message }] : [])] },
  ],
});

const sizeLimit = (maxFileLines) => ({
  // Hitting a limit means "split the component", never "raise the limit".
  'max-lines': ['error', { max: maxFileLines, skipBlankLines: true, skipComments: true }],
  'max-lines-per-function': ['error', { max: 80, skipBlankLines: true, skipComments: true }],
  // Depth counts from 0, so 4 allows five nested levels.
  'react/jsx-max-depth': ['error', { max: 4 }],
  'max-params': ['error', 3],
});

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

  // ─── Component size ──────────────────────────────────────────────
  { files: ['src/**/*.{ts,tsx}'], rules: sizeLimit(150) },
  // Primitives wrap many Base UI parts (Trigger, Content, Item...) in one file.
  { files: ['src/components/ui/**/*.{ts,tsx}'], rules: sizeLimit(250) },

  // Tests read as one long `describe` per behaviour; production code keeps the limits above.
  {
    files: ['src/**/*.test.{ts,tsx}', 'src/test/**/*.{ts,tsx}'],
    rules: {
      'max-lines-per-function': 'off',
      'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    },
  },

  // ─── Reusability tiers ───────────────────────────────────────────
  {
    files: ['src/features/**/*.{ts,tsx}'],
    rules: restrict(['@/app/*'], 'Features are composed by routes, never the other way round.'),
  },
  {
    files: ['src/components/**/*.{ts,tsx}'],
    rules: restrict(
      ['@/features/*', '@/app/*'],
      'Shared components are domain-agnostic: pass data and labels in as props.',
    ),
  },
  {
    // Later block wins for ui/: primitives are the bottom of the component stack.
    files: ['src/components/ui/**/*.{ts,tsx}'],
    rules: restrict(
      ['@/features/*', '@/app/*', '../*'],
      'Primitives may only import other primitives, hooks and lib.',
      '^@/components/(?!ui/)',
    ),
  },
  {
    files: ['src/hooks/**/*.{ts,tsx}'],
    rules: restrict(
      ['@/features/*', '@/app/*', '@/components/*'],
      'Shared hooks are domain-agnostic and UI-free.',
    ),
  },
  {
    files: ['src/lib/**/*.ts'],
    rules: restrict(
      ['@/features/*', '@/app/*', '@/components/*', '@/hooks/*'],
      'lib/ is the bottom layer: pure helpers with no React or app code.',
    ),
  },

  prettier,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
