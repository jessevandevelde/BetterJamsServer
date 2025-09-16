import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import stylistic from '@stylistic/eslint-plugin';

const eslintConfig = defineConfig(
  eslint.configs.recommended,
  stylistic.configs.recommended,
  {
    rules: {
      '@stylistic/comma-dangle': [
        'error',
        'always-multiline',

      ],
      'no-console': 'error',
      '@stylistic/padding-line-between-statements': ['error',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: '*', next: ['const', 'let'] },
        { blankLine: 'always', prev: ['const', 'let'], next: '*' },
        { blankLine: 'any', prev: ['const', 'let'], next: ['const', 'let'] },
        { blankLine: 'always', prev: '*', next: 'multiline-const' },
        { blankLine: 'always', prev: 'multiline-const', next: '*' },
        { blankLine: 'always', prev: '*', next: 'multiline-let' },
        { blankLine: 'always', prev: 'multiline-let', next: '*' },
        { blankLine: 'always', prev: '*', next: 'multiline-expression' },
        { blankLine: 'always', prev: 'multiline-expression', next: '*' },
        { blankLine: 'always', prev: '*', next: 'block-like' },
        { blankLine: 'always', prev: 'block-like', next: '*' },
        { blankLine: 'any', prev: 'case', next: 'case' },
        { blankLine: 'any', prev: 'case', next: 'default' },
        { blankLine: 'always', prev: ['import'], next: '*' },
        { blankLine: 'any', prev: ['import'], next: ['import'] },
        { blankLine: 'always', prev: ['expression'], next: '*' },
        { blankLine: 'always', prev: '*', next: ['expression'] },
        { blankLine: 'any', prev: ['expression'], next: ['expression'] },
        { blankLine: 'any', prev: '*', next: 'break' },
      ],
      '@stylistic/semi': ['error', 'always'],
    },
  },
);

export default defineConfig(
  {
    ignores: ['node_modules', 'dist', 'e2e'],
  },
  {
    files: ['**/*.mjs', '**/*.js'],
    extends: eslintConfig,
  },
  {
    files: ['**/*.ts'],
    plugins: {
      '@stylistic': stylistic,
    },
    extends: [
      eslintConfig,
      ...tseslint.configs.all,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@typescript-eslint/class-methods-use-this': 'off',
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'btj',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'btj',
        },
      ],
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateAll],
    rules: {
      '@angular-eslint/template/i18n': 'off',
      '@angular-eslint/template/attributes-order': [
        'error',
        {
          alphabetical: true,
          order: [
            'STRUCTURAL_DIRECTIVE',
            'ATTRIBUTE_BINDING',
            'TWO_WAY_BINDING',
            'OUTPUT_BINDING',
            'INPUT_BINDING',
            'TEMPLATE_REFERENCE',
          ],
        },
      ],
    },
  },
);
