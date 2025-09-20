import typescriptEslint from '@typescript-eslint/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/webpack.config.js',
      '**/*.md',
      '**/*.d.ts',
      '**/*.js',
      '**/*.py',
      '**/node_modules/',
      '**/.idea/',
      '**/dist/',
      '**/package-lock.json',
    ],
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      'unused-imports': unusedImports,
      // "prettier": prettier
    },

    // extends: [
    //     "prettier"
    // ],

    languageOptions: {
      globals: {
        ...globals.node,
      },

      parser: tsParser,
    },

    rules: {
      'prettier/prettier': 2,
      'newline-per-chained-call': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-empty-function': 0,
      '@typescript-eslint/ban-types': 0,
      '@typescript-eslint/no-var-requires': 0,
      '@typescript-eslint/no-inferrable-types': 0,
      'prefer-const': 'error',
      'no-async-promise-executor': 'off',
      'no-case-declarations': 'off',
      'prefer-spread': 0,
      'no-useless-escape': 0,
      'no-empty': 0,
      'no-console': 0,
      curly: 'error',
      'no-multi-spaces': 'error',
      'block-spacing': 'error',

      // "newline-per-chained-call": ["error", {
      //     ignoreChainWithDepth: 2,
      // }],

      'no-multiple-empty-lines': [
        'error',
        {
          max: 1,
        },
      ],

      'padded-blocks': ['error', 'never'],

      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: ['const', 'let', 'var'],
          next: '*',
        },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        {
          blankLine: 'always',
          prev: ['case', 'default'],
          next: '*',
        },
        {
          blankLine: 'always',

          prev: [
            'block-like',
            'multiline-block-like',
            'multiline-expression',
            'multiline-const',
            'multiline-let',
            'multiline-var',
            'export',
            'function',
            'class',
          ],

          next: '*',
        },
        {
          blankLine: 'always',
          prev: '*',

          next: [
            'block-like',
            'multiline-block-like',
            'multiline-expression',
            'multiline-const',
            'multiline-let',
            'multiline-var',
            'function',
            'export',
            'class',
            'return',
          ],
        },
      ],

      'space-before-blocks': 'error',
      'no-confusing-arrow': 'error',
      'no-var': 'error',
      'prefer-template': 'error',
      'no-fallthrough': 'off',
      'lines-around-comment': 'off',
      'brace-style': 'error',
      'comma-spacing': 'error',
      'lines-between-class-members': 'error',
      'unused-imports/no-unused-imports': 'warn',
      '@typescript-eslint/no-non-null-assertion': 1,

      // "@typescript-eslint/brace-style": ["error", "1tbs", {
      //     allowSingleLine: false,
      // }],

      // "@typescript-eslint/comma-spacing": ["error", {
      //     before: false,
      //     after: true,
      // }],

      // "@typescript-eslint/lines-between-class-members": ["error", "always", {
      //     exceptAfterSingleLine: true,
      //     exceptAfterOverload: true,
      // }],
    },
  },
];
