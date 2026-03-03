import locales from '~/models/interfaces/schema/locale_messages.json';
const avefiDe = (locales as any).de ?? (locales as any).default?.de ?? {};

const deBase = {
    "docFilmCollectionDescription": "Dokumentarfilme, die Bewegungen und Akte des Widerstands dokumentieren und reflektieren: die Schlagwortsuche ermöglicht eine thematische Analyse zu Formen des zivilen Ungehorsams.",
    "docFilmCollectionTitle": "Aktivismus im Dokumentarfilm",
    "docFilmCollectionLinkText": "Aktivismus im Dokumentarfilm ansehen",
    "restShortFilmCollectionDescription": "Neue Zugänge zum filmischen Erbe eröffnen restaurierte Manifestationen, etwa digital aufbereitete Kurzfilme.",
    "restShortFilmCollectionTitle": "Restaurierte Kurzfilme",
    "restShortFilmCollectionLinkText": "Restaurierte Filme entdecken",
    'showSuggestions': 'Vorschläge anzeigen',
    'noSuggestionsFound': 'Keine Vorschläge gefunden',
    'errorLoadingDatasets': 'Fehler beim Laden der Datensätze',
    'incompleteData': 'Unvollständige Daten',
    'failedToLoad': 'Laden fehlgeschlagen',
    'invalidComparisonUrl': 'Ungültige Vergleichs-URL',
    'missingBothDatasets': 'Beide Datensatz-Identifikatoren fehlen. Bitte geben Sie \'prev\' und \'next\' als Query-Parameter an.',
    'missingDataset1': 'Datensatz 1-Identifikator fehlt. Bitte geben Sie den \'prev\' Query-Parameter an.',
    'missingDataset2': 'Datensatz 2-Identifikator fehlt. Bitte geben Sie den \'next\' Query-Parameter an.',
    'comparisonUrlHelp': 'Beispiel: /compare?prev=21.11155/work-123&next=21.11155/work-456',
    "hero": {
        "pill": "Filmwissenschaft • Linked Data • Forschung",
        "badgeLine": "PID-ready • Normdaten • FDO-kompatibel"
    },
    "chips": {
        "works": "Werke",
        "manifestations": "Manifestationen",
        "items": "Items",
        "authorityLinks": "Normdaten-Links"
    },
    "build": {
        "linked": {
            "title": "efis für alle – Filme eindeutig identifiziert ",
            "lead": "AVefi ist ein Verbundsystem, das Filmbestände verknüpft. Für jeden Film vergibt AVefi „Einheitliche Filmidentifikatoren“ (efis). Werke, Manifestationen und Exemplare erhalten jeweils eigene, dauerhaft gültige Identifikatoren. So werden Filmwerke institutionsübergreifend eindeutig identifiziert. Manifestationen und Exemplare sind gezielt auffindbar. Das ermöglicht konsistentes Referenzieren und verlässliches Zitieren Suchergebnisse lassen sich filtern und Metadaten können frei nachgenutzt werden.",
            "authority": "Normdaten",
            "crosswalk": "Verknüpfung"
        },
        "schema": {
            "title": "Schema",
            "lead": "The AVefi schema follows the FIAF rules and provides detailed metadata at the levels of Work/Variant, Manifestation, and Item.",
            "work": "Work/Variant",                    
        }

    },
    "searchAndFind": {
        "title": "Entdecken",
        "text": [
            "AVefi zeigt die Vielfalt der Filmkultur in einer Filmdatenbank. Das Spektrum reicht vom frühen Film über Gebrauchs- und Dokumentar- bis zu Amateur- und Autorenfilmen. Nutzen Sie unsere Beispiele als Einstieg in die Suche nach Titeln, Themen, Orten und Personen.",
            "Die Plattform unterscheidet zwischen Werk, Manifestation und Exemplar. So werden Archivbestände eindeutig zugeordnet und vergleichbar. Ergänzende filmografische Quellen sind direkt verlinkt."
        ],
    },
    "callToAction": {
        "title": "Ihre Bestände in AVefi",
        "text": [
            "AVefi ist offen für weitere Filmbestände und Kooperationspartner. Bringen Sie Ihre Daten ein und stärken Sie deren nachhaltige Auffindbarkeit und Zitierfähigkeit.",
            "Durch persistente Identifikatoren und strukturierte Metadaten werden Ihre Bestände eindeutig referenzierbar und institutionsübergreifend sichtbar. Die Einbindung erfolgt nach etablierten Fachstandards und unterstützt eine langfristige wissenschaftliche Nutzung."
        ]
    },
    "becomeAPartner": {
        "title": "Werden Sie Teil der AVefi-Community",
        "text": "Über unsere Mailingliste informieren wir Sie über Neuigkeiten.",
        "cta": "AVefi Mailingliste abonnieren",
        "ctaLink": "https://listserv.gwdg.de/mailman/listinfo/av-efi-community"
    },
    "searchModeSwitcher": "Suchmodus wechseln",
    "timeline": {
        "title": "Vom Datensatz zum Wissen",
        "query": {
            "title": "Abfragen",
            "desc": "Suchen Sie in vernetzten Filmdatensätzen."
        },
        "refine": {
            "title": "Verfeinern",
            "desc": "Filtern Sie nach Sprache, Format oder Ort."
        },
        "share": {
            "title": "Teilen",
            "desc": "Speichern und teilen Sie reproduzierbare Suchzustände."
        },
        "cite": {
            "title": "Zitieren",
            "desc": "Erzeugen Sie persistente Links für wissenschaftliche Nachweise."
        }
    },
    "create": {
        "yourOwn": "Create Your Own",
        "contactFormPrefill": "Contact Form Prefill"
    },
    "topIssuers": "Teilnehmende Archive",
    "dataset": "Datensatz",
    "datasets": "Datensätze",
    "viewDatasets": `Datensätze ansehen`,
    "viewHomepage": "Zur Homepage",
    "switchToLightMode": "Wechsel zu hellem Modus",
    "switchToDarkMode": "Wechsel zu dunklem Modus",
    'home': {
        'breadcrumbs': 'Home',
        'welcome': 'Filmmetadaten aller Genres und Typen sind verfügbar, mit einem besonderen Fokus auf Bildungs-, Lehr- und Wissenschaftsfilme sowie Amateur- und Heimatfilme.',
        'accessibility': {
            'skipToContent': 'Zum Inhalt springen'
        },
        'hero': {
            'bannerSection': 'Ausgewählte Sammlungen und Highlights aus der Welt der Filmdaten',
            'tagline': 'AVefi verknüpft Bestände verschiedener Institutionen zu einem Filmwerk und macht sie dauerhaft eindeutig auffindbar für Recherche und Forschung.',
            'claim': 'Filme finden. Daten verbinden.'
        },
        'search': {
            'modeSwitcher': 'Suchmodus wechseln',
            'simple': 'Einfache Suche anzeigen',
            'advanced': 'Erweiterte Suche anzeigen',
            'loading': 'Suche wird geladen…'
        },
        'featured': {
            'aria': 'Ausgewählte Sammlungen und Highlights aus der Welt der Filmdaten'
        },
        'sections': {
            'searchAndFind': {
                'title': 'Entdecken',
                "text": [
                    "AVefi zeigt die Vielfalt der Filmkultur in einer institutionsübergreifenden Filmdatenbank. Das Spektrum reicht vom frühen Film über Gebrauchs- und Dokumentar- bis zu Amateur- und Autorenfilmen. Nutzen Sie unsere Beispiele als Einstieg in die Suche nach Titeln, Themen, Orten und Personen.",
                    "Die Plattform unterscheidet zwischen Werk, Manifestation und Exemplar. So werden Archivbestände eindeutig zugeordnet und vergleichbar. Ergänzende filmografische Quellen sind direkt verlinkt."
                ],
            },
            'build': {
                'linked': {
                    'title': 'efis für alle – Filme eindeutig identifiziert ',
                    'lead': 'AVefi ist ein Verbundsystem, das Filmbestände aus unterschiedlichen Institutionen verknüpft. Für jeden Film vergibt AVefi „Einheitliche Filmidentifikatoren“ (efis). Werke, Manifestationen und Exemplare erhalten jeweils eigene, dauerhaft gültige Identifikatoren. So werden Filmwerke institutionsübergreifend eindeutig identifiziert. Manifestationen und Exemplare sind gezielt auffindbar. Das ermöglicht konsistentes Referenzieren und verlässliches Zitieren. Suchergebnisse lassen sich filtern und Metadaten können frei nachgenutzt werden.'
                }
            },
            'callToAction': {
                'title': 'Ihre Bestände in AVefi',
                'text': [
                    'AVefi ist offen für weitere Filmbestände und Kooperationspartner. Bringen Sie Ihre Daten ein und stärken Sie deren nachhaltige Auffindbarkeit und Zitierfähigkeit.',
                    'Durch persistente Identifikatoren und strukturierte Metadaten werden Ihre Bestände eindeutig referenzierbar und institutionsübergreifend sichtbar. Die Einbindung erfolgt nach etablierten Fachstandards und unterstützt eine langfristige wissenschaftliche Nutzung.'
                ]
            },
            'timeline': {
                'title': 'Vom Datensatz zum Wissen',
                'query': {
                    'title': 'Abfragen',
                    'desc': 'Suchen Sie in vernetzten Filmdatensätzen.'
                },
                'refine': {
                    'title': 'Verfeinern',
                    'desc': 'Filtern Sie nach Sprache, Format oder Ort.'
                },
                'share': {
                    'title': 'Teilen',
                    'desc': 'Speichern und teilen Sie reproduzierbare Suchzustände.'
                },
                'cite': {
                    'title': 'Zitieren',
                    'desc': 'Erzeugen Sie persistente Links für wissenschaftliche Nachweise.'
                }
            },
            'openAndExtendable': {
                'title': 'Offen und erweiterbar',
                'content': [
                    'AVefi ist eine Plattform für interdisziplinäre filmbezogene Forschung, Filmkultur und Film-Archivarbeit. Sie basiert auf strukturierten Metadaten, Normdaten und persistenten Identifikatoren (PID). Heterogene audiovisuelle Bestände lassen sich damit eindeutig identifizieren und vergleichen. Das Datenschema orientiert sich an etablierten Fachstandards. Leitend sind Linked Open Data und FAIR-Prinzipien.',
                    'Hintergrundinformationen finden Sie auf der Projektwebsite.',
                    'https://projects.tib.eu/av-efi',
                    'Weitere Datenquellen und Kooperationspartner sind sehr willkommen.'
                ],
                'cta': 'Kontaktieren Sie uns'
            },
            'video': {
                'aria': 'AVefi Video',
                'notSupported': 'Ihr Browser unterstützt das Video-Tag nicht.'
            },
            'issuers': {
                'title': 'Teilnehmende Archive'
            },
            'partners': {
                'title': 'Teamwork ',
                'description': 'AVefi ist ein Infrastrukturprojekt im Verbund. Die Verbundpartner arbeiten mit beratender Expertise und konkreter Beteiligung von Praxispartnern zusammen, darunter Archive, Museen und wissenschaftliche Einrichtungen aus dem Bereich Filmkultur und -forschung.'
            },
            'becomePartner': {
                'title': 'Werden Sie Teil der AVefi-Community',
                'text': 'Über unsere Mailingliste informieren wir Sie über Neuigkeiten.',
                'cta': 'Mailingliste abonnieren',
                'ctaLink': 'https://listserv.gwdg.de/mailman/listinfo/av-efi-community'
            }
        },
        'common': {
            'dataset': 'Datensatz',
            'datasets': 'Datensätze'
        },
        'carousel': {
            'aria': {
                'previous': 'Vorherige Folie umschalten',
                'next': 'Nächste Folie umschalten'
            },
            'labels': {
                'imageSource': 'Bildquelle',
                'author': 'Urheber'
            },
            'actions': {
                'showLess': 'Weniger anzeigen',
                'showMore': 'Mehr anzeigen',
                'send': 'Senden',
                'viewDatasets': 'Datensätze ansehen',
                'viewHomepage': 'Zur Homepage',
                'noIssuersFound': 'Keine Archive gefunden'
            },
            'create': {
                'title': 'Wonach suchen Sie?',
                'description': 'Senden Sie uns Ihre Suchanfrage als Vorschlag für die Galerie.',
                'yourOwn': 'Create Your Own',
                'contactFormPrefill': 'Ich habe eine Karussell-Karte erstellt:\n\nTitel: {title}\nBeschreibung: {description}\nSuch-URL: {url}'
            }
        },
        'cards': {
            'collections': {
                'docFilm': {
                    'description': 'Dokumentarfilme, die Bewegungen und Akte des Widerstands dokumentieren und reflektieren: die Schlagwortsuche ermöglicht eine thematische Analyse zu Formen des zivilen Ungehorsams.',
                    'title': 'Aktivismus im Dokumentarfilm',
                    'linkText': 'Aktivismus im Dokumentarfilm ansehen'
                },
                'restShort': {
                    'description': 'Neue Zugänge zum filmischen Erbe eröffnen restaurierte Manifestationen, etwa digital aufbereitete Kurzfilme.',
                    'title': 'Restaurierte Kurzfilme',
                    'linkText': 'Restaurierte Filme entdecken'
                }
            },
            'people': {
                'troller': {
                    'title': 'Georg Stefan Troller',
                    'description': 'Georg Stefan Troller (1921-2025) war ein österreichisch-französischer Filmemacher und Journalist. In seinen Dokumentarfilmen verband er persönliche Geschichten mit sozialen Themen und schuf eindringliche Porträts.',
                    'linkText': 'G.S. Troller bei AVefi'
                },
                'schlenker': {
                    'title': 'Hermann Schlenker',
                    'description': 'Hermann Schlenkers ethnografische Arbeiten aus der zweiten Hälfte des 20. Jahrhunderts sind ein wertvolles Zeitzeugnis von Kulturen, die sich im Wandel befinden oder bereits verschwunden sind.',
                    'linkText': 'Hermann Schlenker bei AVefi'
                }
            }
        },
        'seo': {
            'siteName': 'AVefi – Infrastruktur für audiovisuelle Forschung',
            'title': 'AVefi – Filmdaten-Recherche über Archive hinweg',
            'ogTitle': 'AVefi – Filmwerke und Materialien archivübergreifend finden',
            'description': 'AVefi ermöglicht die Recherche von Werken, Manifestationen und Exemplaren in mehreren deutschen Filmarchiven – mit Normdaten-Verknüpfungen, Persistent Identifiers und Exportfunktionen für Forschung und Praxis.',
            'ogDescription': 'Entdecken Sie Filmwerke über Archive hinweg. AVefi verknüpft Metadaten, Normdaten und Persistent Identifiers, damit Sie Filmbestände gezielt durchsuchen, verfeinern und exportieren können.'
        }
    },
    'advancedSearch': 'Erweiterte Suche',
    'showSimpleSearch': 'Einfache Suche anzeigen',
    'showAdvancedSearch': 'Erweiterte Suche anzeigen',
    'addFacet': 'Facette hinzufügen',
    'selectFacet': 'Facette auswählen',
    'enterValue': 'Wert eingeben',
    "mainNavigation": "Hauptnavigation",
    "cookiesDescription": "Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. Einige Cookies sind notwendig, um die grundlegenden Funktionen der Website zu gewährleisten, während andere uns helfen, die Website zu verbessern und Ihnen personalisierte Inhalte anzubieten. Sie können Ihre Cookie-Einstellungen jederzeit ändern.",
    "dataprotection": "Datenschutzerklärung",
    "imprint": "Impressum",
    'compareRegular': 'Vergleichsansicht',
    'compareRaw': 'Strukturansicht',
    "exactSearchTip": "„Anführungszeichen“ schränken die Suche auf exakte Wortgruppen ein – funktioniert für Titel, Regie, Produktion, Schlagworte (z. B. \"Bitte steigen Sie ein!\")",
    "detailviewlink": "Detailansicht öffnen",
    'viewItemDetails': 'Details zum Exemplar auf Werk-Seite anzeigen',
    'viewManifestationDetails': 'Details zur Manifestation auf Werk-Seite anzeigen',
    'itemsCount': 'Anzahl der Exemplare',
    'parts': 'Teile',
    'workVariants': 'Werke',
    'clickToSelectManifestation': 'Klicken Sie auf die Manifestation, um Exemplare anzuzeigen',
    'noWorkVariantDetails': 'Keine weiteren Informationen zum Werk verfügbar',
    "title": "Titel",
    "vocab.title": "Vokabular",
    "vocab.description": "Das Vokabular bietet Definitionen und Erklärungen zu wichtigen Begriffen, die in AVefi verwendet werden. Es hilft den Nutzern, die Terminologie im Zusammenhang mit audiovisuellen Werken, Manifestationen, Exemplaren und mehr zu verstehen.",
    "vocab.term": "Begriff",
    "vocab.definition": "Definition",
    "vocab.enumSource": "Enum-Quelle",
    "vocab.category": "Kategorie",
    "vocab.search": "Vokabular durchsuchen",
    "vocab.noResults": "Keine Vokabular-Einträge gefunden",
    "vocab.untranslated": "Nicht übersetzt",
    'vocab.all': "Alle Vokabular-Einträge",
    "vocab.filterByLetter": ({ named }: { named: (key: string) => string }) => `Vokabular nach ${named('letter')} filtern`,
    "error404": {
        "title": "Fehler 404: Nicht gefunden",
        "pageNotFound": "Seite nicht gefunden",
        "description": "Die Seite, die Sie suchen, existiert nicht oder wurde verschoben. Bitte überprüfen Sie die URL oder navigieren Sie zurück zur Startseite.",
        "goHome": "Zur Startseite",
        "goBack": "Zurück",
        "message1": "Der Pfad, den Sie suchen, existiert nicht in unseren Archiven.",
        "message2": "Vielleicht hat eine Störung in der URL Sie in die Irre geführt.",
        "message3": "Kehren Sie zum Licht zurück, navigieren Sie in Sicherheit.",
        "seen": "Gesehen",
        "delivered": "Zugestellt",
        "time1": "vor 1 Sekunde",
        "time2": "vor 2 Sekunden",
        "time3": "vor 3 Sekunden",
        "time4": "vor 4 Sekunden"
    },
    "error500": {
        "title": "Fehler 500: Interner Serverfehler",
        "serverError": "Serverfehler",
        "description": "Auf unserer Seite ist etwas schiefgelaufen. Unser Team wurde benachrichtigt und arbeitet daran, das Problem zu beheben. Bitte versuchen Sie es in einigen Augenblicken erneut.",
        "goHome": "Zur Startseite",
        "tryAgain": "Erneut versuchen",
        "message1": "Eine Störung in der Macht ist auf unseren Servern aufgetreten.",
        "message2": "Unsere Techniker arbeiten daran, das Gleichgewicht wiederherzustellen.",
        "message3": "Bitte haben Sie Geduld, wir werden dies bald lösen.",
        "seen": "Gesehen",
        "delivered": "Zugestellt",
        "time1": "vor 1 Sekunde",
        "time2": "vor 2 Sekunden",
        "time3": "vor 3 Sekunden",
        "time4": "vor 4 Sekunden"
    },
    "vocab": {
        "title": "Vokabular",
        "description": "Das Vokabular bietet Definitionen und Erklärungen zu wichtigen Begriffen, die in AVefi verwendet werden. Es hilft den Nutzern, die Terminologie im Zusammenhang mit audiovisuellen Werken, Manifestationen, Exemplaren und mehr zu verstehen.",
        "term": "Begriff",
        "definition": "Definition",
        "enumSource": "Enum-Quelle",
        "category": "Kategorie",
        "search": "Vokabular durchsuchen",
        "noResults": "Kein passender Vokabularbegriff gefunden.",
        "all": "Alle",
        "filterByLetter": "Nach Buchstaben filtern {letter}",
        "untranslated": "nicht übersetzt",
        "moreInfo": "mehr erfahren",
        "preview": "Vorschau",
        "openInNewTab": "Im neuen Tab öffnen",
        "viewDocs": "Dokumentation",
        "loading": "Lade…",
        "previewHint": "Wähle einen Eintrag und klicke „Vorschau“."
    },
    "userGlossary": "Benutzer-Glossar",
    "ut": {
        "pageTitle": "Nutzer-erstellte Tooltips",
        "editingDisabled": "Bearbeiten ist deaktiviert. Setzen Sie CMS_ALLOW_USERTOOLTIP_EDITS=true, um es zu aktivieren.",
        "sectionTitle": "Modell-Tooltips (Nutzer-erstellt)",
        "lastSaved": "Zuletzt gespeichert",
        "searchPlaceholder": "Eigenschaften durchsuchen…",
        "loadingTree": "Modellbaum wird geladen…",
        "noTree": "Kein Modellbaum geladen.",
        "exportJSON": "JSON exportieren",
        "exportCSV": "CSV exportieren",
        "headsUp": "Achtung:",
        "staleRest": "Tooltip(s) verweisen auf Pfade, die im aktuellen Modellbaum nicht existieren.",
        "showList": "Liste anzeigen",
        "selectAll": "Alle auswählen",
        "deleteSelected": "Ausgewählte löschen",
        "deleteAll": "Alle löschen",
        "editTooltip": "Tooltip bearbeiten",
        "docs": "Doku",
        "deLabel": "Deutsch (de)",
        "dePlaceholder": "Tooltip-Text auf Deutsch",
        "enLabel": "Englisch (en)",
        "enPlaceholder": "Tooltip-Text auf Englisch",
        "save": "Speichern",
        "revert": "Zurücksetzen",
        "saved": "Gespeichert",
        "bulkEdit": "Sammelbearbeitung (Tabelle)",
        "thPath": "Pfad",
        "thDe": "Deutsch (de)",
        "thEn": "Englisch (en)",
        "thActions": "Aktionen",
        "noChildren": "Keine Unterknoten",
        "showInDetail": "In Detailansicht anzeigen",
        "showInSearch": "In Suchergebnissen anzeigen"
    },
    "openAndExtendable": {
        "title":"Offen und erweiterbar",
        "content": [
            "AVefi ist eine Plattform für interdisziplinäre filmbezogene Forschung, Filmkultur und Film-Archivarbeit. Sie basiert auf strukturierten Metadaten, Normdaten und persistenten Identifikatoren (PID). Heterogene audiovisuelle Bestände lassen sich damit eindeutig identifizieren und vergleichen. Das Datenschema orientiert sich an etablierten Fachstandards. Leitend sind Linked Open Data und FAIR-Prinzipien.",
            "Hintergrundinformationen finden Sie auf der Projektwebsite.",
            "https://projects.tib.eu/av-efi",
            "Weitere Datenquellen und Kooperationspartner sind sehr willkommen."
        ],
        "cta": "Zur Projektwebsite"
    },
    "tooltip": {
        "accessStatus": "Der Status gibt an, ob das Exemplar öffentlich zugänglich ist oder ob es Einschränkungen gibt.",
        "format": "Das Format bezeichnet beim analogen Film die Breite des Filmmaterials oder bei Video die Breite des Videobandes.",
        "elementType": "Hier wird angezeigt, um welche Materialart es sich beim analogen Film handelt. Bei digitalen Medien finden sich hier Angaben zum Dateiformat und/oder Container.",
        "manifestation": "Eine Manifestation ist die physische Verkörperung/Publikation eines audiovisuellen Werkes in der Form eines analogen oder digitalen Mediums.",
        "item": "Ein Exemplar ist die physische oder digitale Kopie einer Manifestation.",
        "webresource": "Dieser Link führt zur Detailansicht des Exemplars auf der Webseite des Datengebers.",
        "refinementsActive": "Aktive Facetten"
    },
    "filteredInside": "Facettierung aktiv",
    "manifShort": "Manif",
    "items": "Exemplare",            
    "srFacetChanged": "Ergebnisse innerhalb dieses Werks wurden gefiltert: {manFiltered} von {manTotal} Manifestationen, {items} Items.",
    "itemDetails": "Details zum Exemplar mit Handle {handle}",
    "lastedit": "Letzte Bearbeitung",
    "showHistory": "Verlauf anzeigen",
    'breadcrumb': 'Breadcrumb',
    "elementsincomparison": "Elemente in der Vergleichsliste",
    "elementsinshoppingcart": "Elemente in der Merkliste",
    "showcomparison": "Vergleich anzeigen",
    "gotocomp": "Zur Vergleichsansicht",
    "comp": "Vergleich",
    "export": "Export",
    "email": "E-Mail",
    "enterYourEmail": "Geben Sie Ihre E-Mail ein",
    "enterYourMessage": "Geben Sie Ihre Nachricht ein",
    "enterYourAnswer": "Geben Sie Ihre Antwort ein",
    "send": "Senden",
    "detailsFor": "Details zu {name}",
    "noManifestations": "Keine Manifestationen vorhanden",
    "manifestations": "Manifestationen",
    "webresource": "Web-Ressource",
    "item_element_type": "Materialart",
    "in_language_code": "Sprache",
    "has_colour": "Farbe",
    "productionyear": "Produktionsjahr",
    "country": "Land",
    "messageSentError": "Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.",
    "messageSentSuccess": "Nachricht erfolgreich gesendet.",
    'bannerSection': 'Ausgewählte Sammlungen und Highlights aus der Welt der Filmdaten',
    'featuredContent': 'AVefi präsentiert ausgewählte Sammlungen und wichtige Erkenntnisse aus dem Bereich der Film-Metadaten. Erkunden Sie eine Vielzahl von Datensätzen, von umfassenden Filmographien bis hin zu detaillierten technischen Spezifikationen, die eine eingehende Analyse und neue Einblicke in die filmische Landschaft ermöglichen. Die Plattform verbindet institutionelle Datenquellen mit normierten Identifikatoren, unterstützt historische Forschung ebenso wie kuratorische Praxis und schafft neue Zugänge zu Werken, Formaten und Archivbeständen.',
    'featuredContentAria': 'Ausgewählte Sammlungen und Highlights aus der Welt der Filmdaten',
    'coreFunctionsSection': 'Kernfunktionen',
    "openExternalReferences": "Externe Referenz öffnen",
    'lookWhatWeFound' : 'Gefunden in Ihrer Suche',
    'multihelptext': ({ named }: { named: (key: string) => string }) => `Es wurden mehrere Werke gefunden, die der Entität mit dem efi <strong>${named('name')}</strong> zugeordnet sind. Bitte beachten Sie, dass es sich hierbei um unterschiedliche Werke handelt, die auf verschiedene Weise mit dieser Entität verknüpft sein können. Um detailliertere Informationen zu einem bestimmten Werk anzuzeigen, wählen Sie bitte eines aus der Liste aus. Nach der Auswahl werden Ihnen unter anderem Produktionsangaben, Regie sowie weitere relevante Metadaten angezeigt.`,
    'metaDescription': 'AVefi ist eine Plattform für die Recherche und den Vergleich von Filmdaten. Sie bietet umfassende Metadaten zu Filmwerken, Manifestationen und Exemplaren aus verschiedenen Institutionen. Die Plattform ermöglicht eine effiziente Suche, den Vergleich von Datensätzen und die Nutzung von Persistent Identifiers (PIDs) für eine langfristige Identifikation von Filmen.',
    'searchForm': 'Suchformular',
    'searchInputAria': 'Suche nach Titel, Regisseur, Produktion, Schlagwort',
    'toggleNextSlide': 'Nächste Folie umschalten',
    'createYourOwn': {
        'title': 'Wonach suchen Sie?',
        'description': 'Senden Sie uns Ihre Suchanfrage als Vorschlag für die Galerie.'
    },
    "press": {
        "badgeLastUpdated": "Zuletzt aktualisiert {date}",
        "title": "Presse- & Medienpaket",
        "subtitle": "Offizielle AVefi-Logos, Screenshots und Basistexte.",
        "contactLabel": "Pressekontakt",
        "downloadAll": "Alles herunterladen (ZIP)",
        "viewManifest": "Manifest anzeigen",
        "boilerplateSection": "Presse-Bausteine",
        "boilerplateCopy": "Kopieren",
        "boilerplateCopied": "Kopiert",
        "usageSection": "Nutzungsrichtlinien",
        "brandSafety": "Markensicherheit",
        "downloadFile": "{label} herunterladen",
        "errorTitle": "Das Pressepaket kann derzeit nicht geladen werden.",
        "errorFallback": "Unbekannter Fehler",
        "metaTitle": "Presse- & Medienpaket – AVefi",
        "metaDescription": "Offizielle AVefi-Logos, Screenshots und Pressematerialien zum Download.",
        "boilerplateLabels": {
            "oneLiner": "One-liner",
            "short": "Kurzer Text",
            "long": "Ausführliche Beschreibung"
        },
        "assetTypes": {
            "logo": "Logo",
            "image": "Bild"
        },
        "manifest": {
            "boilerplate": {
                "oneLiner": "AVefi ist ein institutionsübergreifendes Verbundsystem zur eindeutigen Identifikation und Verknüpfung audiovisueller Bestände über persistente Filmidentifikatoren.",
                "short": "AVefi (Automatisiertes Verbundsystem für audiovisuelle Bestände über einheitliche Filmidentifikatoren) ist ein von der Deutschen Forschungsgemeinschaft gefördertes Projekt. Es entwickelt und erprobt ein webbasiertes System zur institutionsübergreifenden Identifikation und Verknüpfung von Filmen, ihren Manifestationen und Exemplaren. Zentral sind persistente Identifikatoren (PID), die eine eindeutige Referenzierung heterogener Bestände ermöglichen.",
                "long": "Im Projekt AVefi – Automatisiertes Verbundsystem für audiovisuelle Bestände über einheitliche Filmidentifikatoren – wird ein institutionsübergreifendes, webbasiertes System entwickelt und erprobt. Ziel ist die eindeutige Identifikation und Verknüpfung von Film-Werken, ihren Manifestationen und einzelnen Exemplaren aus unterschiedlichen institutionellen Beständen. Persistente Identifikatoren (PID) übernehmen dabei eine zentrale Rolle. Sie ermöglichen eine langfristige, stabile Referenzierung und machen Beziehungen zwischen Beständen verschiedener Einrichtungen nachvollziehbar. Das zugrunde liegende Datenmodell unterscheidet zwischen Werk, Manifestation und Item entsprechend dem FIAF Moving Image Cataloguing Manual. Metadaten werden strukturiert erfasst, formal validiert und über standardisierte Schnittstellen zugänglich gemacht. AVefi dient der wissenschaftlichen Nutzung, der strukturierten Filmrecherche und der nachhaltigen Verknüpfung audiovisueller Bestände. Das System ist offen für weitere Datenquellen und Kooperationen."
            },
            "usage": {
                "title": "Nutzungsrichtlinien",
                "items": [
                    "Verwenden Sie die bereitgestellten Logodateien, ohne Proportionen oder Farben zu verändern.",
                    "Lassen Sie ausreichend Freiraum um das AVefi-Wortzeichen, damit es gut lesbar bleibt.",
                    "Ergänzen Sie Screenshots und Fotos mit dem Hinweis \"AVefi\" sowie – falls zutreffend – dem ursprünglichen Quellarchiv.",
                    "Kontaktieren Sie das AVefi-Communication-Team, bevor Sie eigene Ableitungen der Marken erstellen."
                ]
            },
            "sections": {
                "logos": {
                    "title": "Logos",
                    "badge": "Logos",
                    "items": {
                        "logoLight": {
                            "title": "AVefi-Logo (hell)",
                            "notes": "Ideal für helle und neutrale Hintergründe."
                        },
                        "logoDark": {
                            "title": "AVefi-Logo (dunkel)",
                            "notes": "Für dunkle Hintergründe mit optimalem Kontrast."
                        }
                    }
                },
                "claims": {
                    "title": "Claim-Kombinationen",
                    "badge": "Claim-Kombinationen",
                    "items": {
                        "claimDe": {
                            "title": "Claim (DE)"
                        },
                        "claimEn": {
                            "title": "Claim (EN)"
                        }
                    }
                },
                "pressImages": {
                    "title": "Pressebilder",
                    "badge": "Pressebilder",
                    "items": {
                        "ogImage": {
                            "title": "AVefi Open-Graph-Motiv",
                            "notes": "Standard-Open-Graph-Motiv mit der AVefi-Oberfläche."
                        }
                    }
                }
            }
        }
    },
    'create.addImagePlaceholder': 'Bild-URL (optional)',
    'create.titlePlaceholder': 'Titel',
    'create.descriptionPlaceholder': 'Beschreibung',
    'create.linkPlaceholder': 'Link (optional)',
    'create.linkTextPlaceholder': 'Linktext (optional)',
    'create.createButton': 'Erstellen',
    'create.contactFormPrefill': 'Ich habe eine Karussell-Karte erstellt:\n\nTitel: {title}\nBeschreibung: {description}\nSuch-URL: {url}',
    'togglePreviousSlide': 'Vorherige Folie umschalten',
    'toggleComparisonDrawer': 'Vergleichsseite umschalten',
    'toggleFacetDrawer': 'Facetten umschalten',
    'videoSection': 'AVefi Video',
    'partnersSection': 'Partner',
    'activeFiltering': 'Aktive Filter',
    'activeFacets': 'Aktive Facetten',
    'item_duration_in_minutes': 'Dauer in Minuten',
    addtocomparisonparam: ({ named }: { named: (key: string) => string }) => `«${named('name')}» zum Vergleich hinzufügen`,
    addedtocomparisonparam: ({ named }: { named: (key: string) => string }) => `«${named('name')}» zum Vergleich hinzugefügt`,
    addtoshoppingcartparam: ({ named }: { named: (key: string) => string }) => `«${named('name')}» zu Favoriten hinzufügen`,
    addedtoshoppingcartparam: ({ named }: { named: (key: string) => string }) => `«${named('name')}» zu Favoriten hinzugefügt`,
    'alpha': 'Das System ist noch in der Entwicklungsphase. Bitte haben Sie Verständnis, dass noch nicht alle Funktionen verfügbar sind und einige Funktionen möglicherweise nicht wie erwartet funktionieren.',
    'apply': 'Anwenden',
    'reset': 'Zurücksetzen',
    'addNewLocation': 'Neuen Ort hinzufügen',
    'addNewProductionYear': 'Neues Produktionsjahr hinzufügen',
    'addNewDirector': 'Neue Regie hinzufügen',
    'addNewProducer': 'Neue Produktion hinzufügen',
    'addNewCastMember': 'Neues Besetzungsmitglied hinzufügen',
    'addNewGenre': 'Neues Genre hinzufügen',
    'addNewSubject': 'Neues Schlagwort hinzufügen',
    'addNewOtherId': 'Neue weitere ID hinzufügen',
    'avefiClaim': 'Filme finden. Daten verbinden.',
    'avefiClaimHtml': 'Filme finden. Daten verbinden.',
    'avefi_Item': 'Exemplar',
    'avefi_Manifestation': 'Manifestation',
    'avefi_WorkVariant': 'Werk',
    'avefi:PublicationEvent': 'Publikationsevent',
    'avefi:Note': 'Notiz',
    'workNavigation': 'Werk-Navigation',
    'toggleNavigation': 'Navigation umschalten',
    'backtosearch': 'Zurück zur Suche',
    "nofacetsselected": "Keine Facetten ausgewählt",
    'preferences': 'Einstellungen',
    'castmembers': 'Besetzung',
    'category': 'Kategorie',
    'category_clean': 'Kategorie',
    'showFacetItems': 'Facetten anzeigen',
    'clear': 'Eingabe löschen',
    'submitQuery': 'Abfrage absenden',
    'clearQuery': 'Abfrage löschen',
    'clearallfilters': 'Alle Filter entfernen',
    'collapseAll': 'Alle einklappen',
    'collapsePanel': 'Panel einklappen',
    'togglePanel': 'Panel umschalten',
    'toggleExpandAllHandles': 'Alle Handles umschalten',
    'toggleViewType': 'Ansichtstyp umschalten',
    'toggleProductionDetails': 'Produktionsdetails umschalten',
    'toggleDetails': 'Details umschalten',
    'fieldsFilled': 'Felder ausgefüllt',
    'maximumProductionYear': 'Maximales Produktionsjahr',
    'minimumProductionYear': 'Minimales Produktionsjahr',
    'page': 'Seite',
    'showDetails': 'Details anzeigen',
    'hideDetails': 'Details ausblenden',
    'showManifestItems': 'Manifest. & Exemplare anzeigen',
    'total': 'Gesamt',
    'toggleManifestation': ({ named }: { named: (key: string) => string }) => `Klicken Sie auf die Manifestation, um Details zu ${named('manifestationId')} anzuzeigen`,
    'nextPage': 'Nächste Seite',
    'prevPage': 'Vorherige Seite',
    'searchInFacet': ({ named }: { named: (key: string) => string }) => `In ${named('facetName')} suchen`,
    'refineBy': ({ named }: { named: (key: string) => string }) => `Nach ${named('label')} verfeinern`,
    'copiedToClipboard': 'in die Zwischenablage kopiert',
    'linkCopied': 'Link in die Zwischenablage kopiert',
    'copyLinkPrompt': 'Diesen Link kopieren',
    'shareSearch': 'Suche teilen',
    'suggestSearchToAVefi': 'Suche/Anfrage mit dem AVefi-Team teilen',
    'share': {
        'shareTemplate': 'Ich möchte diese Suche teilen:\n\nSuchanfrage: {query}\nURL: {url}',
        'suggestTemplate': 'Ich möchte diese Suche/Anfrage an AVefi vorschlagen:\n\nSuchanfrage: {query}\nURL: {url}'
    },
    'clearalllist': 'Liste leeren',
    'notLoggedIn' : 'Sie sind nicht eingeloggt',
    "emailHelpText": "Bitte geben Sie Ihre E-Mail-Adresse ein.",
    "messageHelpText": "Bitte geben Sie hier Ihre Nachricht ein.",
    "captchaHelpText": "Bitte lösen Sie die Captcha-Frage, um zu bestätigen, dass Sie ein Mensch sind.",
    "captchaQuestion": "Was ist ",
    "footer": "Fußzeile",
    "works": "Werke",
    "work": "Werk",
    "hideVideo": "Video ausblenden",
    "showVideo": "Video anzeigen",
    "openMenu": "Menü öffnen",
    "settingsMenu": "Einstellungsmenü",
    "mainMenu": "Main Menu",
    "moreOptions": "Mehr Optionen",
    "footerPreferences": "Einstellungen",
    "footerInfo": "Informationen",
    "footerSponsoring": "Sponsoring",
    "license": "Lizenz",
    "footerLicenseData": "Daten lizenziert unter Creative Commons Public Domain Dedication (CC0 1.0).",
    "footerLicenseContent": "Inhalte lizenziert unter Creative Commons Attribution 4.0 International (CC BY 4.0).",
    "userMenu": "Benutzermenü",
    'close': 'Schließen',
    'located_in_has_name': 'Ort',
    'closeDrawer': 'Schließen',
    "place": "Ort",
    'openDrawer': 'Öffnen',
    'cookiesModalDescription': 'Hier können Sie Ihre Cookie-Einstellungen anpassen. Sie haben die Möglichkeit, bestimmte Cookies zu aktivieren oder zu deaktivieren, die für die Funktionalität und Verbesserung unserer Website verwendet werden. Bitte beachten Sie, dass das Deaktivieren einiger Cookies die Nutzung der Website beeinträchtigen kann.',
    'comparison': 'Vergleich',
    'loadingCookies': 'Cookie-Einstellungen werden geladen…',
    'comparisonalready': 'Das Element befindet sich bereits im Vergleich',
    'comparisonfull': 'Der Vergleich darf maximal zwei Elemente beinhalten. Um ein neues Element hinzufügen, bitte eines aus der Liste entfernen.',
    'comparisonComponent': 'Die Vergleichskomponente ermöglicht es Nutzern, bis zu zwei Datensätze gleichzeitig auszuwählen und in einer Vergleichsansicht gegenüberzustellen. Datensätze können hinzugefügt oder entfernt und das Ergebnis als CSV-, XML- oder JSON-Datei exportiert werden.',
    'favouritesComponent': 'Die Favoritenliste erlaubt es Nutzern, mehr als zwei Datensätze langfristig zu speichern. Nach der Registrierung können Nutzer ihre Liste verwalten, Einträge hinzufügen oder entfernen. Die gespeicherten Datensätze lassen sich zudem als CSV-, XML- oder JSON-Dateien exportieren.',
    'contact.about.0': 'AVefi steht für „Automatisiertes Verbundsystem für audiovisuelle Bestände über einheitliche Filmidentifikatoren“. Es wird seit November 2023 im Rahmen eines von der Deutschen Forschungsgemeinschaft geförderten, infrastrukturellen Kooperationssojekts entwickelt. In AVefi werden filmische Metadaten verschiedener Institutionen zusammengeführt, recherchierbar und nachnutzbar gemacht. Das Verbundsystem einschließlich dieser Recherche- und Redaktionsoberfläche ergänzt das bestehende “Ökosystem” filmischer Identifikatoren und (Norm-)Daten (z.B. Filmportal, EIDR, GND, NFDI4Culture) und fügt sich als originäres Angebot mit starkem Bestandsbezug ein. AVefi dient dem dauerhaften Nachweis sowie der Verknüpfung von audiovisuellen Beständen jeglicher Herkunft, Gattungen und Filmgenres in Berücksichtigung der Prinzipien von Linked Open Data und FAIR.', 
    'contact.about.1': 'Neben Spielfilmen sind auch Unterrichts-, Lehr und Wissenschaftsfilme sowie auf ephemeres Filmmaterial oder Amateurfilme recherchierbar und stehen erstmals aggregiert der Forschung zur Verfügung. Die Filme der datengebenden Institutionen werden soweit möglich automatisiert identifiziert, abgeglichen und - wenn erforderlich - zusammengeführt. Eine zentrale Rolle spielen dabei Persistent Identifier (PID). Mit deren Hilfe können Filmwerke und ihre Versionen automatisch und eindeutig miteinander in Bezug gesetzt werden. Filmbestandteile, die in verschiedenen Archiven lagern, können so künftig leichter gefunden und zum Beispiel zu Restaurierungszwecken verknüpft und zur Beantwortung filmgetriebener Forschungsfragen genutzt werden.', 
    'contact.about.2':'Das speziell entwickelte AVefi-Schema folgt dem FIAF-Regelwerk (https://www.fiafnet.org/pages/E-Resources/FIAF-Handbuch-Katalogisierung.html). Der Nachweis erfolgt dabei in den drei Ebenen Werk/Variante, Manifestation sowie Exemplar (Item)',
    'contact.about.heading': 'Über AVefi',
    'copyEFI': ({ named }: { named: (key: string) => string }) => `${named('category')} efi kopieren`,
    'countdownworkshop': 'Countdown bis zum Workshop Anforderungsdokumentation:',
    'countries': 'Produktionsorte',
    'dashboard': 'Dashboard',
    'dataset1': 'Datensatz 1',
    'dataset2': 'Datensatz 2',
    'dataprovider': 'Datengeber',
    'dataholding': 'Datenhaltende Institution',
    'detailview': 'Detailansicht',
    'directors': 'Regie',
    'directors_or_editors': 'Filmschaffende',
    'disambiguation': 'Disambiguierung',
    'emptyItem': 'Ohne Metadaten',
    'emptyItemTooltip': 'Dieses Exemplar hat keine zusätzlichen Metadaten',
    'emptyManifestation': 'Leer',
    'emptyManifestationTooltip': 'Diese Manifestation hat keine zusätzlichen Metadaten',
    'enterSearchTermFirst': 'Bitte zuerst einen Suchbegriff eingeben',
    'emptyItemsShort': 'Exemplare ohne Metadaten',
    'emptyItemsLong': 'Exemplare der Manifestation beinhalten keine weiterführenden Informationen',
    'allItemsEmpty': 'Exemplare ohne Metadaten',
    'allItemsEmptyTooltip': 'Kein Exemplar in diesem Werk hat zusätzliche Metadaten',
    'enterobjectname': 'Objektname eingeben',
    'exportdata': 'Daten exportieren',
    'exportAsCSV': 'Export als CSV',
    'exportAsJSON': 'Export als JSON',
    'exportAsXLSX': 'Export als XLSX',
    'exportAsXML': 'Export als XML',
    'Episode/Part': 'Folge/Teil',
    'expandAll': 'Alle ausklappen',
    'expand': 'Ausklappen',
    'viewType': 'Ansicht',
    'tableView': 'Tabelle',
    'facettype': 'Typ',
    'facetyear': 'Jahr',
    'facetyearonoff': 'Nur mit Jahresangabe zeigen',
    'favourites': 'Favoriten',
    'filmidentification': 'Filmdatenredaktion',
    'filmportalref': 'Referenz bei filmportal.de',
    'filmresearch': 'Suche',
    'copyToClipboard': 'In Zwischenablage kopieren',
    'castMember': 'Darsteller*in',
    'CastMember': 'Darsteller*in',
    'crewMember': 'Mitwirkende Person',
    'crewMemberType': 'Art der Mitwirkung',
    'agentsList': 'Agentenliste',
    'agent': 'Agent',
    'sameAs': 'Gleich wie',
    'filter': 'Filtern',
    "has_event": "Ereignis",
    'gotodisamiguationparam': () => `Zu Disambiguierung`,
    'gotoshoppingcart': 'Zu Favoriten',
    'grid': 'Tabelle',
    'goToMerge': 'Zur Zusammenführung',
    "has_note": "Notiz",
    "noResults": "Keine Ergebnisse gefunden",
    "recent": "Kürzlich verwendet",
    'accordionView': 'Hierarchisch',
    'flatView': 'Flach',
    'prodYearOnlyProductionYear': 'Nur Datensätze mit Produktionsjahr',
    'prodYearOnlyProductionYearExtended': 'Nur Datensätze anzeigen, die Information zu Produktionsjahr besitzen',
    'info': 'Info',
    'copyValueToTargetModelPropertyName': ({ named }: { named: (key: string) => string }) => `Übertrage Wert von ${named('name')} in das Ergebnis`,
    "moreOptionsFor": "Mehr Optionen für",
    'mergeResultHelpText': 'Führen Sie zwei ähnliche Datensätze zu einem gemeinsamen Ergebnis zusammen. Für jede Eigenschaft im Ergebnisdatensatz gibt es ein Eingabefeld für den Wert sowie ein optionales Feld für Normdaten oder externe IDs. Verwenden Sie das "Format ID (Typ)". Mehrere Einträge können durch Kommas getrennt werden: "ID (Typ), ID (Typ), …"',
    "listOfTerms": "Liste der Begriffe",
    'isPartOf': 'Ist Teil von',
    'has_date': 'Produktionsjahr',
    'duration': 'Dauer',
    "avefi:PreservationEvent": "Erhaltungsereignis",
    "avefi:WorkVariantPart": "Werk-Teil",
    'subject': 'Schlagwort',
    'hello': 'Hallo',
    'help': 'Hilfe',
    'faq': 'FAQ',
    'helpAndGlossary': 'Hilfe & Glossar',
    'howToDoc': 'AVefi How-to Dokument: https://projects.tib.eu/fileadmin/data/av-efi/docs/2025-02_AVefi-how-to-vv1.pdf',
    'manual': 'AVefi Manual: https://projects.tib.eu/fileadmin/data/av-efi/docs/2025-01_AVefi-Manual_vv2.pdf',
    'hours': 'Stunden',
    'item': 'Exemplar',
    'closeForm': 'Formular schließen',
    'clickToExpandManifestation': 'Klicken Sie auf die Manifestation, um Details anzuzeigen',
    'openForm': 'Formular öffnen',
    'viewAllItems': 'Alle Exemplare anzeigen',
    'manifestation_event_type': 'Manifestationstyp',
    'captchaText': ({ named }: { named: (key: string) => string }) => `Was ist ${named('name')}?`,
    'enterYourName': 'Geben Sie Ihren Namen ein',
    'enterYourCaptcha': 'Geben Sie den Captcha-Code ein',
    'contact.keywords': 'Welche Schlagworte werden genutzt?',
    'contact.keywordsContent': 'Nachgewiesen sind alle Schlagworte, die die datengebende Institution vergeben hat.',
    'contact.normdata': 'Werden Normdaten verwendet?',
    'contact.normdataContent': 'Von der datengebenden Institution verwendete Normdaten - wie z.B. der Gemeinsamen Normdatei (GND, https://gnd.network/Webs/gnd/DE/UeberGND/ueberGND_node.html) - werden übernommen und entsprechend angezeigt.',
    'contact.pids': 'Wieso werden PIDs vergeben?',
    'contact.pidsContent.0': 'Die Handle-PIDs dienen der Identifikation und Verknüpfung von Film-Metadaten.',
    'contact.pidsContent.1': 'Die zentral in der PID-Infrastruktur gesicherten, offenen Metadaten machen Filmdaten besser auffindbar und in weitere (Forschungs-)Prozesse integrierbar bzw. nachnutzbar. Darüber hinaus helfen PIDs Metadaten miteinander in Bezug setzen.',
    'matchedField': 'Übereinstimmendes Feld',
    'pleaseusemanifestationlink': 'Bitte benutzen Sie den Link zur Manifestation oder Werk',
    'producers': 'Produktion',
    'production': 'Produktion',
    'productioncompany': 'Produktionsfirma',
    'productionyears': 'Produktionsjahr',
    'productionDetailsOn': 'Produktionsdetails anzeigen',
    'productionDetailsOff': 'Produktionsdetails ausblenden',
    'productionDetailsOnShort': 'Vollst. Ansicht',
    'productionDetailsOffShort': 'Kompaktansicht',
    'profile': 'Profil',
    'remove': 'entfernen',
    'result': 'Ergebnis',
    'results': 'Ergebnisse',
    'resultsUsage': 'Wie können Suchergebnisse genutzt werden?',
    'resultsUsageContent': 'Suchergebnisse können als Tabelle oder CSV-Datei exportiert werden. Weitere Nachnutzungsmöglichkeiten, wie JSON-Formate, werden noch geprüft.',
    'scrollToTop': 'Zum Seitenanfang',
    'search': 'Suchen',
    'searchhereactors': 'Suche Schauspieler',
    'searchheredirectors': 'Suche Regie',
    'searchplaceholder': 'Suche nach Titel, Regie, Produktion, Schlagwort',
    'seconds': 'Sekunden',
    'showLess': 'Weniger anzeigen',
    'showMore': 'Mehr anzeigen',
    'showchildren': 'Kind-Elemente anzeigen',
    'showshoppingcart': 'Favoriten zeigen',
    'showFacetsFor': ({ named }: { named: (key: string) => string }) => `Facetten für ${named('headerText')} auf Ebene ${named('category')} zeigen`,
    'shoppingcart': 'Favoriten',
    'shoppingcartalready': 'Das Element befindet sich bereits in der Favoriten',
    'shoppingcartfull': 'Die Favoriten darf maximal zehn Elemente beinhalten. Um ein neues Element hinzufügen, bitte eines aus der Liste entfernen.',
    'message': 'Nachricht',
    'slogan': 'Finden, entdecken und vergleichen Sie umfassende Daten zu Filmbeständen aller Genres',
    'sorting': 'Sortierung (nicht aktiv)',
    'sponsoring': 'Förderung',
    'subjects': 'Schlagwörter',
    "searchpanel": "Suchbereich",
    "searchcontent": "Suchinhalt",
    "searchresults": "Suchergebnisse",
    "searchbox": "Suchfeld",
    "Search": "Suche",
    "resetQuery": "Suche zurücksetzen",
    "recentSearches": "Letzte Suchanfragen",            
    "clearSearchHistory": "Suchverlauf löschen",
    "clearAll": "Alle löschen",
    "removeFromHistory": "Aus Verlauf entfernen",
    "showEntireCollection": "Alles anzeigen",
    "filteringsection": "Filterbereich",
    'temporarytestdata': 'Temporär bis Testdaten vorhanden',
    'theme': 'Ansicht',
    'tryClearingFiltersOrQuery': 'Versuchen Sie, die Filter oder die Suchanfrage anzupassen',
    'todolinks': 'TODO: Links und Rechtliches im Footer hinzufügen',
    'twinManifestationShort': 'Zwilling',
    'twinManifestationLong': 'Zwillinge sind Manifestationen, die sich inhaltlich und formal sehr ähnlich sind.',
    'usage': 'Nutzung und Verfügbarkeit',
    'welcome': 'Willkommen',
    'welcomeheading': 'Willkommen bei AVefi',
    'contact.workContent.0':'Das Datenmodell ist darauf ausgelegt, Sammlungsbestandsdaten eindeutig einer haltenden Institution zuzuordnen und gleichzeitig Beziehungen zwischen den Beständen unterschiedlicher Institutionen darzustellen. Dazu werden PIDs für verschiedene Klassen von Objekten mit jeweils eigenen Anforderungen erzeugt, die sogenannten "efi". So wird unterschieden zwischen (Film)werken, Manifestationen und Exemplaren (Items) im Sinne des Regelwerks der FIAF.',
    'contact.workContent.1':'Werk/Variante',
    'contact.workContent.2':'Werk ist eine Entität, die den geistigen oder künstlerischen Inhalt und den Prozess der Realisierung in einem kinematografischen Medium umfasst, z.B. wie der Film heißt, wann er gedreht wurde, wer ihn gedreht hat, wer darin zu sehen war, worum es geht usw. Diese Kerninformationen ändern sich in der Regel in keiner Manifestation.',
    'contact.workContent.3':'Manifestation',
    'contact.workContent.4':'Ist die Verkörperung eines Filmwerks bzw. einer Variante. Manifestationen umfassen alle analogen, digitalen und Online-Medien. Informationen der Ebene Manifestation können eine Beschreibung dessen enthalten, was die jeweilige Manifestation idealerweise enthalten sollte, unabhängig von den im Archiv vorhandenen Elementen. Ein Beispiel: Die ursprüngliche Originallänge eines Films beträgt 1:30:00, aber in dem im Archiv vorhandenen Exemplar fehlt Filmmaterial, sodass es kürzer ist.',
    'contact.workContent.5':'Exemplar/Item',
    'contact.workContent.6':'Ist das physische Produkt einer Manifestation eines Werks bzw. einer Variante, d.h. die physische Kopie eines Werks oder einer Variante. Ein Exemplar kann aus einer oder mehreren Komponenten bestehen, d.h. das gesamte Exemplar kann aus einer Rolle oder fünf Spulen, zwei VHS-Kassetten oder einer DVD bestehen. Ein Exemplar-Datensatz kann bei Bedarf Felder oder Bereiche für separate Barcodes und Zustandsinformationen für jede Komponente des Exemplars (z.B. jede Spule) enthalten. Das Exemplar kann vollständig, unvollständig oder ein Fragment sein. Bei rein digitalen Medien ist ein Exemplar definiert als die Verfügbarkeit der Datei, unabhängig von der Anzahl der eventuell vorhandenen Sicherungskopien.',
    'workvariants': 'Werke',
    'year': 'Jahr',
    'years': 'Jahr',
    'updateallproperties': 'Alle Felder übertragen',
    'resetFormData': 'Formulardaten zurücksetzen',
    'contact.availableMetadata': 'Welche Film-Metadaten finde ich hier?',
    'contact.availableMetadataContent': 'Es sind Film-Metadaten sämtlicher Filmgattungen und Genres mit aktuell besonderem Blick auf Unterrichts-, Lehr und Wissenschaftsfilme sowie auf ephemeres Filmmaterial oder Amateurfilme recherchierbar.',
    'contact.definitions': 'Was ist der Unterschied zwischen Werk, Manifestation und Exemplar?',
    'contact.dataProviders': 'Hilfe für Datengeber',
    'contact.dataProvidersContent': 'Werden Sie als Datengeber Teil von AVefi. Informationen zu den notwendigen Schritten finden Sie im Folgenden.',
    'contact.availability': 'Kann ich über die Plattform Filme anschauen bzw. ausleihen?',
    'contact.availabilityContent': 'AVefi ist eine reine Nachweisplattform. Zu finden sind hier die Metadaten zu den Filmwerken und wo deren Manifestationen und Exemplare zu finden sind.',
    'bannerText': 'Ausgewählte Kollektionen und Highlights aus der Welt der Film-Metadaten',
    'bannerDescription': 'AVefi präsentiert ausgewählte Sammlungen und wichtige Erkenntnisse aus dem Bereich der Film-Metadaten. Erkunden Sie eine Vielzahl von Datensätzen, von umfassenden Filmographien bis hin zu detaillierten technischen Spezifikationen, die eine eingehende Analyse und neue Einblicke in die filmische Landschaft ermöglichen. Die Plattform verbindet institutionelle Datenquellen mit normierten Identifikatoren, unterstützt historische Forschung ebenso wie kuratorische Praxis und schafft neue Zugänge zu Werken, Formaten und Archivbeständen.',
    'coreFunctionsTitle': 'Kernfunktionen',
    'coreFunctions': [
        'Detaillierte Metadaten nach FIAF-Standard.',
        'Persistente IDs (PIDs) für langfristige Identifizierung.',
        'Erfüllung der FAIR-Prinzipien für optimale Datennutzung.',
        'Einfache Suche über verschiedene Institutionen.',
        'Zentrale, regelmäßig aktualisierte Datenbank.'
    ],
    'learnMore': 'Mehr erfahren',
    'forFilmResearchersTitle': 'Für Filmwissenschaftler*innen',
    'forFilmResearchers': [
        'Zeitersparnis durch effiziente Suche.',
        'Neue Erkenntnisse durch unerschlossene Bestände.',
        'Reproduzierbare Forschung dank PIDs.',
        'Bessere Zusammenarbeit zwischen Forschenden.'
    ],
    'technicalBasicsTitle': 'Technische Grundlagen',
    'technicalBasics': [
        'Solide technische Grundlage: Basiert auf dem Handle-System und gewährleistet die langfristige Identifizierung von Daten.',
        'Flexible Integration: Ermöglicht die einfache Einbindung in bestehende Systeme und Workflows.',
        'Hohe Datenqualität: Durch die Verwendung einer Type-Registry und Datenmodell.'
    ],
    'licensingInfo': {
        'title': 'Lizenzinformationen',
        'content': [
            'Die auf dieser Website veröffentlichten Datensätze, Metadaten und begleitenden Informationen stehen – sofern nicht anders gekennzeichnet – unter der Lizenz Creative Commons Attribution (CC BY).',
            'Diese Lizenz ermöglicht eine freie Nutzung, Weiterverbreitung und Bearbeitung der Inhalte, auch im kommerziellen Kontext, bei angemessener Namensnennung.',
            'Mit der Bereitstellung unter CC BY bekennt sich dieses Projekt zu Offenheit, Transparenz und nachhaltiger Wissenszirkulation im digitalen Raum. Die Daten sind darauf ausgelegt, langfristig zugänglich und anschlussfähig für Forschung, Vermittlung und weitere Kontexte zu sein.'
        ]
    },
    'videoTitle': 'AVefi',
    'videoDescription': 'Finden, entdecken und vergleichen Sie umfassende Daten zu Filmbeständen aller Genres. Recherchierbar sind sowohl Filmwerke als auch die Versionen verschiedenster teilnehmender Filmarchive und -sammlungen.',
    'videoSectionTitle': 'Finden, entdecken und vergleichen Sie umfassende Daten zu Filmbeständen aller Genres.',
    'videoSectionDescription': 'Durchsuchbar sind sowohl Filmwerke als auch die jeweiligen Manifestationen und Exemplare der beteiligten Filmarchive und Sammlungen, einschließlich ihrer Beziehungen, Identifikatoren und ausgewählter Metadaten, was eine differenzierte Recherche und den Vergleich über Institutionsgrenzen hinweg ermöglicht.',
    'videoNotSupported': 'Ihr Browser unterstützt das Video-Tag nicht.',
    'partnersTitle': 'Teamwork ',
    'partnersDescription': 'AVefi ist ein Infrastrukturprojekt im Verbund. Die Verbundpartner arbeiten mit beratender Expertise und konkreter Beteiligung von Praxispartnern zusammen, darunter Archive, Museen und wissenschaftliche Einrichtungen aus dem Bereich Filmkultur und -forschung.',
    'trollerTitle': 'Georg Stefan Troller',
    'trollerDescription': 'Georg Stefan Troller (1921-2025) war ein österreichisch-französischer Filmemacher und Journalist. In seinen Dokumentarfilmen verband er persönliche Geschichten mit sozialen Themen und schuf eindringliche Porträts.',
    'trollerLinkText': 'G.S. Troller bei AVefi',
    'ddrTitle': 'Filmgeschichte der DDR',
    'ddrDescription': 'Diese Sammlung ist eine wertvolle Ressource zur Filmgeschichte der DDR. Umfangreiche Metadaten ermöglichen anspruchsvolle Forschung und fördern neue wissenschaftliche Erkenntnisse zu Kultur und Gesellschaft der DDR.',
    'ddrLinkText': 'Unsere Sammlung an DDR-Filmen',
    'schlenkerTitle': 'Hermann Schlenker',
    'schlenkerDescription': "Hermann Schlenkers ethnografische Arbeiten aus der zweiten Hälfte des 20. Jahrhunderts sind ein wertvolles Zeitzeugnis von Kulturen, die sich im Wandel befinden oder bereits verschwunden sind.",
    'schlenkerLinkText': 'Hermann Schlenker bei AVefi',
    'imageSource': 'Bildquelle',
    'author': 'Urheber',
    'has_genre_has_name': 'Genre',
    'has_issuer_name': 'Datenhaltende Institution',
    'has_language': 'Sprache',
    'has_duration_has_value': 'Länge',
    'has_format_type': 'Materialformat',
    'tryAdjustingFacets': 'Versuchen Sie, die Facetten anzupassen',
    'workVariantIsPartOf': ({ named }: { named: (key: string) => string }) => `Werke, die Teile des Werks mit efi <strong>${named('name')}</strong> sind`,
    "loading": "Lädt ...",
    "divider": "Trenner",
    'unknownLanguage': 'Unbekannte Sprache',
    "filterItemsAndManifestations": "Exemplare und Manifestationen filtern",
    "facetsInsideSearchResults": "Facetten für Exemplar und Manifestation befinden sich in diesem Modus innerhalb der Suchergebnisse",
    "viewTypeCheckedWarning": "Das Umschalten des Ansichtstyps setzt alle aktiven Facetten zurück.",
    "itemLevel": "Exemplar-Details",
    "manifestationLevel": "Manifestations-Details",
    "fromManifestation": "Aus Manifestation",
    "searchItems": "Exemplare filtern",
    "login": "Anmelden",
    "Login": "Anmelden",
    "mainSearch": "Hauptsuche",
    "submitSearch": "Suche absenden",
    "tooltip.refinementsActive": "Aktive Facetten",
    "contact.about.2.beforeLink": "Das speziell entwickelte AVefi-Schema folgt dem ",
    "contact.about.2.afterLink": ". Der Nachweis erfolgt dabei in den drei Ebenen Werk/Variante, Manifestation sowie Exemplar (Item)",
    "contact.normdataContent.beforeLink": "Von der datengebenden Institution verwendete Normdaten – wie z.B. der ",
    "contact.normdataContent.afterLink": " – werden übernommen und entsprechend angezeigt.",
    "seo": {
        "home": {
            "siteName": "AVefi – Infrastruktur für audiovisuelle Forschung",
            "title": "AVefi – Filmdaten-Recherche über Archive hinweg",
            "ogTitle": "AVefi – Filmwerke und Materialien archivübergreifend finden",
            "description": "AVefi ermöglicht die Recherche von Werken, Manifestationen und Exemplaren in mehreren deutschen Filmarchiven – mit Normdaten-Verknüpfungen, Persistent Identifiers und Exportfunktionen für Forschung und Praxis.",
            "ogDescription": "Entdecken Sie Filmwerke über Archive hinweg. AVefi verknüpft Metadaten, Normdaten und Persistent Identifiers, damit Sie Filmbestände gezielt durchsuchen, verfeinern und exportieren können."
        },
        "search": {
            "title": "Recherche – AVefi",
            "titleWithQuery": "{query} – Suchergebnisse",
            "description": "Durchsuchen Sie Filmwerke, Manifestationen und audiovisuelle Materialien aus deutschen Archiven.",
            "descriptionWithQuery": "Suchergebnisse zu \"{query}\". Entdecken Sie Werke und audiovisuelle Materialien in deutschen Filmarchiven."
        },
        "contact": {
            "title": "Kontakt – AVefi",
            "description": "FAQ und Glossar zum AVefi-Projekt",
            "ogTitle": "Kontakt – AVefi",
            "ogDescription": "FAQ und Glossar zum AVefi-Projekt"
        },
        "imprint": {
            "title": "Impressum – AVefi",
            "description": "Rechtliche Informationen zum AVefi-Projekt",
            "ogTitle": "Impressum – AVefi",
            "ogDescription": "Rechtliche Informationen zum AVefi-Projekt"
        },
        "resource": {
            "title": "{title} – AVefi",
            "description": "Audiovisuelles Werk aus deutschen Filmarchiven."
        },
        "vocab": {
            "title": "Vokabularbrowser – AVefi",
            "titleWithField": "Vokabular: {field} | AVefi",
            "titleWithFieldAndFilter": "Vokabular: {field} – \"{filter}\" | AVefi",
            "description": "Der Vokabularbrowser von AVefi zeigt genutzte Normdaten-Felder wie Genre oder Schlagwörter über teilnehmende Filmarchive hinweg.",
            "descriptionWithField": "Vokabularansicht für das Feld \"{field}\". Erkunden Sie genutzte Normdaten und deren Nutzung in den Beständen der AVefi-Partnerarchive.",
            "descriptionWithFieldAndFilter": "Vokabularansicht für das Feld \"{field}\" mit Einträgen passend zu \"{filter}\". Erkunden Sie genutzte Normdaten über teilnehmende Filmarchive hinweg."
        },
        "compare": {
            "title": "Datensätze vergleichen – AVefi",
            "titleWithItems": "Vergleich {prev} vs {next} – AVefi",
            "description": "Vergleichen Sie zwei Datensätze audiovisueller Werke nebeneinander mit Unterschiedshervorhebung.",
            "descriptionWithItems": "Seitenvergleich zweier Filmwerk-Datensätze mit synchronisierten Ansichten und Unterschiedshervorhebung für Forschung und Analyse."
        },
        "glossary": {
            "title": "Glossar – AVefi",
            "description": "Das Glossar bietet Definitionen und Erklärungen zu wichtigen Begriffen, die in AVefi verwendet werden. Es hilft den Nutzern, die Terminologie im Zusammenhang mit audiovisuellen Werken, Manifestationen, Exemplaren und mehr zu verstehen.",
            "ogTitle": "Glossar | AVefi",
            "ogDescription": "Entdecken Sie das AVefi-Glossar für Definitionen und Erklärungen aller wichtigen Begriffe, die auf der Plattform verwendet werden."
        },
        "faq": {
            "title": "FAQ – AVefi",
            "description": "Frequently asked questions about AVefi, the platform for film metadata and research.",
            "ogTitle": "FAQ | AVefi",
            "ogDescription": "Find answers to common questions about AVefi, its features, and how to use the platform."
        },
        "normdata": {
            "titleWithFieldAndFilter": "{field} — {filter} | AVefi",
            "titleWithField": "{field} | AVefi",
            "title": "Normdaten | AVefi",
            "descriptionWithFieldAndFilter": "Durchsuchen Sie Normdaten für {field}, die \"{filter}\" entsprechen.",
            "descriptionWithField": "Durchsuchen Sie Normdaten für {field}.",
            "description": "Durchsuchen Sie kontrolliertes Vokabular und Normdaten."
        }
    },
    "normdata": {
        "pageTitle": "Normdaten",
        "pageDescription": "Durchsuchen Sie kontrolliertes Vokabular und die zugehörigen Normdatenverweise.",
        "field": "Feld",
        "filter": "Filter",
        "filterPlaceholder": "Suchen...",
        "onlyWithNormdata": "Nur Einträge mit Normdaten anzeigen",
        "perPage": "Pro Seite",
        "export": "Exportieren",
        "currentPageCSV": "Aktuelle Seite (CSV)",
        "currentPageJSON": "Aktuelle Seite (JSON)",
        "currentPageXML": "Aktuelle Seite (XML)",
        "fullExportTitle": "Vollständiger Export",
        "allFilteredResults": "Alle gefilterten Ergebnisse",
        "completeDataset": "Vollständiger Datensatz",
        "limitedResultsInfo": "Es werden nur die ersten 1000 Ergebnisse von {total} insgesamt angezeigt. Manche Einträge könnten fehlen.",
        "filterByLetter": "Nach Buchstabe filtern"
    },
    "skipToContent": "Zum Inhalt springen",
};

// IMPORTANT: merge in avefiLocales.de (choose order intentionally)
export default {
    ...deBase, 
    ...avefiDe
};
