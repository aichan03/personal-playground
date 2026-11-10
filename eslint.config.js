// eslint.config.js
import js from '@eslint/js'
import prettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import' // optional: remove with the import rules below
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
// import unicorn from 'eslint-plugin-unicorn' // optional: only used for file naming //only available in eslint-v10

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
      'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],

      // Imports (optional)
      'import/named': 'error',
      'import/no-unresolved': 'error',
      'import/first': 'error',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      // 'import/order': [
      //   'warn',
      //   {
      //     groups: ['builtin', 'external', 'internal', ['parent', 'sibling', 'index']],
      //     'newlines-between': 'always',
      //     alphabetize: { order: 'asc', caseInsensitive: true },
      //   },
      // ],

      // ---------- Naming conventions ----------
      // camelCase for variables/functions; UPPER_SNAKE_CASE constants are still allowed
      // camelcase: ['error', { properties: 'never', ignoreDestructuring: false }],
      // PascalCase for constructors/classes; don't call PascalCase without `new`
      'new-cap': ['error', { newIsCap: true, capIsNew: false }],
      // PascalCase for React components (also blocks e.g. <my_component />)
      'react/jsx-pascal-case': ['error', { allowAllCaps: false }],
      // Avoid meaningless one-letter names (allow common loop/coordinate/event names)
      'id-length': [
        'warn',
        { min: 2, exceptions: ['i', 'j', 'x', 'y', 'e', '_', '$'], properties: 'never' },
      ],
      // Don't shadow globals/restricted names (e.g. `name`, `event`, `status`)
      'no-restricted-globals': ['error', 'event', 'name', 'status', 'length'],
      'no-shadow': 'error',
      'no-underscore-dangle': ['warn', { allowAfterThis: false, allow: [] }],

      // ---------- React conventions ----------
      'react/jsx-key': ['error', { checkFragmentShorthand: true }],
      'react/no-array-index-key': 'warn',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'], // <Foo disabled /> not disabled={true}
      'react/jsx-no-useless-fragment': 'warn',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/function-component-definition': [
        'error',
        { namedComponents: 'function-declaration', unnamedComponents: 'arrow-function' },
      ],
      'react/no-unstable-nested-components': 'error',
      'react/hook-use-state': 'warn', // [value, setValue] naming symmetry
      'react/destructuring-assignment': ['warn', 'always'],
      'react/jsx-no-target-blank': 'error',

      // ---------- Code quality ----------
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-var': 'error',
      curly: ['error', 'all'],
      'default-case': 'error',
      'default-case-last': 'error',
      'consistent-return': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'no-nested-ternary': 'error',
      'no-param-reassign': [
        'error',
        { props: true, ignorePropertyModificationsFor: ['draft', 'state'] },
      ],
      'no-implicit-coercion': 'error',
      'no-throw-literal': 'error',
      'no-return-await': 'error',
      'no-useless-rename': 'error',
      'no-useless-return': 'error',
      'no-lonely-if': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-destructuring': ['warn', { object: true, array: false }],
      'prefer-object-spread': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'dot-notation': 'error',
      'max-params': ['warn', 4],
      'max-depth': ['warn', 4],
      complexity: ['warn', 15],

      // <Foo /> must be defined or imported in scope (already in react recommended; shown explicitly)
      'react/jsx-no-undef': ['error', { allowGlobals: false }],

      // Marks components used in JSX as "used", so an import only used as <Foo /> isn't flagged,
      // while an imported but never-rendered component still is
      'react/jsx-uses-vars': 'error',

      // Catches plain undefined identifiers (functions, variables, etc.)
      'no-undef': 'error',

      // Default import must have a default export: import Foo from './Foo'
      'import/default': 'error',

      // import * as ns, then ns.Foo must exist
      'import/namespace': 'error',

      //Experimental
      // It forces you to define variables, functions, or classes before using them, which indirectly imposes an order
      'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    },
  },

  // Optional: file naming (components PascalCase, everything else camelCase)
  // {
  //   files: ['src/**/*.{js,jsx}'],
  //   plugins: { unicorn },
  //   rules: {
  //     'unicorn/filename-case': ['error', { cases: { pascalCase: true, camelCase: true } }],
  //   },
  // },

  // Node environment: Vitest helpers, Playwright specs, config files
  {
    files: ['tests/**/*.{js,jsx}', 'e2e/**/*.js', '*.config.{js,cjs,mjs}'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-console': 'off' },
  },

  // Config files commonly use default exports and relaxed naming
  // {
  //   files: ['*.config.{js,cjs,mjs}'],
  //   rules: { 'unicorn/filename-case': 'off', camelcase: 'off' },
  // },

  // Playwright's fixture callback is named `use`, which the hooks rule mistakes for React's use()
  {
    files: ['e2e/**/*.js'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },

  // Vitest unit tests (globals: true in vitest.config.js)
  {
    files: ['**/*.test.{js,jsx}'],
    languageOptions: { globals: { ...(globals.vitest ?? {}) } },
    rules: {
      'max-params': 'off',
      'id-length': 'off',
      'no-magic-numbers': 'off',
    },
  },

  // Must be last: disables rules that conflict with Prettier
  prettier,
]
