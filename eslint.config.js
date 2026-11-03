// eslint.config.js
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import importPlugin from 'eslint-plugin-import' // optional: remove with the import rules below
import prettier from 'eslint-config-prettier'

export default [
  {
    ignores: ['dist', 'coverage', 'node_modules', 'playwright-report', 'test-results'],
  },
  { linterOptions: { reportUnusedDisableDirectives: 'warn' } },

  // App code (browser)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: true,
        node: { extensions: ['.js', '.jsx'] },
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin, // optional
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // React
      'react/react-in-jsx-scope': 'off', // not needed with the new JSX transform
      'react/prop-types': 'off', // enable if you use PropTypes
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Undefined / unused values
      // (no-undef and react/jsx-no-undef come from the recommended sets above)
      'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],

      // Imports (optional)
      'import/named': 'error',
      'import/no-unresolved': 'error',

      // Code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // Node environment: Vitest helpers, Playwright specs, config files
  {
    files: ['tests/**/*.{js,jsx}', 'e2e/**/*.js', '*.config.{js,cjs,mjs}'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-console': 'off' },
  },

  // Playwright's fixture callback is named `use`, which the hooks rule mistakes for React's use()
  {
    files: ['e2e/**/*.js'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },

  // Vitest unit tests (globals: true in vitest.config.js)
  {
    files: ['**/*.test.{js,jsx}'],
    languageOptions: { globals: { ...(globals.vitest ?? {}) } },
  },

  // Must be last: disables rules that conflict with Prettier
  prettier,
]
