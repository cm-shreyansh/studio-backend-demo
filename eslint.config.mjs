import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['dist/**', 'build/**', 'out/**'],
  },
  // 1. Inherit core JavaScript recommended configurations
  eslint.configs.recommended,

  // 2. Inherit TypeScript recommended configurations
  ...tseslint.configs.recommended,

  // 3. Define target files, custom rules, and plug in Prettier
  {
    files: ['**/*.ts', '**/*.mts', '**/*.cts'],
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Treat Prettier formatting errors as build/lint errors
      'prettier/prettier': 'error',

      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // 4. Deactivate rules conflicting with formatting (Must be last)
  prettierConfig
);
