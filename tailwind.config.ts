import { lightThemeColors, darkThemeColors } from './tailwind.colors';
import { pastel, cupcake, night } from 'daisyui/src/theming/themes';

/** @type {import('tailwindcss').Config} */
module.exports = {
  safelist: [
    'bg-favourites-list',
    'bg-favourites-list-hover',
    'text-favourites-list-content',
    'text-favourites-list-hover-content',
    {
      pattern: /^(hover:)?bg-(work|item|manifestation|work-variant|favourites-list|favourites-list-hover|compare-list|compare-list-hover)$/,
    },
    {
      pattern: /^text-(favourites-list-content|favourites-list-hover-content|compare-list-content)$/,
    },
  ],
  content: [
    './app.vue',
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './formkit.theme.ts',
  ],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
      },
      colors: {
        ...lightThemeColors,
        ...(lightThemeColors.custom || {}), // <-- ensure custom colors are included
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
    function ({ addComponents }) {
      addComponents({
        '.btn-favourites-list': {
          '@apply bg-favourites-list text-favourites-list-content hover:bg-favourites-list-hover hover:text-favourites-list-hover-content': {},
        },
        '.btn-compare-list': {
          '@apply bg-compare-list text-compare-list-content hover:bg-compare-list-hover hover:text-compare-list-content': {},
        },
        '.badge-favourites-list': {
          '@apply badge bg-favourites-list text-favourites-list-content': {},
        },
        '.badge-compare-list': {
          '@apply badge bg-compare-list text-compare-list-content': {},
        },
      });
    },
    function ({ addUtilities }) {
      addUtilities({
        '.text-nuggets-5280': {
          position: 'relative',
          display: 'inline-block',
          fontWeight: '800',
          color: 'transparent',
          backgroundImage: `
            linear-gradient(
              90deg,
              red,
              orange,
              yellow,
              green,
              blue,
              indigo,
              violet
            )
          `,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextStroke: '2px black',
          textShadow: 'none',
          WebkitMaskImage: `
            linear-gradient(to bottom, transparent 0%, transparent 45%, black 45%, black 100%),
            repeating-linear-gradient(
              45deg,
              black 0px,
              black 1px,
              transparent 1px,
              transparent 4px
            )
          `,
          WebkitMaskComposite: 'destination-in',
          maskComposite: 'intersect',
          maskImage: `
            linear-gradient(to bottom, transparent 0%, transparent 45%, black 45%, black 100%),
            repeating-linear-gradient(
              45deg,
              black 0px,
              black 1px,
              transparent 1px,
              transparent 4px
            )
          `,
        },
      });
    },
  ],
  daisyui: {
    base: true,
    styled: true,
    utils: true,
    darkTheme: 'avefi_dark',
    logs: false,
    viewer: false,
    themes: [
      {
        avefi_light: {
          ...cupcake,
          ...lightThemeColors,
          primary: lightThemeColors.primary?.DEFAULT || lightThemeColors.primary,
          'primary-content': '#ffffff',
          secondary: lightThemeColors.secondary?.DEFAULT || lightThemeColors.secondary,
          accent: lightThemeColors.accent?.DEFAULT || lightThemeColors.accent,
          neutral: lightThemeColors.neutral?.DEFAULT || lightThemeColors.neutral,
        },
      },
      {
        avefi_dark: {
          ...night,
          ...darkThemeColors,
          primary: darkThemeColors.primary?.DEFAULT || darkThemeColors.primary,
          'primary-content': '#ffffff',
          secondary: darkThemeColors.secondary?.DEFAULT || darkThemeColors.secondary,
          accent: darkThemeColors.accent?.DEFAULT || darkThemeColors.accent,
          neutral: darkThemeColors.neutral?.DEFAULT || darkThemeColors.neutral,
        },
      },
    ],
  },
};
