import locales from '~/models/interfaces/schema/locale_messages.json';
const avefiDe = (locales as any).de ?? (locales as any).default?.de ?? {};

const deBase = {
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
  "facets": "Facetten",
  'home': {
    'breadcrumbs': 'Home',
    'welcome': 'Filmmetadaten aller Genres und Typen sind verfügbar, mit einem besonderen Fokus auf Bildungs-, Lehr- und Wissenschaftsfilme sowie Amateur- und Heimatfilme.',
    'accessibility': {
      'skipToContent': 'Zum Inhalt springen'
    },
    'hero': {
      'bannerSection': 'Ausgewählte Sammlungen und Highlights aus der Welt der Filmdaten',
      'tagline': 'AVefi verknüpft Bestandsdaten verschiedener Institutionen zu einem Filmwerk und macht sie dauerhaft eindeutig auffindbar für Recherche und Forschung.',
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
          "AVefi zeigt die Vielfalt der Filmkultur in einer Filmdatenbank. Das Spektrum reicht vom frühen Film über Gebrauchs- und Dokumentar- bis zu Amateurfilmen. Nutzen Sie unsere Beispiele als Einstieg in die Suche nach Titeln, Themen, Orten und Personen.",
          "Die Plattform bündelt filmbezogene Metadaten und unterscheidet dabei zwischen Filmwerk, Manifestation und Exemplar. Dadurch lassen sich Archivbestände präzise zuordnen und vergleichen. Die Quellen mit ergänzenden Informationen sind direkt verlinkt."
        ],
      },
      'build': {
        'linked': {
          'title': 'efis für alle – Filme eindeutig identifiziert ',
          'lead':  [
            'AVefi ist ein Verbundsystem für Filmbestände aus unterschiedlichen Institutionen. Für jeden Film vergibt AVefi „Einheitliche Filmidentifikatoren“ (efis). Werke, Manifestationen und Exemplare erhalten jeweils eigene, dauerhaft gültige Identifikatoren.',
            'So lassen sich Filmwerke institutionsübergreifend eindeutig identifizieren. Manifestationen und Exemplare sind unterscheidbar und gezielt auffindbar. Das ermöglicht konsistentes Referenzieren und verlässliches Zitieren.'
          ]
        }
      },
      'callToAction': {
        'title': 'Ihre Bestände in AVefi',
        'content': [
          'AVefi ist offen für weitere Filmbestände aus Archiven und Sammlungen. Bringen Sie Ihre Daten ein und stärken Sie deren nachhaltige Nutzung. Durch persistente Identifikatoren und strukturierte Metadaten werden Ihre Bestände besser sichtbar und langfristig wissenschaftlich nutzbar.',
          'Neue Kooperationspartner sind sehr willkommen.',
        ],
        'cta': 'Kontaktieren Sie uns',
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
          'AVefi ist eine Plattform für interdisziplinäre filmbezogene Forschung, Filmkultur- und Filmarchivarbeit. Sie wird kontinuierlich weiterentwickelt und erweitert sich dynamisch um neue Datenquellen und Kooperationspartner. Die Infrastruktur basiert auf strukturierten Metadaten, Normdaten und persistenten Identifikatoren (PID). Heterogene audiovisuelle Bestände lassen sich damit identifizieren und vergleichen. Das Datenschema orientiert sich an etablierten Fachstandards. Leitend sind Linked Open Data und FAIR-Prinzipien.',
          'Hintergrundinformationen finden Sie auf der Projektwebsite.',
        ],
        'cta': 'Kontaktieren Sie uns',
        'ctaLink': 'https://projects.tib.eu/av-efi'
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
        'title': 'Teamwork',
        'text': 'AVefi ist ein Infrastrukturprojekt im Verbund. Die Verbundpartner arbeiten mit beratender Expertise und konkreter Beteiligung von Praxispartnern zusammen, darunter Archive, Museen und wissenschaftliche Einrichtungen aus dem Bereich Filmkultur und -forschung.',
        'cta': 'AVefi Mailingliste abonnieren',
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
      'title': 'AVefi – Filmdatenbank und Filmrecherche über Archive hinweg',
      'ogTitle': 'AVefi – AVefi – Filmwerke archivübergreifend finden',
      'description': 'AVefi ermöglicht die Recherche von Filmwerken, Manifestationen und Exemplaren in mehreren Filmarchiven. Normdaten-Verknüpfungen, Persistent Identifiers und strukturierte Metadaten unterstützen Forschung, Archivarbeit und digitale Filmwissenschaft.',
      'ogDescription': 'Entdecken Sie Filmwerke über Archive hinweg. AVefi verknüpft Metadaten, Normdaten und Persistent Identifiers, sodass Filmbestände gezielt durchsucht, verfeinert und für Forschung und Archivpraxis genutzt werden können.',
      'vocab': {
        'ogTitle': 'AVefi Vokabular – Wichtige Begriffe entdecken',
        'ogDescription': 'Erkunden Sie das AVefi-Vokabular für Definitionen und Erklärungen zu wichtigen Begriffen aus Filmmetadaten, Werken, Manifestationen und Exemplaren.'
      },
      'datasetTitle': 'AVefi – Filmmetadatenkatalog',
      'datasetDescription': 'AVefi verknüpft Filmmetadaten aus mehreren Institutionen und vergibt persistente Identifikatoren (efis) für Werk, Manifestation und Exemplar.',
      'catalogTitle': 'AVefi – Film Metadata Catalog',
      'catalogDescription': 'Katalog für verknüpfte Filmmetadaten und persistente Identifikatoren (efis) aus mehreren beteiligten Institutionen.',
      'projectTitle': 'AVefi – Forschungsinfrastruktur für audiovisuelle Metadaten',
      'projectDescription': 'AVefi verknüpft Filmbestände mehrerer Institutionen zu einheitlichen Filmwerken und macht diese über persistente Identifikatoren (efis) dauerhaft auffindbar und zitierfähig.',
      'projectFundingTitle': 'DFG-Forschungsinfrastrukturprojekt'
    }
  },
  'advancedSearch': 'Erweiterte Suche',
  'addFacet': 'Facette hinzufügen',
  'selectFacet': 'Facette auswählen',
  'enterValue': 'Wert eingeben',
  "mainNavigation": "Hauptnavigation",
  "cookiesDescription": "Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. Einige Cookies sind notwendig, um die grundlegenden Funktionen der Website zu gewährleisten, während andere uns helfen, die Website zu verbessern und Ihnen personalisierte Inhalte anzubieten. Sie können Ihre Cookie-Einstellungen jederzeit ändern.",
  "dataprotection": "Datenschutzerklärung",
  "imprint": "Impressum",
  "accessibilityStatement": "Barrierefreiheit",
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
  "vocab.filterByLetter": "Vokabular nach {letter} filtern",
  "vocab.copyLink": "Link zum Begriff kopieren",
  "vocab.letter": "Buchstabe",
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
  "elementsinfavourites": "Elemente in der Merkliste",
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
  'featuredContent': 'AVefi präsentiert ausgewählte Sammlungen und wichtige Erkenntnisse aus dem Bereich der Film-Metadaten. Erkunden Sie eine Vielzahl von Datensätzen, von umfassenden Filmographien bis hin zu detaillierten technischen Spezifikationen, die eine eingehende Analyse und neue Einblicke in die filmische Landschaft ermöglichen. Die Plattform verbindet institutionelle Datenquellen mit normierten Identifikatoren, unterstützt historische Forschung ebenso wie kuratorische Praxis und schafft neue Zugänge zu Werken, Formaten und Archivbeständen.',
  'coreFunctionsSection': 'Kernfunktionen',
  "openExternalReferences": "Externe Referenz öffnen",
  'bannerSection': 'Ausgewählte Sammlungen und Highlights aus der Welt der Film-Metadaten',
  'lookWhatWeFound' : 'Gefunden in Ihrer Suche',
  'multihelptext': 'Es wurden mehrere Werke gefunden, die der Entität mit dem efi <strong>{name}</strong> zugeordnet sind. Bitte beachten Sie, dass es sich hierbei um unterschiedliche Werke handelt, die auf verschiedene Weise mit dieser Entität verknüpft sein können. Um detailliertere Informationen zu einem bestimmten Werk anzuzeigen, wählen Sie bitte eines aus der Liste aus. Nach der Auswahl werden Ihnen unter anderem Produktionsangaben, Regie sowie weitere relevante Metadaten angezeigt.',
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
        "short": "AVefi (Automatisiertes Verbundsystem für audiovisuelle Bestände über einheitliche Filmidentifikatoren) ist ein von der Deutschen Forschungsgemeinschaft gefördertes Projekt. Es entwickelt und erprobt ein webbasiertes System zur institutionsübergreifenden Identifikation und Verknüpfung von Filmwerken, ihren Manifestationen und konkreten Exemplaren. Zentral sind persistente Identifikatoren (PID), die eine eindeutige Referenzierung heterogener Bestände ermöglichen.",
        "long": "Das Projekt AVefi (Automatisiertes Verbundsystem für audiovisuelle Bestände über einheitliche Filmidentifikatoren) entwickelt ein institutionsübergreifendes, webbasiertes System. Es erlaubt die eindeutige Identifikation und Verknüpfung audiovisueller Werke, ihrer Manifestationen und einzelner Exemplare aus unterschiedlichen institutionellen Beständen. Als einheitliche Filmidentifikatoren (efi) dienen Persistent Identifiers (PID) auf Basis des Handle-Systems. Sie ermöglichen eine automatisierte Registrierung, die strukturierte Zusammenführung von Metadaten aus lokalen Datenbanken, eine zuverlässige Disambiguierung sowie einen langfristigen offenen Zugang zu den Daten. Das zugrunde liegende Datenmodell unterscheidet zwischen Werk, Manifestation und Exemplar entsprechend dem FIAF Moving Image Cataloguing Manual. Eine benutzerfreundliche Such- und Bearbeitungsoberfläche unterstützt Forschung, archivarische Arbeitsabläufe und die nachhaltige Verknüpfung audiovisueller Bestände. In enger Zusammenarbeit mit Praxispartnern und Forschungsgemeinschaften werden Metadatenregeln, Workflows und ein flexibler Prototyp für die Recherche nach Werken, Manifestationen und Exemplaren entwickelt. Projektpartner sind die Deutsche Kinemathek, die TIB – Leibniz-Informationszentrum Technik und Naturwissenschaften, die Gesellschaft für wissenschaftliche Datenverarbeitung mbH Göttingen, das Filmmuseum Düsseldorf sowie das Marburg Center for Digital Culture & Infrastructure. Das dreijährige Fortsetzungsprojekt (AVefi plus 2025–2028) wird den Prototyp zu einem nachhaltigen Dienst weiterentwickeln, die Community erweitern und die internationale Datenintegration stärken. Darüber hinaus werden Lösungen für filmbezogene Materialien entwickelt, um sie in die Forschungsinfrastruktur zu integrieren. AVefi dient der wissenschaftlichen Nutzung, der strukturierten Filmrecherche und der langfristigen Verknüpfung audiovisueller Bestände. Das System ist offen für weitere Datenquellen und Kooperationen."
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
  'addtocomparisonparam': '«{name}» zum Vergleich hinzufügen',
  'addedtocomparisonparam': '«{name}» zum Vergleich hinzugefügt',
  'addtofavouritesparam': '«{name}» zu Favoriten hinzufügen',
  'addedtofavouritesparam': '«{name}» zu Favoriten hinzugefügt',
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
  'toggleManifestation': 'Klicken Sie auf die Manifestation, um Details zu {manifestationId} anzuzeigen',
  'nextPage': 'Nächste Seite',
  'prevPage': 'Vorherige Seite',
  'searchInFacet': 'In {facetName} suchen',
  'refineBy': 'Nach {label} verfeinern',
  'eventCategory': 'Event-Kategorie',
  "faq": {
    "title": "FAQ",
    "mainContent": "Hauptinhalt FAQ",
    "articleContent": "FAQ-Inhalt",
    "sections": {
      "about": {
        "heading": "Über AVefi",
        "content": [
          "AVefi steht für „Automatisiertes Verbundsystem für audiovisuelle Bestände über einheitliche Filmidentifikatoren“. Seit November 2023 entwickelt ein von der Deutschen Forschungsgemeinschaft gefördertes Kooperations- und Infrastrukturprojekt das System. AVefi führt filmische Metadaten verschiedener Institutionen zusammen und macht diese Daten in einer Filmdatenbank recherchierbar und nachnutzbar.",
          "Das Verbundsystem ergänzt das bestehende Angebot filmischer Identifikatoren und (Norm-)Daten, zum Beispiel von Filmportal, EIDR, GND, NFDI4Culture. AVefi bietet dafür eine eigene Recherche- und Redaktionsoberfläche mit engem Bezug zu den Beständen. Die Plattform dient dazu, audiovisuelle Bestände jeglicher Herkunft, Gattungen und Genres dauerhaft nachzuweisen und zu verknüpfen. Leitend sind Linked Open Data und FAIR-Prinzipien.",
          "Die Filme der datengebenden Institutionen werden soweit möglich automatisiert identifiziert und abgeglichen. Wenn erforderlich werden die Werke zusammengeführt. Eine zentrale Rolle spielen dabei persistenten Identifikatoren (PID). Mit persistenten Identifikatoren lassen sich Filmwerke und ihre Versionen automatisch und eindeutig miteinander in Bezug setzen. Filme, von denen (un-)vollständige Kopien in verschiedenen Archiven lagern, können so leichter gefunden werden. Das hilft für Restaurierungszwecke oder um filmbezogene Forschungsfragen zu beantworten.",
          "Das eigens entwickelte AVefi-Schema folgt dem <a class=\"link\" href=\"https://www.fiafnet.org/pages/E-Resources/FIAF-Handbuch-Katalogisierung.html\" target=\"_blank\" rel=\"noopener noreferrer\">FIAF-Regelwerk</a>. Der Nachweis unterscheidet dabei drei Ebenen: Werk, Manifestation und Exemplar."
        ]
      },
      "availableMetadata": {
        "heading": "Welche Film-Metadaten finde ich hier?",
        "content": [
          "Die Plattform führt Metadaten der beteiligten Institutionen zusammen. Sie macht Filme aus unterschiedlichen Gattungen und Genres recherchierbar. Das Spektrum reicht vom frühen Film über Dokumentar- und Spielfilme bis zu Gebrauchsfilmen. Ein besonderer Schwerpunkt liegt derzeit auf Unterrichts-, Lehr- und Wissenschaftsfilmen sowie auf ephemerem Filmmaterial und Amateurfilmen. Die Quellen mit ergänzenden Informationen sind direkt verlinkt.",
          "Die Informationen sind in verschiedene Facetten gegliedert, beispielsweise Genre oder Produktionsjahr. Diese Facetten lassen sich nutzen, um Suchergebnisse zu filtern. Je nach Art der Information ist sie auf der Ebene des Werks, einer Manifestation oder eines konkreten Exemplars angehängt."
        ]
      },
      "definitions": {
        "heading": "Was ist der Unterschied zwischen Werk, Manifestation und Exemplar?",
        "content": [
          "AVefi unterscheidet im Sinne des FIAF-Regelwerks zwischen Filmwerken, Manifestationen und Exemplaren.",
          "Werk: das Filmwerk als abstrakte Einheit, von dem mehrere Manifestationen in verschiedenen Sammlungen existieren können",
          "Werk ist eine Entität, die den geistigen oder künstlerischen Inhalt und den Prozess der Realisierung in einem kinematografischen Medium umfasst. Zum Beispiel wie der Film heißt, wann er gedreht wurde oder wer ihn gedreht hat. Diese Kerninformationen ändern sich in der Regel in keiner Manifestation.",
          "Manifestation: eine bestimmte Fassung eines Filmwerks, die durch Exemplare in einer Sammlung vertreten ist",
          "Eine Manifestation ist die Verkörperung eines Filmwerks. Manifestationen umfassen alle analogen, digitalen und Online-Medien. Informationen der Ebene Manifestation können eine Beschreibung dessen enthalten, was die jeweilige Manifestation idealerweise enthalten sollte. Ein Beispiel: Die ursprüngliche Originallänge eines Films beträgt 1:30:00, aber in dem im Archiv vorhandenen Exemplar fehlt Filmmaterial, sodass es kürzer ist.",
          "Exemplar: ein konkretes Objekt in einer Filmsammlung",
          "Ein Exemplar ist das physische Produkt einer Manifestation eines Werks. Ein Exemplar kann aus einer oder mehreren Komponenten bestehen, beispielsweise aus einer Rolle oder 5 Spulen. Bei Bedarf kann ein Exemplar-Datensatz Felder für jede Komponente des Exemplars enthalten. Das Exemplar kann vollständig, unvollständig oder ein Fragment sein. Bei rein digitalen Medien ist ein Exemplar definiert als die Verfügbarkeit der Datei, unabhängig von der Anzahl der eventuell vorhandenen Sicherungskopien.",
          "Aus technischen Gründen und weil Manifestationen in der Praxis unterschiedlich erfasst werden, hängen Informationen wie Sprache, Dauer oder Format bei AVefi nicht an der Manifestation, sondern am Exemplar.",
          "Das AVefi-Datenmodell ist darauf ausgelegt, Bestandsdaten eindeutig einer Institution zuzuordnen und gleichzeitig Beziehungen zwischen den Beständen verschiedener Institutionen darzustellen. Das System erzeugt dazu persistente Identifikatoren (PID). Die Identifikatoren, die „efi“ heißen, werden auf den genannten Ebenen mit ihren jeweils eigenen Anforderungen vergeben."
        ]
      },
      "efis": {
        "heading": "Was sind efis?",
        "content": [
          "Efis stehen für „einheitliche Filmidentifikatoren“. Es handelt sich um persistente Identifikatoren (PIDs) mit einem Set von Metadaten nach vorgegebenem Schema, welches sich an Standards der Filmarchive orientiert. Ein efi identifiziert entweder:",
          "ein Exemplar",
          "eine Manifestation",
          "oder ein Werk",
          "Bei AVefi verweist jeder efi für ein Exemplar auf genau einen efi für eine Manifestation, wobei mehrere Exemplare derselben Manifestation zugeordnet werden können (z.B. mehrere Filmrollen, die nacheinander abzuspielen sind). Jede Manifestation verweist wiederum auf mindestens einen efi für ein Werk.",
          "Mehrere Werke können auch verknüpft sein, z.B. wenn eine DVD mehrere gesondert beschriebene Filmwerke enthält."
        ]
      },
      "whyEfis": {
        "heading": "Warum werden efis vergeben?",
        "content": [
          "AVefi vergibt efis für jeden Film, der registriert wird. So lassen sich Filmwerke institutionsübergreifend eindeutig identifizieren. Manifestationen und Exemplare sind gezielt auffindbar.",
          "Efis sind persistente Identifikatoren (PID), die auf dem etablierten Handle-System basieren. Als spezifische Handle-PIDs ermöglichen sie es, Film-Metadaten langfristig zu identifizieren und eindeutig zu verknüpfen. Die zentral gesicherten, offenen Metadaten machen Filme besser auffindbar und erleichtern die Datenintegration und Nachnutzung. So unterstützen efis die Einhaltung von Forschungsdatenstandards und FAIR-Prinzipien. Außerdem helfen sie, Metadaten untereinander eindeutig in Bezug zu setzen. Ziel ist eine niedrigschwellige efi-Registrierung insbesondere für kleinere Institutionen.",
          "Mehr Informationen zur PID-Infrastruktur finden sich auf der <a class=\"link\" href=\"https://www.av-efi.net/\" target=\"_blank\" rel=\"noopener noreferrer\">Projektwebsite</a>."
        ]
      },
      "keywords": {
        "heading": "Welche Schlagworte werden genutzt?",
        "content": [
          "Erfasst werden alle Schlagworte, die die jeweilige datengebende Institution bereitgestellt hat. Schlagworte können frei gewählt sein oder auf kontrollierten Vokabularen bzw. Normdaten mit entsprechender Quellenangabe basieren."
        ]
      },
      "normdata": {
        "heading": "Werden Normdaten verwendet?",
        "content": [
          "Wenn die datengebende Institution Normdaten einsetzt, etwa die <a class=\"link\" href=\"https://gnd.network/Webs/gnd/DE/UeberGND/ueberGND_node.html\" target=\"_blank\" rel=\"noopener noreferrer\">Gemeinsamen Normdatei (GND)</a> oder der Thesaurus of Geographic Names (TGN), werden diese Angaben übernommen und entsprechend angezeigt."
        ]
      },
      "reuse": {
        "heading": "Welche Daten und Inhalte sind frei nachnutzbar?",
        "content": [
          "Zur bestmöglichen Unterstützung datengetriebener, freier Forschung, Lehre und Filmkulturarbeit sind - soweit nicht anders explizit angegeben - alle auf AVefi angebotenen Daten und Inhalte unter freien Lizenzen gestellt.",
          "Alle Metadaten sind ohne Urheberrechtsschutz gemeinfrei (Public Domain) ohne jegliche Voraussetzungen nachnutzbar: Creative Commons 1.0 universell",
          "Alle anderen Inhalte, etwa Bilder und redaktionelle Texte sind unter Quellenangabe frei nachnutzbar: Creative Commons Namensnennung 4.0 International"
        ]
      },
      "watchBorrow": {
        "heading": "Kann ich über die Plattform Filme anschauen bzw. ausleihen?",
        "content": [
          "AVefi ist eine Nachweisplattform. Sie stellt keine Filme bereit und verleiht keine Exemplare. Die Plattform bündelt Metadaten zu Filmwerken und zeigt, in welchen Institutionen sich Manifestationen und Exemplare befinden."
        ]
      },
      "viewingCopies": {
        "heading": "Wie finde ich Verleih- oder Sichtungskopien?",
        "content": [
          "Über die Facette „Status“ lässt sich gezielt nach „Distribution“ oder „Sichtung” filtern. Die Plattform zeigt dann nur die entsprechenden Exemplare an, die Verleih- oder Sichtungskopien sind. Die jeweilige Institution ist direkt verlinkt. Dort erhalten Sie Informationen zu Zugang und Nutzung."
        ]
      },
      "dataProviders": {
        "heading": "Hilfe für Datengeber",
        "content": [
          "Werden Sie als Datengeber Teil von AVefi. Informationen zu den notwendigen Schritten finden Sie im Folgenden:",
          "<a class=\"link\" href=\"/doc/AVefi-how-to-1.2.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">AVefi How-to Dokument</a>",
          "<a class=\"link\" href=\"/doc/2026-03_AVefi-Manual_v2.2.pdf\" target=\"_blank\" rel=\"noopener noreferrer\">AVefi Manual</a>",
          "Kontakt:",
          "E-Mail: <a class=\"link\" href=\"mailto:contact{'@'}av-efi.net\">contact{'@'}av-efi.net</a>"
        ],
      }
    }
  },
  'refinementOption': '{facetName}, {label}, {count}, {state}',
  'copiedToClipboard': 'in die Zwischenablage kopiert',
  'selected': 'ausgewählt',
  'notSelected': 'nicht ausgewählt',
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
  "detailedViewLinkFor": 'Detailansicht für {name} öffnen',
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
  'Located_in_has_name': 'Ort',
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
  'copyEFI': '{category} efi kopieren',
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
  'multiResults': 'Mehrere Ergebnisse',
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
  'mergeTool': 'Zusammenführungswerkzeug',
  "has_event": "Ereignis",
  'gotodisamiguationparam': 'Zu Disambiguierung',
  'gotofavourites': 'Zu Favoriten',
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
  'copyValueToTargetModelPropertyName': 'Übertrage Wert von {name} in das Ergebnis',
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
  'helpAndGlossary': 'Hilfe & Glossar',
  'language': 'Sprache',
  'licensing': 'Lizenzierung',
  'licensingContent': 'Details zu Lizenzierung und Nachnutzung, etwa zu Creative Commons, werden noch finalisiert.',
  'howToDoc': 'AVefi How-to Dokument: https://projects.tib.eu/fileadmin/data/av-efi/docs/2025-02_AVefi-how-to-vv1.pdf',
  'manual': 'AVefi Manual: https://projects.tib.eu/fileadmin/data/av-efi/docs/2025-01_AVefi-Manual_vv2.pdf',
  'linkscollection': 'Links',
  'list': 'Liste',
  'logList': 'Protokolle',
  'logout': 'Abmelden',
  'hours': 'Stunden',
  'minutes': 'Minuten',
  'item': 'Exemplar',
  'manifestation': 'Manifestation',
  'manifestationContent': 'Eine Manifestation ist eine konkrete Ausprägung eines Werks oder einer Variante in physischer oder digitaler Form. Diese Ebene beschreibt, was eine Manifestation idealerweise enthalten sollte, unabhängig von der Vollständigkeit der archivierten Elemente. Beispiel: Die ursprüngliche Laufzeit eines Films beträgt 1:30:00, ein Archivexemplar kann durch fehlendes Material jedoch kürzer sein.',
  'closeForm': 'Formular schließen',
  'clickToExpandManifestation': 'Klicken Sie auf die Manifestation, um Details anzuzeigen',
  'openForm': 'Formular öffnen',
  'viewAllItems': 'Alle Exemplare anzeigen',
  'manifestation_event_type': 'Manifestationstyp',
  'captchaText': 'Was ist {name}?',
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
  'noItemsFound': 'Keine Exemplare gefunden.',
  'searchheredshowFacetsForirectors': 'Suche Regie',
  'showFacetsFor': '{headerText}',
  'searchplaceholder': 'Suche nach Titel, Regie, Produktion, Schlagwort',
  'seconds': 'Sekunden',
  'showLess': 'Weniger anzeigen',
  'showMore': 'Mehr anzeigen',
  'showchildren': 'Kind-Elemente anzeigen',
  'showfavourites': 'Favoriten zeigen',
  '': 'Facetten für {headerText} auf Ebene {category} zeigen',
  'favouritesalready': 'Das Element befindet sich bereits in der Favoriten',
  'favouritesfull': 'Die Favoriten darf maximal zehn Elemente beinhalten. Um ein neues Element hinzufügen, bitte eines aus der Liste entfernen.',
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
  'open': 'Öffnen',
  'other_ids': 'Weitere IDs',
  'myDatasets': 'Meine Datensätze',
  'location': 'Ort',
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
  'filmsViewable': 'Filme online verfügbar',
  'filmsViewableContent': 'Die AVefi-Plattform bietet Zugang zu Filmen, die online angesehen werden können. Die Verfügbarkeit wird von der jeweiligen datengebenden Institution festgelegt und kann Einschränkungen unterliegen. AVefi hostet die Filme nicht selbst, sondern verweist auf die Seiten der jeweiligen Institutionen oder Plattformen.',
  'videoNotSupported': 'Ihr Browser unterstützt das Video-Tag nicht.',
  'partnersTitle': 'Teamwork ',
  'partnersDescription': 'AVefi ist ein Infrastrukturprojekt im Verbund. Die Verbundpartner arbeiten mit beratender Expertise und konkreter Beteiligung von Praxispartnern zusammen, darunter Archive, Museen und wissenschaftliche Einrichtungen aus dem Bereich Filmkultur und -forschung.',
  'ddrTitle': 'Filmgeschichte der DDR',
  'ddrDescription': 'Diese Sammlung ist eine wertvolle Ressource zur Filmgeschichte der DDR. Umfangreiche Metadaten ermöglichen anspruchsvolle Forschung und fördern neue wissenschaftliche Erkenntnisse zu Kultur und Gesellschaft der DDR.',
  'ddrLinkText': 'Unsere Sammlung an DDR-Filmen',
  'imageSource': 'Bildquelle',
  'author': 'Urheber',
  'has_genre_has_name': 'Genre',
  'has_issuer_name': 'Datenhaltende Institution',
  'has_language': 'Sprache',
  'has_duration_has_value': 'Länge',
  'has_format_type': 'Materialformat',
  'tryAdjustingFacets': 'Versuchen Sie, die Facetten anzupassen',
  'workVariantIsPartOf': 'Werke, die Teile des Werks mit efi <strong>{name}</strong> sind',
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
      "siteName": "AVefi – Filmdatenbank für audiovisuelle Forschung",
      "title": "Filmdatenbank für Filmarchive – AVefi",
      "ogTitle": "AVefi – Filmdatenbank für Filmwerke aus Archiven",
      "description": "AVefi ist eine Filmdatenbank für Filmarchive und audiovisuelle Sammlungen. Recherchieren Sie Filmwerke, Manifestationen und Exemplare aus mehreren Institutionen mit Normdaten-Verknüpfungen, Persistent Identifiers (efi) und strukturierten Filmmetadaten für Forschung und Archivarbeit.",
      "ogDescription": "Entdecken Sie Filmwerke über Archive hinweg. AVefi verknüpft Filmmetadaten, Normdaten und Persistent Identifiers, damit audiovisuelle Bestände gezielt recherchiert, verglichen und wissenschaftlich genutzt werden können."
    },
    "search": {
      "title": "Filmrecherche in Archiven – AVefi",
      "titleWithQuery": "{query} – Filmrecherche | AVefi",
      "description": "Durchsuchen Sie Filmwerke, Manifestationen und audiovisuelle Materialien aus Filmarchiven. Nutzen Sie Filter und Normdaten, um Filmdaten über mehrere Archive hinweg zu recherchieren.",
      "descriptionWithQuery": "Suchergebnisse zu \"{query}\" in der AVefi-Filmdatenbank. Entdecken Sie Filmwerke und audiovisuelle Materialien aus mehreren Filmarchiven."
    },
    "contact": {
      "title": "Kontakt und FAQ – AVefi Filmdatenbank",
      "description": "FAQ, Hintergrundinformationen und Glossar zur AVefi-Filmdatenbank und Forschungsinfrastruktur.",
      "ogTitle": "Kontakt – AVefi",
      "ogDescription": "Informationen, FAQ und Glossar zur AVefi-Plattform für Filmmetadaten."
    },
    "imprint": {
      "title": "Impressum – AVefi Filmdatenbank",
      "description": "Rechtliche Informationen zur AVefi-Plattform für Filmmetadaten.",
      "ogTitle": "Impressum – AVefi",
      "ogDescription": "Rechtliche Informationen zur AVefi-Plattform."
    },
    "accessibility": {
      "title": "Barrierefreiheit – AVefi Filmdatenbank",
      "description": "Informationen zur digitalen Barrierefreiheit bei AVefi, zu Standards, aktuellem Status und Kontaktmöglichkeiten bei Barrieren.",
      "ogTitle": "Barrierefreiheit – AVefi",
      "ogDescription": "Erfahren Sie, wie AVefi digitale Barrierefreiheit umsetzt und wie Sie Barrieren melden können."
    },
    "resource": {
      "title": "{title} – Filmwerk | AVefi",
      "description": "Filmwerk mit Metadaten aus Filmarchiven. AVefi zeigt Manifestationen, Exemplare und verknüpfte Filmdaten aus mehreren Institutionen."
    },
    "vocab": {
      "title": "Filmmetadaten Vokabular – AVefi",
      "titleWithField": "Vokabular: {field} – Filmmetadaten | AVefi",
      "titleWithFieldAndFilter": "Vokabular: {field} – \"{filter}\" | AVefi",
      "description": "Das AVefi-Vokabular erklärt wichtige Begriffe aus Filmmetadaten, Normdaten und audiovisuellem Kulturerbe.",
      "descriptionWithField": "Vokabularansicht für das Feld \"{field}\". Erkunden Sie kontrollierte Begriffe und Normdaten aus Filmarchiven.",
      "descriptionWithFieldAndFilter": "Vokabularansicht für \"{field}\" mit Einträgen zu \"{filter}\". Erkunden Sie Filmmetadaten und Normdaten aus mehreren Archiven."
    },
    "compare": {
      "title": "Filmdaten vergleichen – AVefi",
      "titleWithItems": "Filmdaten Vergleich {prev} vs {next} – AVefi",
      "description": "Vergleichen Sie Metadaten audiovisueller Werke aus Filmarchiven nebeneinander.",
      "descriptionWithItems": "Seitenvergleich zweier Filmwerk-Datensätze mit synchronisierten Ansichten und Unterschiedshervorhebung für Forschung und Archivarbeit."
    },
    "glossary": {
      "title": "Glossar – AVefi",
      "description": "Das Glossar bietet Definitionen und Erklärungen zu wichtigen Begriffen aus Filmmetadaten, Manifestationen, Exemplaren und weiteren Konzepten der AVefi-Plattform.",
      "ogTitle": "Glossar | AVefi",
      "ogDescription": "Entdecken Sie das AVefi-Glossar für Definitionen und Erklärungen zentraler Begriffe aus Filmmetadaten und audiovisuellen Beständen."
    },
    "faq": {
      "title": "FAQ – AVefi",
      "description": "Häufige Fragen zur AVefi-Filmdatenbank, ihren Funktionen und der Nutzung für Forschung und Archivarbeit.",
      "ogTitle": "FAQ | AVefi",
      "ogDescription": "Antworten auf häufige Fragen zur AVefi-Plattform für Filmmetadaten und audiovisuelle Bestände."
    },
    "normdata": {
      "title": "Normdaten für Filmmetadaten – AVefi",
      "titleWithField": "{field} – Normdaten | AVefi",
      "titleWithFieldAndFilter": "{field} – {filter} | Normdaten | AVefi",
      "description": "Durchsuchen Sie Normdaten und kontrolliertes Vokabular aus Filmarchiven.",
      "descriptionWithField": "Normdatenübersicht für das Feld \"{field}\" in der AVefi-Filmdatenbank.",
      "descriptionWithFieldAndFilter": "Normdaten für \"{field}\" mit Einträgen zu \"{filter}\" aus den Beständen der AVefi-Archive."
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
    "filterByLetter": "Nach Buchstabe filtern",
    "all": "Alle",
    "loading": "Lädt…",
    "value": "Wert",
    "normdata": "Normdaten",
    "provider": "Anbieter",
    "docs": "Dokumente",
    "noEntries": "Keine Einträge gefunden",
    "exportRow": "Zeile exportieren",
    "showInSearch": "In Suche anzeigen",
    "page": "Seite",
    "of": "von",
    "entries": "Einträge",
    "disclaimer": "Daten können unvollständig sein.",
    "fields": {
      "hasSubject": "Schlagwörter",
      "hasGenre": "Genre"
    }
  },
  "accessibilityPage": {
    "title": "Barrierefreiheit",
    "intro": "AVefi setzt sich dafür ein, digitale Angebote für möglichst viele Menschen zugänglich zu machen. Unsere Website und Produktoberflächen sollen für Menschen mit unterschiedlichen Fähigkeiten und assistiven Technologien nutzbar, verständlich und robust sein.",
    "commitment": {
      "title": "Unser Anspruch",
      "body": "Wir orientieren uns an anerkannten Standards der digitalen Barrierefreiheit, insbesondere an den Web Content Accessibility Guidelines (WCAG) 2.1 auf Konformitätsstufe AA. Diese Richtlinien bilden den Rahmen für wahrnehmbare, bedienbare, verständliche und robuste digitale Erlebnisse.",
      "areas": [
        "Website-Inhalte und Navigation",
        "Formulare und interaktive Bedienelemente",
        "Farbkontrast und Typografie",
        "Tastaturbedienung",
        "Semantisches HTML und Screenreader-Kompatibilität",
        "Responsive Layouts auf unterschiedlichen Geräten"
      ]
    },
    "principles": {
      "title": "Leitprinzipien",
      "perceivable": {
        "title": "Wahrnehmbar",
        "body": "Informationen und Oberflächenelemente sollen so präsentiert werden, dass sie von Nutzenden wahrgenommen werden können. Dazu gehören ausreichende Farbkontraste, sinnvolle Textalternativen und eine klare visuelle Hierarchie."
      },
      "operable": {
        "title": "Bedienbar",
        "body": "Die Oberfläche soll mit unterschiedlichen Eingabemethoden nutzbar sein, einschließlich der Tastaturnavigation. Interaktive Elemente sollen ausreichend groß, vorhersehbar und leicht auslösbar sein."
      },
      "understandable": {
        "title": "Verständlich",
        "body": "Inhalte und Aktionen sollen klar und konsistent sein. Beschriftungen, Überschriften und Navigationsmuster sollen dabei helfen zu verstehen, wo man sich befindet und was als Nächstes geschieht."
      },
      "robust": {
        "title": "Robust",
        "body": "Code und Komponenten sollen über Browser, Geräte und assistive Technologien hinweg zuverlässig funktionieren und auf standardbasierten, zugänglichen Implementierungsmustern aufbauen."
      }
    },
    "status": {
      "title": "Aktueller Stand der Barrierefreiheit",
      "body": "Diese Website ist teilweise mit den Anforderungen der WCAG 2.1 (Konformitätsstufe AA) vereinbar. Einige Inhalte sind derzeit noch nicht vollständig barrierefrei.",
      "nonAccessible": {
        "title": "Nicht barrierefreie Inhalte",
        "items": [
          "Einzelne Drittanbieter-Komponenten sind nicht vollständig barrierefrei",
          "Ältere Inhalte entsprechen nicht durchgehend aktuellen Barrierefreiheitsstandards",
          "Einige interaktive Elemente sind nicht in allen Szenarien optimal per Tastatur bedienbar"
        ]
      },
      "reasons": {
        "title": "Gründe",
        "items": [
          "Technische Einschränkungen durch eingesetzte Drittanbieter-Software",
          "Historisch gewachsene Inhalte, die schrittweise überarbeitet werden",
          "Laufende Weiterentwicklung der Plattform"
        ]
      },
      "alternatives": {
        "title": "Barrierefreie Alternativen",
        "body": "Sollten Sie auf Barrieren stoßen, kontaktieren Sie uns bitte. Wir stellen Ihnen die gewünschten Informationen nach Möglichkeit in barrierefreier Form zur Verfügung."
      }
    },
    "feedback": {
      "title": "Feedback und Kontakt",
      "body": "Wenn Sie bei der Nutzung von AVefi auf Barrieren stoßen oder Probleme mit der Barrierefreiheit bemerken, teilen Sie uns dies bitte mit. Ihr Feedback hilft uns, das Angebot weiter zu verbessern.",
      "contactLabel": "Kontakt",
      "contactEmail": "contact{'@'}av-efi.net",
      "includeLabel": "Bitte geben Sie möglichst Folgendes an:",
      "includeItems": [
        "die betroffene Seite oder Funktion",
        "das verwendete Gerät und den Browser",
        "eine kurze Beschreibung des Problems"
      ]
    },
    "arbitration": {
      "title": "Schlichtungsverfahren",
      "body": "Bei nicht zufriedenstellenden Antworten aus oben genannter Kontaktmöglichkeit können Sie bei der Schlichtungsstelle, eingerichtet bei dem Beauftragten der Bundesregierung für die Belange von Menschen mit Behinderungen, einen Antrag auf Einleitung eines Schlichtungsverfahrens nach dem Behindertengleichstellungsgesetz (BGG) stellen. Die Schlichtungsstelle nach Paragraph 16 BGG hat die Aufgabe, Streitigkeiten zwischen Menschen mit Behinderungen und aus öffentlichen Geldern finanzierten Einrichtungen zum Thema Barrierefreiheit in der IT beizulegen. Das Schlichtungsverfahren ist kostenlos. Es muss kein Rechtsbeistand eingeschaltet werden.",
      "contact": {
        "name": "Schlichtungsstelle nach dem Behindertengleichstellungsgesetz",
        "organization": "Beauftragter der Bundesregierung für die Belange von Menschen mit Behinderungen",
        "address": "Mauerstraße 53, 10117 Berlin",
        "phone": "+49 (0)30 18 527-2805",
        "fax": "+49 (0)30 18 527-2901",
        "email": "info{'@'}schlichtungsstelle-bgg.de",
        "website": "https://www.schlichtungsstelle-bgg.de/"
      }
    },
    "improvement": {
      "title": "Kontinuierliche Verbesserung",
      "body": "Wir überprüfen unsere digitalen Dienste regelmäßig und arbeiten daran, die Barrierefreiheit durch Design-Reviews, Implementierungsstandards und Tests fortlaufend zu verbessern."
    }
  },
  "skipToContent": "Zum Inhalt springen",
};

