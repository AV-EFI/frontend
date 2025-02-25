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
                'secondary': {
                    '50': '#f9f5eb',
                    '100': '#f2e6cc',
                    '200': '#e6d3a3',
                    '300': '#d7bf83',
                    'DEFAULT': '#d7bf83',
                    '400': '#c4a95e',
                    '500': '#b08e3a',
                    '600': '#997a2e',
                    '700': '#7d6023',
                    '800': '#5f471a',
                    '900': '#4a3613',
                    '950': '#2a1e0b',
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
                "work-variant": {
                    'DEFAULT': '#9B3D27',
                    "50": "#f2e4e1",
                    "100": "#dfbfb8",
                    "200": "#cc9b8e",
                    "300": "#b97665",
                    "400": "#a6523b",
                    "500": "#9b3d27",
                    "600": "#862f1d",
                    "700": "#702514",
                    "800": "#5a1c0c",
                    "900": "#441305",
                    "950": "#2e0a02"
                },
                "manifestation": {
                    'DEFAULT': '#6A9D92',
                    "50": "#e6f0ee",
                    "100": "#c1d9d3",
                    "200": "#9cc1b8",
                    "300": "#76aa9d",
                    "400": "#519282",
                    "500": "#6A9D92",
                    "600": "#487c72",
                    "700": "#376159",
                    "800": "#274640",
                    "900": "#162a26",
                    "950": "#0a1614"
                },
                "item": {
                    'DEFAULT': '#9C9078',
                    "50": "#ebe8e3",
                    "100": "#d2cbbc",
                    "200": "#b9af95",
                    "300": "#a1936e",
                    "400": "#887748",
                    "500": "#9C9078",
                    "600": "#857b67",
                    "700": "#6f6655",
                    "800": "#595144",
                    "900": "#433c33",
                    "950": "#2d2722"
                },
                'shopping-cart': {
                    'DEFAULT':'#D98C00',
                    "50": "#fbeede",
                    "100": "#f5d7b1",
                    "200": "#efc184",
                    "300": "#e9ab56",
                    "400": "#e39529",
                    "500": "#D98C00",
                    "600": "#b97500",
                    "700": "#985e00",
                    "800": "#774700",
                    "900": "#563000",
                    "950": "#3d2200"
                },
                'shopping-cart-dark': '#985e00',
                'compare-list': {
                    'DEFAULT': '#6750A4',
                    "50": "#ede8f7",
                    "100": "#d6cdec",
                    "200": "#bfb2e1",
                    "300": "#a897d6",
                    "400": "#917ccc",
                    "500": "#6750A4",
                    "600": "#56428b",
                    "700": "#453472",
                    "800": "#342759",
                    "900": "#231a40",
                    "950": "#19122e"
                },
                'compare-list-dark': '#342759'
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
                    "secondary-50": "#f9f5eb",
                    "secondary-100": "#f2e6cc",
                    "secondary-200": "#e6d3a3",
                    "secondary-300": "#d7bf83",
                    "secondary-400": "#c4a95e",
                    "secondary-500": "#b08e3a",
                    "secondary-600": "#997a2e",
                    "secondary-700": "#7d6023",
                    "secondary-800": "#5f471a",
                    "secondary-900": "#4a3613",
                    "secondary-950": "#2a1e0b",
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
                    'base-content': '#222222',
                    '--compare-list': colors.rose[200],
                    '--shopping-cart': colors.indigo[600],
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
                    'primary': '#c3d5de',
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
                    "secondary": "#997a2e",
                    "secondary-50": "#f9f5eb",
                    "secondary-100": "#f2e6cc",
                    "secondary-200": "#e6d3a3",
                    "secondary-300": "#d7bf83",
                    "secondary-400": "#c4a95e",
                    "secondary-500": "#b08e3a",
                    "secondary-600": "#997a2e",
                    "secondary-700": "#7d6023",
                    "secondary-800": "#5f471a",
                    "secondary-900": "#4a3613",
                    "secondary-950": "#2a1e0b",
                    "info": "#17a2b8",
                    "success": "#78DBAA",
                    "warning": "#F8A948",
                    "neutral": '#1d262f',
                    "error": "#FF9DA0",
                    "--balihai": "#80a3b5",
                    "--wcag-red": "#882255",
                    '--compare-list': colors.rose[600],
                    '--shopping-cart': colors.indigo[600]
                }
            }
        ],
    },
};