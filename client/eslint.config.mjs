// import eslint from '@eslint/js';
import { defineConfig } from 'eslint/config';
import angular from 'angular-eslint';
import baseConfig from '../eslint.config.mjs';
import stylistic from '@stylistic/eslint-plugin';

export default defineConfig(
  {
    ignores: ['node_modules', 'dist', 'e2e'],
  },
  {
    extends: [
      baseConfig,
      ...angular.configs.tsRecommended,
    ],
    plugins: {
      '@stylistic': stylistic,
    },
    processor: angular.processInlineTemplates,
    rules: {
      '@stylistic/semi': 'error',
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
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateAll],
    rules: {
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