// IMPORTANT: merge in avefiLocales.de (choose order intentionally)
const mergedSeo = {
  ...deBase.seo,
  ...avefiDe.seo,
  home: { ...deBase.seo?.home, ...avefiDe.seo?.home },
  search: { ...deBase.seo?.search, ...avefiDe.seo?.search },
  contact: { ...deBase.seo?.contact, ...avefiDe.seo?.contact },
  imprint: { ...deBase.seo?.imprint, ...avefiDe.seo?.imprint },
  accessibility: { ...deBase.seo?.accessibility, ...avefiDe.seo?.accessibility },
  resource: { ...deBase.seo?.resource, ...avefiDe.seo?.resource },
  vocab: { ...deBase.seo?.vocab, ...avefiDe.seo?.vocab },
  compare: { ...deBase.seo?.compare, ...avefiDe.seo?.compare },
  glossary: { ...deBase.seo?.glossary, ...avefiDe.seo?.glossary },
  faq: { ...deBase.seo?.faq, ...avefiDe.seo?.faq },
  normdata: { ...deBase.seo?.normdata, ...avefiDe.seo?.normdata },
};
export default {
  ...deBase, 
  ...avefiDe,
  accessibilityStatement: "Erklärung zur Barrierefreiheit",
  seo: {
    ...mergedSeo,
    resource: {
      title: "{title} – Filmwerk | AVefi",
      description: "Filmwerk mit Metadaten aus Filmarchiven. AVefi zeigt Manifestationen, Exemplare und verknüpfte Filmdaten aus mehreren Institutionen."
    },
    faq: {
      title: "FAQ - AVefi Filmdatenbank",
      description: "Häufig gestellte Fragen, Hintergrundinformationen und Hilfetexte zu AVefi.",
      ogTitle: "FAQ - AVefi",
      ogDescription: "Antworten auf häufige Fragen zur Nutzung und zum Hintergrund von AVefi."
    },
    accessibility: {
      title: "Erklärung zur Barrierefreiheit - AVefi Filmdatenbank",
      description: "Diese Seite beschreibt Standards, aktuellen Stand und Kontaktwege zur digitalen Barrierefreiheit bei AVefi.",
      ogTitle: "Erklärung zur Barrierefreiheit - AVefi",
      ogDescription: "Informationen zur digitalen Barrierefreiheit bei AVefi sowie offizielle Referenzen und Kontaktmöglichkeiten."
    }
  }
};
