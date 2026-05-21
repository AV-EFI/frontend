/* eslint-disable camelcase */
/** @type {import('tailwindcss').Config} */

module.exports = {
  safelist: [
    { pattern: /^(hover:)?bg-(work|item|manifestation|work-variant|favourites-list|favourites-list-hover|compare-list|compare-list-hover)$/ },
    { pattern: /^text-(favourites-list-content|favourites-list-hover-content|compare-list-content)$/ },
  ],
  content: [
    './app.vue',
    'formkit.theme.ts',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue'
    // add more globs as needed, e.g. './components/**/*.{vue,js,ts}'
  ],
  theme: {
    extend: {
      spacing: { '128': '32rem' },
      colors: {
        'bali-hai': {
          '50': '#f3f7f8',
          '100': '#dfe9ee',
          '200': '#c3d5de',
          '300': '#9ab8c6',
          '400': '#80a3b5',
          DEFAULT: '#80a3b5',
          '500': '#4d768d',
          '600': '#436277',
          '700': '#3b5263',
          '800': '#364754',
          '900': '#313d48',
          '950': '#1d262f',
        },
        primary: {
          '50': '#f3f7f8',
          '100': '#dfe9ee',
          '200': '#c3d5de',
          '300': '#9ab8c6',
          '400': '#80a3b5',
          DEFAULT: '#4d768d',
          '500': '#4d768d',
          '600': '#436277',
          '700': '#3b5263',
          '800': '#364754',
          '900': '#313d48',
          '950': '#1d262f',
        },
        secondary: { DEFAULT: '#e6c373' },
        accent: {
          '50': '#fcf5f7',
          '100': '#f7e3e8',
          '200': '#efc6d0',
          '300': '#e6a9b9',
          '400': '#de96a8',
          DEFAULT: '#d8899c',
          '500': '#d8899c',
          '600': '#c76c82',
          '700': '#a95569',
          '800': '#8a4355',
          '900': '#703746',
        },
        favourites: {
          '50': '#fbf4f4',
          '100': '#f4dddd',
          '200': '#e8bbbb',
          '300': '#d89799',
          '400': '#c77679',
          DEFAULT: '#b85a5e',
          '500': '#b85a5e',
          '600': '#9a464a',
          '700': '#7d393d',
          '800': '#663033',
          '900': '#552a2c',
        },
        highlight: '#e4acba',
        'highlight-content': '#3a1f26',
        'favourites-list': '#b85a5e',
        'favourites-list-content': '#ffffff',
        'favourites-list-hover': '#9a464a',
        'favourites-list-hover-content': '#ffffff',
        'compare-list': '#2a333a',
        'compare-list-hover': '#1d262f',
        'compare-list-content': '#ffffff',
        work: '#F3E2B8',
        manifestation: '#E8D39E',
        item: '#DDC48B',
      },
    },
  },

  darkMode: [
    'selector',
    '[data-theme="avefi_dark"]',
    'variant',
    [
      '@media (prefers-color-scheme: dark) { &:not(.light *) }',
      '&:is([data-theme="avefi_dark"] *)',
      '&:where([data-theme="avefi_dark"] *)',
    ],
  ],

  plugins: [
    require('@tailwindcss/typography'),
    require('@vueform/slider/tailwind'),
    require('daisyui'),
    // Utility components
    function ({ addComponents }) {
      addComponents({
        '.icon-inline': {
          width: '1em',
          height: '1em',
          'flex-shrink': '0',
        },
        '.icon-action': {
          width: '1.25em',
          height: '1.25em',
          'flex-shrink': '0',
        },
        '.icon-status': {
          '@apply w-6 h-6 shrink-0': {},
        },
        '.icon-empty-state': {
          '@apply w-8 h-8 shrink-0': {},
        },
        '.btn-icon': {
          '@apply btn btn-circle': {},
        },
        '.btn-icon-xs': {
          '@apply btn btn-circle btn-xs': {},
        },
        '.btn-icon-sm': {
          '@apply btn btn-circle btn-sm': {},
        },
        '.btn-danger': {
          '@apply btn btn-error': {},
        },
        '.btn-danger-outline': {
          '@apply btn btn-outline btn-error': {},
        },
        '.btn-carousel-control': {
          '@apply btn btn-circle text-base-content border border-base-300 shadow w-10 h-10': {},
          display: 'inline-flex',
          'align-items': 'center',
          'justify-content': 'center',
          'line-height': '1',
          padding: '0',
          'aspect-ratio': '1 / 1',
          '--btn-color': 'var(--color-base-200)',
          'background-color': 'var(--color-base-200) !important',
          '& > *': {
            display: 'inline-flex',
            'align-items': 'center',
            'justify-content': 'center',
          },
          '& :where(svg)': {
            width: '1.125rem',
            height: '1.125rem',
            display: 'block',
          },
          '&:hover': {
            '--btn-color': 'var(--color-base-300)',
            'background-color': 'var(--color-base-300) !important',
          },
          '&:is([data-theme="avefi_dark"] *)': {
            'background-color': 'var(--color-base-300) !important',
          },
          '&:is([data-theme="avefi_dark"] *):hover': {
            'background-color': 'var(--color-base-100) !important',
          },
        },
        '.btn-favourites-list': {
          '@apply bg-favourites-list text-favourites-list-content hover:bg-favourites-list-hover hover:text-favourites-list-hover-content': {},
        },
        '.btn-compare-list': {
          '@apply bg-compare-list text-compare-list-content hover:bg-compare-list-hover hover:text-compare-list-content': {},
        },
        '.badge-highlight': { '@apply badge bg-highlight text-highlight-content': {} },
        '.badge-highlight-xs': { '@apply badge badge-xs bg-highlight text-highlight-content': {} },
        '.badge-favourites-list': { '@apply badge bg-favourites-list text-favourites-list-content': {} },
        '.badge-compare-list': { '@apply badge bg-compare-list text-compare-list-content': {} },
        '.btn-highlight': { '@apply bg-highlight text-highlight-content hover:bg-highlight hover:text-highlight-content': {} },
        '.panel-surface': {
          '@apply w-full bg-white text-base-content border-2 border-base-200 rounded-lg dark:bg-gray-800': {},
        },
        '.panel-surface-muted': {
          '@apply bg-base-200 text-base-content border border-base-300 dark:bg-base-300': {},
        },
        '.filter-chip': {
          '@apply border border-base-200 text-base-content rounded-lg': {},
        },
      });
    },
    // Fancy text utility
    function ({ addUtilities }) {
      addUtilities({
        '.text-nuggets-5280': {
          position: 'relative',
          display: 'inline-block',
          fontWeight: '800',
          color: 'transparent',
          backgroundImage:
            'linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextStroke: '2px black',
          textShadow: 'none',
          WebkitMaskImage:
            'linear-gradient(to bottom, transparent 0%, transparent 45%, black 45%, black 100%), repeating-linear-gradient(45deg, black 0px, black 1px, transparent 1px, transparent 4px)',
          WebkitMaskComposite: 'destination-in',
          maskComposite: 'intersect',
          maskImage:
            'linear-gradient(to bottom, transparent 0%, transparent 45%, black 45%, black 100%), repeating-linear-gradient(45deg, black 0px, black 1px, transparent 1px, transparent 4px)',
        },
      });
    },
  ],

  /** DAISYUI v5 **/
  daisyui: {
    // Extend built-in light/dark with AVefi overrides
    themes: [
      {
        avefi_light: {
          primary: '#4d768d',
          secondary: '#e6c373',
          accent: '#d8899c',
          neutral: '#364754',
          'base-100': '#ffffff',
          info: '#5c84a6',
          success: '#6da67c',
          warning: '#caa450',
          error: '#b04b4b',
          'error-content': '#ffffff',
        },
      },
      {
        avefi_dark: {
          primary: '#c3d5de',
          secondary: '#997a2e',
          accent: '#d39ea3',
          neutral: '#1d262f',
          'base-100': '#1d262f',
          info: '#5c84a6',
          success: '#78DBAA',
          warning: '#F8A948',
          error: '#b04b4b',
          'error-content': '#ffffff',
        },
      },
    ],
    darkTheme: 'avefi_dark',
  },
};
