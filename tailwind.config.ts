import {pastel, cupcake} from 'daisyui/src/theming/themes';
import colors from 'tailwindcss/colors';

/** @type {import('tailwindcss').Config} */
/** TAILWIND **/
module.exports = {
  safelist: [
    {
      pattern: /^(hover:)?bg-(work|item|manifestation|work-variant|favourites-list|favourites-list-hover|compare-list|compare-list-hover)$/,
    },
    {
      pattern: /^text-(favourites-list-content|favourites-list-hover-content|compare-list-content)$/,
    },
  ],
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
              'secondary': {
                DEFAULT: '#e6c373'
              },
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
              'highlight': '#b2161d',
              'highlight-content': '#ffffff',
              'favourites-list': '#e11923',
              'favourites-list-content': '#ffffff',
              'favourites-list-hover': '#b2161d',
              'favourites-list-hover-content': '#ffffff',
              'compare-list': '#2a333a',          // slate-black (cool)
              'compare-list-hover': '#1d262f',    // deeper for hover
              'compare-list-content': '#ffffff',
              'work': '#F3E2B8',
              'manifestation': '#E8D39E',
              'item': '#DDC48B',
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
        require('daisyui'),
        function({ addComponents }) {
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
                  // Rainbow shows through bottom half scanlines
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
                }
              })
        }
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
                      cupcake,
                      primary: "#4d768d",
                      "primary-content": "oklch(93% 0.034 272.788)",
                      secondary: "#e6c373",
                      "secondary-content": "oklch(27% 0.006 286.033)",
                      "--btn-color": "#364754",
                      "--btn-hover-bg": "#3f5869", // ← lighter than full neutral
                      "--btn-hover-border": "#3f5869",
                      "--btn-hover-text": "#ffffff",
                      "base-content": "#364754",      // replaces black
                      "neutral": "#364754",           // dark slate
                      "neutral-content": "#ffffff",   // white text on hover
                      //"base-100": "oklch(100% 0 0)",
                      "base-200": "oklch(98% 0 0)",
                      "base-300": "oklch(95% 0 0)",
                      "info": "#5c84a6",
                      "success": "#6da67c",
                      "warning": "#caa450",
                      "error": "#b04b4b",
                      "disabled-bg": "#d6d8dc",
                      "disabled-text": "#a1a1a1",
                    },
            },
            {
              'avefi_dark': {
                ...require("daisyui/src/theming/themes")["night"],                
                // Updated Primary (bali-hai / bluish slate)
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
            
                // Updated Secondary (muted golden)
                'secondary': '#997a2e',
                'secondary-50': '#f9f5eb',
                'secondary-100': '#f2e6cc',
                'secondary-200': '#e6d3a3',
                'secondary-300': '#d7bf83',
                'secondary-400': '#c4a95e',
                'secondary-500': '#b08e3a',
                'secondary-600': '#997a2e',
                'secondary-700': '#7d6023',
                'secondary-800': '#5f471a',
                'secondary-900': '#4a3613',
                'secondary-950': '#2a1e0b',
            
                // Accent tone for red-ish interactions (altrosa)
                'accent': '#d39ea3', // softened red-pink
                'accent-content': '#ffffff',
            
                // Base

                'neutral': '#1d262f',
                'neutral-content': '#ffffff',
                'base-100': '#1d262f',
                'base-200': '#2a333a',
                'base-300': '#3a444c',
                'base-content': '#f3f7f8',
            
                // Status colors
                'info': '#5c84a6',
                'success': '#78DBAA',
                'warning': '#F8A948',
                'error': '#b04b4b',
            
                // Component colors
                'favourites-list': '#b55a63',               // refined altrosa
                'favourites-list-content': '#ffffff',
                'favourites-list-hover': '#a04852',
            
                'compare-list': '#436277',                 // blue slate
                'compare-list-content': '#ffffff',
                'compare-list-hover': '#3b5263',
            
                'work-variant': '#9B3D27',
                'work-variant-content': '#ffffff',
            
                'manifestation': '#6A9D92',
                'manifestation-content': '#ffffff',
            
                'item': '#9C9078',
                'item-content': '#ffffff',
            
                '--balihai': '#80a3b5',
                '--wcag-red': '#882255',
                '--shopping-cart': '#4f46e5'
              }
            }            
        ],
    },
};