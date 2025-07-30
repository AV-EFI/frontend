import { createConfigForNuxt } from '@nuxt/eslint-config';

export default createConfigForNuxt([
  {
    rules: {
      'consistent-return': 'error',
      'indent': ['warn', 4],
      'no-else-return': 'warn',
      'semi': ['warn', 'always'],
      'space-unary-ops': 'error',
      'camelcase': 'warn'
    }
  }
]);
