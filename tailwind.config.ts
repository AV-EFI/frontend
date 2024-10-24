import {nord} from 'daisyui/src/theming/themes';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
/** TAILWIND **/
module.exports = {
    content: [
        './app.vue',
        'formkit.theme.ts'
    ],
    theme: {
        extend: {
            spacing: {
                '128': '32rem',
            },
            /**colors here will override theme-specific colors*/
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
                'primary': {
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
                'red-orange': {
                    '50': '#fff1f1',
                    '100': '#ffdfe0',
                    '200': '#ffc5c7',
                    '300': '#ff9da0',
                    '400': '#ff6469',
                    '500': '#ff1d25',
                    '600': '#ed151d',
                    '700': '#c80d14',
                    '800': '#a50f14',
                    '900': '#881418',
                    '950': '#4b0407',
                },
                'accent': {
                    '50': '#fff1f1',
                    '100': '#ffdfe0',
                    '200': '#ffc5c7',
                    '300': '#ff9da0',
                    '400': '#ff6469',
                    '500': '#ff1d25',
                    'DEFAULT': '#ff1d25',
                    '600': '#ed151d',
                    '700': '#c80d14',
                    '800': '#a50f14',
                    '900': '#881418',
                    '950': '#4b0407',
                },
                'wcag-violet': '#332288',
                'wcag-blue': '#6699cc',
                'wcag-lightblue': '#88CCEE',
                'wcag-greenblue': '#44AA99',
                'wcag-darkgreen': '#117733',
                'wcag-lightgreen': '#999933',
                'wcag-yellow': '#DDCC77',
                'wcag-darkred': '#661100',
                'wcag-lightred1': '#CC6677',
                'wcag-lightred2': '#AA4466',
                'wcag-red': {
                    DEFAULT: '#882255'
                },
                'work-variant':  colors.cyan[500],
                'manifestation':  colors.cyan[700],
                'item':  colors.cyan[900],
            }
        }
    },
    darkMode: [
        'selector', 
        '[data-theme="avefi_dark"]', 
        'variant', [
            '@media (prefers-color-scheme: dark) { &:not(.light *) }',
            '&:is([data-theme="avefi_dark"] *)',
            '&:where([data-theme="avefi_dark"] *)'
        ]
    ],
    //darkMode: 'selector',
    /*
    darkMode: ['variant', [
        '@media (prefers-color-scheme: dark) { &:not(.light *) }',
        '&:is(.dark *)',
        '&:where(.dark *)'
    ]],
    */
    plugins: [
        require('@tailwindcss/typography'),
        require('@vueform/slider/tailwind'),
        require('daisyui')
    ],
    /** DAISY UI **/
    daisyui: {
        base: true,
        styled: true,
        utils: true,
        darkTheme: "avefi_dark",
        logs: false,
        //themeRoot: '*',
        viewer: false,
        /** only works with these utils:
            bg-{COLOR_NAME}
            to-{COLOR_NAME}
            via-{COLOR_NAME}
            from-{COLOR_NAME}
            text-{COLOR_NAME}
            ring-{COLOR_NAME}
            fill-{COLOR_NAME}
            caret-{COLOR_NAME}
            stroke-{COLOR_NAME}
            border-{COLOR_NAME}
            divide-{COLOR_NAME}
            accent-{COLOR_NAME}
            shadow-{COLOR_NAME}
            outline-{COLOR_NAME}
            decoration-{COLOR_NAME}
            placeholder-{COLOR_NAME}
            ring-offset-{COLOR_NAME}
         */
        themes: [
            {
                'avefi_light': {
                    nord,
                    //...require("daisyui/src/theming/themes")["nord"],
                    'primary': '#4d768d',
                    'primary-50': '#f3f7f8',
                    'primary-100': '#dfe9ee',
                    'primary-200': '#c3d5de',
                    'primary-300': '#9ab8c6',
                    'primary-400': '#80a3b5',
                    'primary-500': '#4d768d',
                    'primary-600': '#436277',
                    'primary-700': '#3b5263',
                    'primary-800': '#364754',
                    'primary-900': '#313d48',
                    'primary-950': '#1d262f',
                    "primary-content": "#f3f7f8",
                    "secondary": "#D7BF83",
                    "accent": "#ff1d25",
                    "info": "#17a2b8",
                    "success": "#78DBAA",
                    "warning": "#F8A948",
                    "neutral": "#ffffff",
                    "error": "#FF9DA0",
                    "--balihai": "#80a3b5",
                    "--wcag-red": "#882255",
                    'base-100': "#fefefe",
                    'base-200': "#fdfdfd",
                    'base-content': '#222222'
                    /* below syntax not valid in theme */
                    /*
                    'base': {
                        '50': '#efefef',
                        '100': '#ff0000',
                        '200': '#cecece',
                        '300': '#aeaeae',
                        '400': '#666667',
                        '600': '#444445',
                        'content': '#999999'
                    },
                    */
                },
            },
            {
                'avefi_dark': {
                    //night,
                    ...require("daisyui/src/theming/themes")["night"],
                    'primary': '#4d768d',
                    'primary-50': '#f3f7f8',
                    'primary-100': '#dfe9ee',
                    'primary-200': '#c3d5de',
                    'primary-300': '#9ab8c6',
                    'primary-400': '#80a3b5',
                    'primary-500': '#4d768d',
                    'primary-600': '#436277',
                    'primary-700': '#3b5263',
                    'primary-800': '#364754',
                    'primary-900': '#313d48',
                    'primary-950': '#1d262f',
                    "info": "#17a2b8",
                    "success": "#78DBAA",
                    "warning": "#F8A948",
                    "neutral": '#1d262f',
                    "error": "#FF9DA0",
                    "--balihai": "#80a3b5",
                    "--wcag-red": "#882255",
                }
            }
        ],
    },
};