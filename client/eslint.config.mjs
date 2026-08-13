// import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import angularEslint from 'angular-eslint';
import baseConfig from '../eslint.config.mjs';
import noUnnecessaryNewlines from './eslint-rules/no-unnecessary-newlines.mjs';
import paddingLineBetweenTemplateNodes from './eslint-rules/padding-line-between-template-nodes.mjs';

export default defineConfig(
  {
    ignores: ['node_modules', 'dist', 'e2e'],
  },
  {
    extends: [baseConfig],
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
        project: ['./tsconfig.json'],
      },
    },
  },
  {
    files: ['**/*.ts'],
    extends: [
      angularEslint.configs.tsRecommended,
    ],
    rules: {
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
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    extends: [...angularEslint.configs.templateAll],
    plugins: {
      local: {
        rules: {
          'no-unnecessary-newlines': noUnnecessaryNewlines,
          'padding-line-between-template-nodes': paddingLineBetweenTemplateNodes,
        },
      },
    },
    rules: {
      'local/no-unnecessary-newlines': 'error',
      'local/padding-line-between-template-nodes': 'error',
      '@angular-eslint/template/i18n': 'off',
      // disabled because it doesn't work with signal
      // https://github.com/angular-eslint/angular-eslint/issues/1380#issuecomment-1783783808
      '@angular-eslint/template/no-call-expression': 'off',
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
