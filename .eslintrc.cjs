module.exports = {
  root: true,
  extends: [
    '@nuxt/eslint-config',
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': 'error',
    'consistent-return': 'error',
    'indent': ['warn', 4],
    'no-else-return': 'warn',
    'semi': ['warn', 'always'],
    'space-unary-ops': 'error',
    'camelcase': 'warn',
    'no-unused-vars': 'error',
    '@typescript-eslint/no-unused-vars': 'error'
  },
  ignorePatterns: [
    'models/interfaces/**',
    'scripts/**',
    'composables/**/*.html',
    'composables/assets/**',
  ],
  overrides: [
    { files: ['tailwind.config.ts'], rules: { '@typescript-eslint/no-require-imports': 'off' } },
    { files: ['utils/clipboard.ts'], rules: { '@typescript-eslint/no-unused-vars': 'off' } },
  ],
}
