import { defineFormKitConfig } from '@formkit/vue';
import rootClasses from '~/formkit.theme';
import { createAutoAnimatePlugin } from '@formkit/addons';
import { de, en } from '@formkit/i18n';
import { genesisIcons } from '@formkit/icons';
import { createProPlugin, inputs } from '@formkit/pro';

export default defineFormKitConfig({
    config: {
        rootClasses
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
            }
        )
    ],
});