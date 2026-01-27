import { defineConfig } from 'eslint/config';
import baseConfig from '../eslint.config.mjs';

export default defineConfig(
  {
    ignores: ['node_modules', 'dist'],
  },
  {
    extends: [
      baseConfig,
    ],
  },
);
