/* eslint-disable camelcase */
import { lightThemeColors, darkThemeColors } from './tailwind.colors';
import nord from 'daisyui/src/theming/themes';
import night from 'daisyui/src/theming/themes';

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
                /*
        ...lightThemeColors,
        ...(lightThemeColors.custom || {}), // <-- ensure custom colors are included
        */
                'bali-hai': lightThemeColors.baliHai,
                'primary': lightThemeColors.primary,
                'secondary': lightThemeColors.secondary,
                'accent': lightThemeColors.accent,
                'highlight': lightThemeColors.custom.highlight,
                'highlight-content': lightThemeColors.custom['highlight-content'] || '#ffffff',
                'favourites-list': lightThemeColors.custom['favourites-list'],
                'favourites-list-content': lightThemeColors.custom['favourites-list-content'] || '#ffffff',
                'favourites-list-hover': lightThemeColors.custom['favourites-list-hover'] || lightThemeColors.custom.highlight,
                'favourites-list-hover-content': lightThemeColors.custom['favourites-list-hover-content'] || '#ffffff',
                'compare-list': lightThemeColors.custom['compare-list'] || '#2a333a',
                'compare-list-hover': lightThemeColors.custom['compare-list-hover'] || '#1d262f',
                'compare-list-content': lightThemeColors.custom['compare-list-content'] || '#ffffff',
                'work': lightThemeColors.custom.work,
                'manifestation': lightThemeColors.custom.manifestation,
                'item': lightThemeColors.custom.item,
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
                    ...nord, // DaisyUI Basisfarben
                    ...lightThemeColors,
                    primary: lightThemeColors.primary?.DEFAULT || lightThemeColors.primary,
                    'primary-content': '#ffffff',
                    secondary: lightThemeColors.secondary?.DEFAULT || lightThemeColors.secondary,
                    accent: lightThemeColors.accent?.DEFAULT || lightThemeColors.accent,
                    // ✅ Hier richtig überschreiben
                    neutral: lightThemeColors.neutral?.DEFAULT || '#364754',
                    'neutral-content': '#ffffff', // Kontrastfarbe
                    base: lightThemeColors.base?.DEFAULT || '#fbfcfd',
                    'base-content': lightThemeColors.base?.content || '#212529', // Textfarbe auf hellem Hintergrund
                    'base-100': lightThemeColors.base?.[100] || '#fbfcfd',
                    'base-200': lightThemeColors.base?.[200] || '#f3f6f8',
                    'base-300': lightThemeColors.base?.[300] || '#edf0f3',
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
                    // ✅ Dark-Theme Neutral
                    neutral: darkThemeColors.neutral?.DEFAULT || '#1d262f',
                    'neutral-content': darkThemeColors.neutral?.content || '#ffffff', // Kontrastfarbe
                    base: darkThemeColors.base?.DEFAULT || '#1e1e1e',
                    'base-content': darkThemeColors.base?.content || '#212529', // Textfarbe auf hellem Hintergrund
                }
            }
        ],
    },
};
