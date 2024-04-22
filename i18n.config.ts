export default defineI18nConfig(() => ({
    legacy: false,
    locale: 'de',
    messages: {
        en: {
            welcome: 'Welcome',
            open: 'Open',
            language: 'Language',
            theme: 'Theme',
            linkscollection: 'Links',
            comparison: 'Comparison',
            '$vuetify.open': 'hä?',
            filmresearch: 'Research',
            filmidentification: 'Film Identification',
            hello: 'Hello',
            help: 'Help',
        },
        de: {
            welcome: 'Willkommen',
            open: 'Öffnen',
            language: 'Sprache',
            theme: 'Ansicht',
            linkscollection: 'Linksammlung',
            comparison: 'Vergleich',
            hello: 'Hallo',
            filmresearch: 'Filmrecherche',
            filmidentification: 'Filmdatenredaktion',
            help: 'Hilfe',
            '$vuetify.open': 'hä?'
        }
    }
}));