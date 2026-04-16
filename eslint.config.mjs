import eslintPluginVue from 'eslint-plugin-vue';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import vueParser from 'vue-eslint-parser';


export default [
  // Global ignore block (wirkt auf alle Dateien)
  {
    ignores: [
      'node_modules/**',
      '.output/**',
      '.nuxt/**',
      'dist/**',
      'coverage/**',
      'public/**',
      'scripts/**',
      'models/interfaces/**',
      'composables/**/*.html',
      'composables/assets/**',
    ],
  },

  // Main rule block for TS + Vue
  {
    files: ['**/*.ts', '**/*.vue'],
    languageOptions: {
  parser: vueParser,
  parserOptions: {
    parser: tsParser,
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
    extraFileExtensions: ['.vue'],
  },
},
    plugins: {
      vue: eslintPluginVue,
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      // Vue rules
      ...eslintPluginVue.configs['flat/recommended'].rules,

      // TypeScript rules
      ...tsPlugin.configs.recommended.rules,

      // Custom rules
      'consistent-return': 'warn',
      'no-else-return': 'warn',
      'semi': ['warn', 'always'],
      'space-unary-ops': 'error',
      'camelcase': 'warn',
      'no-unused-vars': 'off', // TS übernimmt
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-require-imports': 'off',

      // Vue indentation (template + script)
      'vue/html-indent': ['warn', 4, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
      }],
      'vue/script-indent': ['warn', 4, {
        baseIndent: 0,
        switchCase: 1,
      }],
    },
  },
  // 👇 Override: Disable camelcase in .vue files
  {
    files: ['**/*.vue'],
    rules: {
      indent: 'off',
      camelcase: 'off',
    },
  },

  // 👇 Enforce indentation for .ts files
  {
    files: ['**/*.ts'],
    rules: {
      indent: ['warn', 2], // Change to 4 for 4 spaces
    },
  },
];
