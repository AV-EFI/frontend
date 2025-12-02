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
                    '50': '#ffe5e7',
                    '100': '#ffccd0',
                    '200': '#ff99a1',
                    '300': '#ff6671',
                    '400': '#ff394e',
                    DEFAULT: '#ff1d25',
                    '500': '#ff1d25',
                    '600': '#e11923',
                    '700': '#b2161d',
                    '800': '#8e1217',
                    '900': '#670d12',
                },
                highlight: '#b2161d',
                'highlight-content': '#ffffff',
                'favourites-list': '#e11923',
                'favourites-list-content': '#ffffff',
                'favourites-list-hover': '#b2161d',
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
                '.btn-favourites-list': {
                    '@apply bg-favourites-list text-favourites-list-content hover:bg-favourites-list-hover hover:text-favourites-list-hover-content': {},
                },
                '.btn-compare-list': {
                    '@apply bg-compare-list text-compare-list-content hover:bg-compare-list-hover hover:text-compare-list-content': {},
                },
                '.badge-favourites-list': { '@apply badge bg-favourites-list text-favourites-list-content': {} },
                '.badge-compare-list': { '@apply badge bg-compare-list text-compare-list-content': {} },
                '.btn-highlight': { '@apply bg-highlight text-highlight-content hover:bg-highlight hover:text-highlight-content': {} },
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
                    accent: '#ff1d25',
                    neutral: '#364754',
                    'base-100': '#ffffff',
                    info: '#5c84a6',
                    success: '#6da67c',
                    warning: '#caa450',
                    error: '#b04b4b',
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
                },
            },
        ],
        darkTheme: 'avefi_dark',
    },
};
