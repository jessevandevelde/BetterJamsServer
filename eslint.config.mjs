// @ts-check
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default tseslint.config(
  {
    files: ["**/*.ts"],
    plugins: {
      '@stylistic': stylistic
    },
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.all,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@stylistic/comma-dangle': ["error", "always"],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
        },
      ],
    },
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      }
    }
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateAll,
    ],
    rules: {
      "@angular-eslint/template/i18n": 'off',
      '@angular-eslint/template/attributes-order': ['error', {
        alphabetical: true,
        order: [
          'STRUCTURAL_DIRECTIVE',
          'ATTRIBUTE_BINDING',
          'TWO_WAY_BINDING',
          'OUTPUT_BINDING',
          'INPUT_BINDING',
          'TEMPLATE_REFERENCE',
        ],
      }],
    },
  }
);
