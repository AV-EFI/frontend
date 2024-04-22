import daisyui from "daisyui";
import type { Config } from 'tailwindcss';
import night from 'daisyui/src/theming/themes';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './app.vue',
    'formkit.theme.ts'
  ],
  theme: {
    extend: {
      spacing: {
        '128': '32rem',
      },
      colors: {
        'base': {
          '50': '#efefef',
          '400': '#666667',
          '600': '#444445'
        },
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
          DEFAULT: '#80a3b5',
          '500': '#4d768d',
          '600': '#436277',
          '700': '#3b5263',
          '800': '#364754',
          '900': '#313d48',
          '950': '#1d262f',
        }
      }
    }
  },
  darkMode: 'class',
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
  daisyui: {
    base: true,
    styled: true,
    themes: [
      {
        avefi_light: {
          "primary": "#80a3b5",
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
          "secondary": "#000000",
          "accent": "#ff1d25",
          "neutral": "#DFE9EE",
          "neutral-50": "#eef4f6",
          "base-100": "#f3f7f9",
          "base-50": "fcfdfd",
          "info": "#17a2b8",
          "success": "#78DBAA",
          "warning": "#F8A948",
          "error": "#FF9DA0"
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["night"],
          'primary': '#80a3b5',
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
          "secondary": "#000000",
          "accent": "#ff1d25",
          "success": "#78DBAA",
          "warning": "#F8A948",
          "error": "#FF9DA0"
        }
      }
    ],
    darkTheme: "dark"
  },
};


