//import { theme } from './formkit.theme';
import { defineFormKitConfig } from '@formkit/vue';
import rootClasses from './formkit.theme.ts';
import { generateClasses } from '@formkit/themes';
//import generateClasses from '@formkit/themes';
import autocomplete from './utils/AVefiAutocomplete.ts';
import { createAutoAnimatePlugin } from '@formkit/addons';
import { de, en } from '@formkit/i18n';
import { genesisIcons } from '@formkit/icons';
import { createProPlugin, inputs } from '@formkit/pro';

export default defineFormKitConfig({
    inputs: {
        AVefiAutocomplete: autocomplete,
    },
    config: {
        rootClasses,
        classes: generateClasses({
            AVefiAutocomplete: {
                outer:
                    '$reset group min-w-0 grow mb-3.5 data-[disabled]:select-none data-[disabled]:opacity-50 text-sm formkit-outer',
                inner:
                    '$reset w-full relative flex items-center bg-white border-2 border-opacity-0 dark:border-opacity-100 dark:border-zinc-300 dark:bg-transparent rounded-xl group-data-[is-multiline]:!rounded-xl formkit-inner max-w-xl selection:text-zinc-700 group-data-[has-overlay]:selection:!text-transparent text-sm text-zinc-700 min-w-0 min-h-[1.5em] grow selection:bg-bali-hai-100 placeholder:text-zinc-400 group-data-[disabled]:!cursor-not-allowed dark:placeholder-zinc-400/50 dark:text-zinc-300 p-0 pl-2 focus:ring-0 formkit-input',
                dropdown:
                    'absolute top-full left-[1em] min-w-[32em] bg-neutral-50 shadow-md m-0 p-0 list-none overflow-hidden rounded-sm z-20',
                dropdownItem:
                    'p-2 border-b border-gray-200 data-[selected=true]:bg-blue-100',
            },
        }),
    },
    locales: {
        en,
        de
    },
    locale: 'de',
    icons: {
        ...genesisIcons
    },
    plugins: [
        createProPlugin('fk-307d837b2', inputs),
        createAutoAnimatePlugin(
            {
                /* optional AutoAnimate config */
                // default:
                duration: 300,
                easing: 'ease-in-out',
            },
            {
                /* optional animation targets object */
                // default:
                global: ['outer', 'inner'],
                form: ['form'],
                repeater: ['items'],
                autocomplete: []
            }
        )
    ],
});