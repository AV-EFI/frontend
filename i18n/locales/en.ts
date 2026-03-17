import avefiLocalesRaw from '~/models/interfaces/schema/locale_messages.json';
const avefiEn = (avefiLocalesRaw as any).en ?? (avefiLocalesRaw as any).default?.en ?? {};

const avefiBase = {
  'showSuggestions': 'Show suggestions',
  'noSuggestionsFound': 'No suggestions found',
  'errorLoadingDatasets': 'Error loading datasets',
  'incompleteData': 'Incomplete data',
  'failedToLoad': 'Failed to load',
  'invalidComparisonUrl': 'Invalid comparison URL',
  'missingBothDatasets': 'Both dataset identifiers are missing. Please provide the \'prev\' and \'next\' query parameters.',
  'missingDataset1': 'Dataset 1 identifier is missing. Please provide the \'prev\' query parameter.',
  'missingDataset2': 'Dataset 2 identifier is missing. Please provide the \'next\' query parameter.',
  'comparisonUrlHelp': 'Example: /compare?prev=21.11155/work-123&next=21.11155/work-456',
  "hero": {
    "pill": "Film Studies • Linked Data • Research",
    "badgeLine": "PID-ready • Authority Data • FDO-compatible"
  },
  "chips": {
    "works": "Works",
    "manifestations": "Manifestations",
    "items": "Items",
    "authorityLinks": "Authority data links"
  },
  "build": {
    "linked": {
      "title": "efis for all – uniquely identifying films",
      "lead": "AVefi is a federated system connecting film holdings across institutions. For each film, AVefi assigns Uniform Film Identifiers (efis). Works, Manifestations, and Items each receive their own persistent identifiers. Film works can therefore be uniquely identified across archives, while manifestations and items remain precisely distinguishable. This enables consistent referencing, reliable scholarly citation, searchable results, and open reuse of metadata.",
      "authority": "Authority data",
      "crosswalk": "Linking"
    },

    "schema": {
      "title": "Schema",
      "lead": "The AVefi schema follows FIAF cataloguing standards and provides detailed metadata across the levels of Work/Variant, Manifestation, and Item.",
      "work": "Work/Variant"
    }
  },

  "timeline": {
    "title": "From dataset to knowledge",
    "query": {
      "title": "Query",
      "desc": "Search across interconnected film datasets."
    },
    "refine": {
      "title": "Refine",
      "desc": "Filter by language, format, or location."
    },
    "share": {
      "title": "Share",
      "desc": "Save and share reproducible search states."
    },
    "cite": {
      "title": "Cite",
      "desc": "Generate persistent links for scholarly references."
    }
  },

  "create": {
    "yourOwn": "Create Your Own",
    "contactFormPrefill": "Contact form prefill"
  },

  "topIssuers": "Participating archives",
  "facets": "Facets",
  "dataset": "Dataset",
  "datasets": "Datasets",

  "viewDatasets": "View datasets",
  "viewHomepage": "Visit homepage",

  "switchToLightMode": "Switch to light mode",
  "switchToDarkMode": "Switch to dark mode",
  'home': {
    'breadcrumbs': 'Home',
    'welcome': 'Film metadata across all genres and formats is available, with a particular focus on educational, instructional, and research films as well as amateur and regional film collections.',

    'accessibility': {
      'skipToContent': 'Skip to content'
    },

    'hero': {
      'bannerSection': 'Featured collections and highlights from the world of film data',
      'tagline': 'AVefi connects the holdings of multiple institutions  to a film work and makes them permanently identifiable for discovery and research.',
      'claim': 'Find films. Link data.'
    },

    'search': {
      'modeSwitcher': 'Switch search mode',
      'simple': 'Show simple search',
      'advanced': 'Show advanced search',
      'loading': 'Loading search…'
    },
    'featured': {
      'aria': 'Featured collections and highlights from the world of film data'
    },
    'sections': {
      'searchAndFind': {
        'title': 'Explore',
        "text": [
          "AVefi lets you explore the diversity of film culture through a structured film database. Its range spans from early cinema to educational and other utility films to amateur productions. Use our examples as an entry point for searching for titles, topics, places and people.",
          "The platform bundles film-related metadata and distinguishes between Work, Manifestation, and Item. This structure enables precise identification and comparison of archival holdings. The data sources with additional information are linked directly."
        ],
      },
      'build': {
        'linked': {
          'title': 'efis for all – uniquely identifying films',
          'lead': [
            'AVefi is a network system for audiovisual holdings from multiple institutions. For each film, AVefi assigns a unique film identifier (efi). Works, Manifestations, and Items each receive their own persistent identifiers.',
            'This allows film works to be uniquely identified across institutions, while manifestations and items can be clearly distinguished and easily found. This makes consistent referencing and reliable citation possible.'
          ]
        }
      },
      'callToAction': {
        'title': 'Your holdings in AVefi',
        'text': [
          'AVefi is open to additional film holdings from archives and collections. Contribute your data and strengthen the sustainable discoverability and citability. Persistent identifiers and structured metadata increase the visibility and long-term research value of your collections.',
          'New cooperation partners are very welcome.'
        ],
        'cta': 'Visit the project website',
        'ctaLink': 'https://projects.tib.eu/av-efi'
      },
      'timeline': {
        'title': 'From dataset to knowledge',
        'query': {
          'title': 'Query',
          'desc': 'Search across interconnected film datasets.'
        },
        'refine': {
          'title': 'Refine',
          'desc': 'Filter by language, format, or location.'
        },
        'share': {
          'title': 'Share',
          'desc': 'Save and share reproducible search states.'
        },
        'cite': {
          'title': 'Cite',
          'desc': 'Generate persistent links for scholarly references.'
        }
      },
      'openAndExtendable': {
        'title': 'Open and expandable',
        'content': [
          'AVefi is a platform for interdisciplinary film-related research, film cultural activities, and film archiving. It is continuously being developed and dynamically expanded to include new data sources and cooperation partners. The infrastructure is based on structured metadata, authority data, and persistent identifiers (PID). This allows heterogeneous audiovisual collections to be identified and compared. The data schema is based on established standards. Linked Open Data and FAIR principles are the guiding principles.',
          'More information can be found on our project website.',
          'https://projects.tib.eu/av-efi',
        ],
        'cta': 'Get in contact'
      },
      'video': {
        'aria': 'AVefi video',
        'notSupported': 'Your browser does not support the video tag.'
      },
      'issuers': {
        'title': 'Participating archives'
      },

      'partners': {
        'title': 'Collaboration',
        'description': 'AVefi is a collaborative research infrastructure project. Partner institutions contribute advisory expertise and practical participation, including archives, museums, and research institutions working in the field of film culture and film studies.'
      },

      'becomePartner': {
        'title': 'Teamwork',
        'text': 'AVefi is a collaborative infrastructure project. The project partners work together with the advisory expertise and concrete participation of practical partners, including archives, museums, and academic institutions in the field of film culture and research.',
        'cta': 'Subscribe to the AVefi mailing list',
        'ctaLink': 'https://listserv.gwdg.de/mailman/listinfo/av-efi-community'
      }
    },
    'common': {
      'dataset': 'Dataset',
      'datasets': 'Datasets'
    },

    'carousel': {
      'aria': {
        'previous': 'Switch to previous slide',
        'next': 'Switch to next slide'
      },

      'labels': {
        'imageSource': 'Image source',
        'author': 'Author'
      },

      'actions': {
        'showLess': 'Show less',
        'showMore': 'Show more',
        'send': 'Send',
        'viewDatasets': 'View datasets',
        'viewHomepage': 'Visit homepage',
        'noIssuersFound': 'No archives found'
      },

      'create': {
        'title': 'What would you like to explore?',
        'description': 'Send us your search query as a suggestion for the gallery.',
        'yourOwn': 'Create Your Own',
        'contactFormPrefill': 'I created a carousel card:\n\nTitle: {title}\nDescription: {description}\nSearch URL: {url}'
      }
    },

    'cards': {
      'collections': {

        'docFilm': {
          'description': 'Documentary films that document and reflect movements and acts of resistance. Keyword searches enable thematic exploration of civil disobedience and protest.',
          'title': 'Activism in documentary film',
          'linkText': 'Explore activism in documentary film'
        },

        'restShort': {
          'description': 'Restored manifestations, such as digitally preserved short films, open new perspectives on film heritage.',
          'title': 'Restored short films',
          'linkText': 'Discover restored films'
        }

      },

      'people': {

        'troller': {
          'title': 'Georg Stefan Troller',
          'description': 'Georg Stefan Troller (1921–2025) was an Austrian-French filmmaker and journalist. His documentary films combined personal narratives with social themes, creating powerful portraits.',
          'linkText': 'G. S. Troller in AVefi'
        },

        'schlenker': {
          'title': 'Hermann Schlenker',
          'description': 'Hermann Schlenker’s ethnographic films from the second half of the twentieth century document cultures in transition and provide valuable historical testimony.',
          'linkText': 'Hermann Schlenker in AVefi'
        }

      }
    },
    'seo': {
      'siteName': 'AVefi – Infrastructure for Audiovisual Research',
      'title': 'AVefi – Film database and cross-archive film discovery',
      'ogTitle': 'AVefi – Discover film works across archives',
      'description': 'AVefi enables the discovery of film works, manifestations, and items across multiple film archives. Authority data links, persistent identifiers, and structured metadata support research, archival practice, and digital film studies.',
      'ogDescription': 'Discover film works across archives. AVefi connects film metadata, authority data, and persistent identifiers to enable precise search, filtering, and reuse of audiovisual collections for research and archival practice.',
      'vocab': {
        'ogTitle': 'AVefi Vocabulary – Discover key film terms',
        'ogDescription': 'Explore AVefi’s vocabulary for definitions and explanations of important terms used in film metadata, works, manifestations, and items.'
      },
      'datasetTitle': 'AVefi – Film Metadata Catalog',
      'datasetDescription': 'AVefi connects film metadata from multiple institutions and assigns persistent identifiers (efis) for works, manifestations, and items.',
      'catalogTitle': 'AVefi – Film Metadata Catalog',
      'catalogDescription': 'Catalog for linked film metadata and persistent identifiers (efis) from multiple participating institutions.',
      'projectTitle': 'AVefi – Research Infrastructure for Audiovisual Metadata',
      'projectDescription': 'AVefi connects film collections from multiple institutions into unified film works and makes them permanently discoverable and citable through persistent identifiers (efis).',
      'projectFundingTitle': 'DFG Research Infrastructure Project'

    }
  },
  "metaDescription": "AVefi is a platform for researching and comparing film data. It provides comprehensive metadata on film works, manifestations, and items from various institutions. The platform enables efficient searching, dataset comparison, and the use of Persistent Identifiers (PIDs) for long-term identification of films.",
  "mainNavigation": "Main navigation",
  "cookiesDescription": "We use cookies to improve your experience on our website. Some cookies are necessary to ensure the basic functions of the website, while others help us improve the website and offer you personalized content. You can change your cookie settings at any time.",
  "dataprotection": "Data Protection",
  "imprint": "Imprint",
  "accessibilityStatement": "Accessibility Statement",
  "productionyear": "Production Year",
  "country": "Place",
  "compareRegular": "Comparison view",
  "compareRaw": "Structure view",
  "detailedViewLinkFor": ({ named }: { named: (key: string) => string }) => `Open detailed view for ${named('name')}`,
  'advancedSearch': 'Advanced search',
  'addFacet': 'Add facet',
  'selectFacet': 'Select facet',
  'enterValue': 'Enter value',
  'item': 'Item',
  "exactSearchTip": "Use \"quotes\" to search for exact phrases – works for title, direction, production, and subjects (e.g. \"Bitte steigen Sie ein!\")",
  "detailviewlink": "Open detailed view",
  'viewItemDetails': 'View Item on WorkVariant Details Page',
  'viewManifestationDetails': 'View Manifestation on WorkVariant Details Page',
  'itemsCount': 'Items Count',
  'parts': 'Parts',
  'workVariants': 'Work Variants',
  'clickToSelectManifestation': 'Click on the manifestation to view items',
  'noWorkVariantDetails': 'No more WorkVariant information available',
  "title": "Title",
  "has_event": "Event",
  "tooltip": {
    "accessStatus": "Indicates whether the item is publicly accessible or if there are restrictions.",
    "format": "For analog film, format refers to the width of the film material; for video, it refers to the width of the videotape.",
    "elementType": "Indicates the type of analog film material. For digital media, it includes the file format and/or container.",
    "manifestation": "A manifestation is the physical embodiment or publication of an audiovisual work in analog or digital form.",
    "item": "An item is a physical or digital copy of a manifestation.",
    "webresource": "A link to a detailed view of the item on the data provider’s website.",
    "refinementsActive": "Active facets"
  },
  "vocab.title": "Vocabulary",
  "vocab.description": "The vocabulary provides definitions and explanations of key terms used in AVefi. It helps users understand the terminology related to audiovisual works, manifestations, items, and more.",
  "vocab.term": "Term",
  "vocab.definition": "Definition",
  "vocab.enumSource": "Enum Source",
  "vocab.category": "Category",
  "vocab.search": "Search vocabulary",
  "vocab.noResults": "No vocabulary entries found",
  "vocab.untranslated": "Untranslated",
  'vocab.all': "All Vocabulary Entries",
  "vocab.filterByLetter": ({ named }: { named: (key: string) => string }) => `Filter vocabulary by ${named('letter')}`,
  "userGlossary": "User Glossary",
  "ut": {
    "pageTitle": "User-generated tooltips",
    "editingDisabled": "Editing is disabled. Set CMS_ALLOW_USERTOOLTIP_EDITS=true to enable.",
    "sectionTitle": "Model Tooltips (User-generated)",
    "lastSaved": "Last saved",
    "searchPlaceholder": "Search properties…",
    "loadingTree": "Loading model tree…",
    "noTree": "No model tree loaded.",
    "exportJSON": "Export JSON",
    "exportCSV": "Export CSV",
    "headsUp": "Heads up:",
    "staleRest": "tooltip(s) reference paths not in the current model tree.",
    "showList": "Show list",
    "selectAll": "Select all",
    "deleteSelected": "Delete selected",
    "deleteAll": "Delete all",
    "editTooltip": "Edit tooltip",
    "docs": "Docs",
    "deLabel": "German (de)",
    "dePlaceholder": "Tooltip text in German",
    "enLabel": "English (en)",
    "enPlaceholder": "Tooltip text in English",
    "save": "Save",
    "revert": "Revert",
    "saved": "Saved ✅",
    "bulkEdit": "Bulk edit (table)",
    "thPath": "Path",
    "thDe": "German (de)",
    "thEn": "English (en)",
    "thActions": "Actions",
    "noChildren": "No children",
    "showInDetail": "Show in detail view",
    "showInSearch": "Show in search results"
  },
  "error404": {
    "title": "Error 404: Not found",
    "pageNotFound": "Page Not Found",
    "description": "The page you are looking for doesn't exist or has been moved. Please check the URL or navigate back to the homepage.",
    "goHome": "Go to Homepage",
    "goBack": "Go Back",
    "message1": "The path you seek does not exist in our archives.",
    "message2": "Perhaps a disturbance in the URL has led you astray.",
    "message3": "Return to the light, navigate to safety.",
    "seen": "Seen",
    "delivered": "Delivered",
    "time1": "1 second ago",
    "time2": "2 seconds ago",
    "time3": "3 seconds ago",
    "time4": "4 seconds ago"
  },
  "error500": {
    "title": "Error 500: Internal Server Error",
    "serverError": "Server Error",
    "description": "Something went wrong on our end. Our team has been notified and is working to fix the issue. Please try again in a few moments.",
    "goHome": "Go to Homepage",
    "tryAgain": "Try Again",
    "message1": "A disturbance in the Force has occurred on our servers.",
    "message2": "Our technicians are working to restore balance.",
    "message3": "Please be patient, we will resolve this soon.",
    "seen": "Seen",
    "delivered": "Delivered",
    "time1": "1 second ago",
    "time2": "2 seconds ago",
    "time3": "3 seconds ago",
    "time4": "4 seconds ago"
  },
  "vocab": {
    "title": "Vocabulary",
    "description": "The vocabulary provides definitions and explanations of key terms used in AVefi. It helps users understand the terminology related to audiovisual works, manifestations, items, and more.",
    "term": "Term",
    "definition": "Definition",
    "enumSource": "Enum Source",
    "category": "Category",
    "search": "Search vocabulary…",
    "noResults": "No results.",
    "all": "All",
    "filterByLetter": "Filter by letter {letter}",
    "untranslated": "not translated",
    "moreInfo": "learn more",
    "preview": "Preview",
    "openInNewTab": "Open in new tab",
    "viewDocs": "Documentation",
    "loading": "Loading…",
    "previewHint": "Pick an entry and click “Preview”.",
    "copyLink": "Copy link to term",
    "letter": "Letter"
  },
  "filteredInside": "Faceting active",
  "manifShort": "manif",
  "items": "Items",
  "srFacetChanged": "Results inside this work have been filtered: {manFiltered} of {manTotal} manifestations, {items} items.",
  "lastedit": "Last edited",
  "itemDetails": "Item Details for {handle}",
  "showHistory": "Show history",
  "elementsincomparison": "Elements in comparison list",
  "elementsinfavourites": "Elements in watch list",
  "showcomparison": "Open comparison",
  "gotocomp": "Go to comparison",
  "comp": "Comparison",
  "export": "Export",
  "email": "E-Mail",
  "enterYourEmail": "Enter your e-mail",
  "enterYourMessage": "Enter your message",
  'closeForm': 'Close form',
  'openForm': 'Open form',
  'viewAllItems': 'View all items',
  "enterYourAnswer": "Enter your answer",
  "send": "Send",
  "detailsFor": "Details for {name}",
  "noManifestations": "No manifestations available",
  "manifestations": "Manifestations",
  "webresource": "Web resource",
  "item_element_type": "Element type",
  "in_language_code": "Language",
  "has_colour": "Colour",
  "messageSentError": "Error sending message. Please try again later.",
  "messageSentSuccess": "Message sent successfully.",
  'bannerSection': 'Selected collections and highlights from the world of film metadata',
  'featuredContent': 'AVefi presents selected collections and key insights from the field of film metadata. Explore a variety of datasets, from comprehensive filmographies to detailed technical specifications, enabling in-depth analysis and new insights into the cinematic landscape.',
  'coreFunctionsSection': 'Core Functions',
  "openExternalReferences": "Open external references",
  'videoSection': 'AVefi Video',
  'partnersSection': 'Partners',
  'activeFiltering': 'Applied Filters',
  'activeFacets': 'Active facets',
  'item_duration_in_minutes': 'Duration in minutes',
  'alpha': 'The system is still in development. Please be aware that not all features are available yet and some functions may not work as expected.',
  'apply': 'Apply',
  'reset': 'Reset',
  'searchForm': 'Search Form',
  'searchInputAria': 'Search for title, director, production, keyword',
  'toggleNextSlide': 'Toggle next slide',
  'togglePreviousSlide': 'Toggle previous slide',
  'createYourOwn': {
    'title': 'Wonach suchen Sie?',
    'description': 'Senden Sie uns gerne Ihre Suchanfrage als Vorschlag für die Beispiele'
  },
  "press": {
    "badgeLastUpdated": "Last updated {date}",
    "title": "Press & Media Kit",
    "subtitle": "Official AVefi logos, screenshots, and boilerplate copy.",
    "contactLabel": "Press contact",
    "downloadAll": "Download all (ZIP)",
    "viewManifest": "View manifest",
    "boilerplateSection": "Press boilerplate",
    "boilerplateCopy": "Copy",
    "boilerplateCopied": "Copied",
    "usageSection": "Usage guidelines",
    "brandSafety": "Brand safety",
    "downloadFile": "Download {label}",
    "errorTitle": "Unable to load the press kit at this time.",
    "errorFallback": "Unknown error",
    "metaTitle": "Press & Media Kit – AVefi",
    "metaDescription": "Official AVefi logos, screenshots, and press documents for download.",
    "boilerplateLabels": {
      "oneLiner": "One-liner",
      "short": "Short description",
      "long": "Long description"
    },
    "assetTypes": {
      "logo": "Logo",
      "image": "Image"
    },
    "manifest": {
      "boilerplate": {
        "oneLiner": "AVefi is a cross-institutional network system for the unambiguous identification and linking of audiovisual holdings through persistent film identifiers.",
        "short": "AVefi (Automated network system for audiovisual holdings via standardised film identifiers) is a project funded by the German Research Foundation (DFG). It develops and tests a web-based system for the cross-institutional identification and linking of film works, their manifestations, and individual items. Persistent identifiers (PID) play a central role by enabling the unambiguous referencing of heterogeneous holdings.",
        "long": "The project AVefi (Automated network system for audiovisual holdings via standardised film identifiers) is developing a cross-institutional, web-based system. It enables the clear identification and linking of audiovisual works, their manifestations, and individual items across heterogeneous holdings. Persistent Identifiers (PIDs) based on the Handle System serve as uniform film identifiers (efi). They allow automated registration, the structured aggregation of metadata from local databases, reliable disambiguation, and long-term open access. The underlying data model distinguishes between Work, Manifestation, and Item in accordance with the FIAF Moving Image Cataloguing Manual. A user-friendly search and editing interface supports research, archival workflows, and the sustainable linking of audiovisual holdings. Close collaboration with practice partners and research communities helps develop metadata rules, workflows, and a flexible prototype for searching works, manifestations, and items. Project partners are the Deutsche Kinemathek, TIB – Leibniz Information Centre for Science and Technology, Gesellschaft für wissenschaftliche Datenverarbeitung mbH Göttingen, Filmmuseum Düsseldorf, and the Marburg Center for Digital Culture & Infrastructure. A three-year follow-up project (AVefi plus 2025–2028) will turn the prototype into a sustainable service, expand the user community, and strengthen international data integration. The project will also develop solutions for film-related materials to ensure their integration into the research infrastructure. AVefi supports scholarly use, structured film research, and the long-term linking of audiovisual holdings. The system is open to further data sources and collaborations."
      },
      "usage": {
        "title": "Usage Guidelines",
        "items": [
          "Use the provided logo files without altering proportions or colors.",
          "Reserve sufficient clear space around the AVefi wordmark so it remains legible.",
          "Pair screenshots and photography with attribution to \"AVefi\" and the original source archive when applicable.",
          "Contact the AVefi communications team before creating custom derivatives of the marks."
        ]
      },
      "sections": {
        "logos": {
          "title": "Logos",
          "badge": "Logos",
          "items": {
            "logoLight": {
              "title": "AVefi Logo (Light)",
              "notes": "Ideal for light and neutral backgrounds."
            },
            "logoDark": {
              "title": "AVefi Logo (Dark)",
              "notes": "Use on dark backgrounds for optimal contrast."
            }
          }
        },
        "claims": {
          "title": "Claim Lockups",
          "badge": "Claim lockups",
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
          "title": "Press Images",
          "badge": "Press images",
          "items": {
            "ogImage": {
              "title": "Open Graph Preview",
              "notes": "Standard open-graph preview showing the AVefi interface."
            }
          }
        }
      }
    }
  },
  'create.addImagePlaceholder': 'Image URL (optional)',
  'create.titlePlaceholder': 'Title',
  'create.descriptionPlaceholder': 'Description',
  'create.linkPlaceholder': 'Link (optional)',
  'create.linkTextPlaceholder': 'Link text (optional)',
  'create.createButton': 'Create',
  'create.contactFormPrefill': 'I created a carousel card:\n\nTitle: {title}\nDescription: {description}\nSearch URL: {url}',
  'toggleComparisonDrawer': 'Toggle comparison drawer',
  'toggleFacetDrawer': 'Facetten umschalten',
  'addNewLocation': 'Add new location',
  'addNewProductionYear': 'Add new production year',
  'addNewDirector': 'Add new director',
  'addNewProducer': 'Add new producer',
  'addNewCastMember': 'Add new cast member',
  'addNewGenre': 'Add new genre',
  'addNewSubject': 'Add new subject',
  'addNewOtherId': 'Add new other ID',
  'avefiClaim': 'Find films. Link data.',
  'avefiClaimHtml': 'Find films. Link data.',
  'avefi_Item': 'Item',
  'avefi_Manifestation': 'Manifestation',
  'avefi_WorkVariant': 'Work',
  'avefi:PublicationEvent': 'Publication Event',
  'avefi:Note': 'Note',
  'addtocomparisonparam': ({ named }: { named: (key: string) => string }) => `Add ${named('name')} to comparison`,
  'addedtocomparisonparam': ({ named }: { named: (key: string) => string }) => `Added ${named('name')} to comparison`,
  'addtofavouritesparam': ({ named }: { named: (key: string) => string }) => `Add ${named('name')} to Favourites`,
  'addedtofavouritesparam': ({ named }: { named: (key: string) => string }) => `Added ${named('name')} to Favourites`,
  'workNavigation': 'Work Navigation',
  'toggleNavigation': 'Toggle navigation',
  'backtosearch': 'Back to search',        
  "nofacetsselected": " No facets selected.",
  'category': 'Category',
  'category_clean': 'Category',
  'castmembers': 'Cast Member',
  'clear': 'Clear input',
  'clearallfilters': 'Clear all filters',
  'clearalllist': 'Clear list',
  'notLoggedIn' : 'You are not logged in',
  "emailHelpText": "Please enter your email address.",
  "messageHelpText": "Please enter your message here.",
  "captchaHelpText": "Please solve the captcha question to verify you're human.",
  "captchaQuestion": "What is ",
  "footer": "Footer",
  "works": "Works",
  "work": "Work",
  "hideVideo": "Hide Video",
  "showVideo": "Show Video",
  "openMenu": "Open Menu",
  "settingsMenu": "Settings menu",
  "mainMenu": "Main Menu",
  "moreOptions": "More options",
  "footerPreferences": "Preferences",
  "footerInfo": "Information",
  "footerSponsoring": "Sponsoring",
  "license": "License",
  "footerLicenseContent": "Content licensed under Creative Commons Attribution 4.0 International (CC BY 4.0).",
  "footerLicenseData": "Data licensed under Creative Commons Public Domain Dedication (CC0 1.0).",
  "userMenu": "User Menu",
  'submitQuery': 'Submit query',
  'clearQuery': 'Clear query',
  'collapseAll': 'Collapse all',
  'collapsePanel': 'Collapse panel',
  'togglePanel': 'Toggle panel',
  'toggleExpandAllHandles': 'Toggle expand all handles',
  'toggleViewType': 'Toggle view type',
  'toggleProductionDetails': 'Toggle production details',
  'toggleDetails': 'Toggle details',
  'fieldsFilled': 'Fields filled',
  'maximumProductionYear': 'Maximum production year',
  'minimumProductionYear': 'Minimum production year',
  'page': 'Page',
  'showDetails': 'Show details',
  'hideDetails': 'Hide details',
  'showManifestItems': 'Show manifest. & items',
  'total': 'Total',
  'toggleManifestation': ({ named }: { named: (key: string) => string }) => `${named('manifestationId')} click on the manifestation to view details`,
  'nextPage': 'Next page',
  'prevPage': 'Previous page',
  'searchInFacet': ({ named }: { named: (key: string) => string }) => `Search in ${named('facetName')}`,
  'refineBy': ({ named }: { named: (key: string) => string }) => `Refine by ${named('label') || named('headerText')}`,
  'refinementOption': ({ named }: { named: (key: string) => string }) => `Facet ${named('facetName')} on level ${named('category')}, value ${named('label')}, ${named('count')} results, ${named('state')}`,
  'showFacetItems': 'Show facets',
  'selected': 'selected',
  'notSelected': 'not selected',
  'preferences': 'Preferences',
  'loadingCookies': 'Loading cookie preferences…',
  'login': 'Sign in',
  'Login': 'Sign in',
  'captchaText': ({ named }: { named: (key: string) => string }) => `What is ${named('name')}?`,
  'enterYourName': 'Enter your name',
  'enterYourCaptcha': 'Enter the captcha code',
  'clickToExpandManifestation': 'Click on the manifestation to view details',
  'comparisonalready': 'The element already exists in the comparsion',
  'comparisonfull': 'Comparison must not contains more than two elements. Please remove at least one element from the list before adding another one.',
  'comparison': 'Comparison',
  'comparisonComponent': 'The comparison component allows users to select and compare up to two datasets in the comparison view. It is ideal for side-by-side analysis of key data points. Users can add or remove datasets from the comparison and export the results in CSV, XML, or JSON formats.',
  'favouritesComponent': 'The favourites list lets users save more than two datasets for long-term access. After registering, users can manage their list by adding or deleting entries. The saved datasets can also be exported in CSV, XML, or JSON formats for further use.',
  'contact.availableMetadata': 'What Film Metadata Can I Find Here?',
  'contact.availableMetadataContent': 'Film metadata of all genres and types are available, with a particular focus on educational, instructional, and scientific films, as well as ephemeral and amateur footage',
  'contact.definitions': 'What Is the Difference Between Work, Manifestation, and Item?',
  'contact.dataProviders': 'Help for Data Providers',
  'contact.dataProvidersContent': 'Become a data provider for AVefi. Information on the necessary steps can be found below.',
  'contact.availability': 'Can I Watch or Borrow Films on the Platform?',
  'contact.availabilityContent': 'No. AVefi is a discovery platform where you can find metadata on film works, as well as information on where their manifestations and items are located.',
  'contact.keywords': 'What Keywords Are Used?',
  'contact.keywordsContent': 'All keywords assigned by the contributing institution are included in the metadata.',
  'contact.normdata': 'Are Authority Data Used?',
  'contact.normdataContent': 'Authority data used by the contributing institution, such as the Integrated Authority File (GND), are adopted and displayed accordingly.',
  'contact.pids': 'Why Are PIDs Assigned?',
  'contact.pidsContent.0': 'Handle PIDs are used for the identification and linking of film metadata.',
  'contact.pidsContent.1': 'The centrally secured, open metadata within the PID infrastructure makes film data more discoverable and easily integrable into further research processes. PIDs also help to establish relationships between different sets of metadata.',
  'contact.about.0': 'AVefi means “Automated Consortium System for Audiovisual Holdings via Uniform Film Identifiers”. It was developed in November 2023 as part of an infrastructure cooperation project funded by the German Research Foundation (DFG). AVefi brings together film metadata from various institutions, making it both searchable and reusable for research purposes. The consortium system, including a research and editorial interface, complements the existing ecosystem of film identifiers and standard data (e.g. Filmportal, EIDR, GND, NFDI4Culture). It is an original offering with a strong focus on film holdings. AVefi serves the permanent identification and linking of audiovisual holdings of any origin, genre, and film type, by the principles of Linked Open Data and FAIR',
  'contact.about.1': 'Metadata for feature films, educational, instructional, and scientific films, as well as amateur films and home movies, are now searchable, aggregated, and available for research for the first time. The records for film works of the data-providing institutions are automatically compared, and, if necessary, merged as far as possible. Persistent identifiers (PIDs) play a central role. With their help, films and their versions can be automatically and uniquely related. Film components stored in different archives can thus be found more easily in the future to be used for restoration purposes or to answer film-driven research questions.',
  'contact.about.2': 'The specially developed AVefi schema follows the FIAF rules. Evidence is provided at the three levels Work/Variant, Manifestation, and Item.',
  'contact.about.heading': 'About AVefi',
  'contact.workContent.0': 'The data model is designed to assign collection inventory data to a holding institution uniquely, while at the same time representing relationships between the inventories of different institutions. PIDs, known by their German acronym “efi”, are generated for various classes of objects with their individual requirements. A distinction is made between (film) works, manifestations, and items following the FIAF rules.',
  'contact.workContent.1': 'Work/Variant',
  'contact.workContent.2': 'A work is an entity that encompasses the intellectual or artistic content and the process of realization in a cinematographic medium, e.g. what the film is called, when it was shot, who shot it, who was in it, what it is about, etc. This core information usually does not change in a manifestation.',
  'contact.workContent.3': 'Manifestation',
  'contact.workContent.4': 'A manifestation is the embodiment of a film work or a variant. Manifestations include all analog, digital, and online media. Information at the manifestation level may include a description of what the respective manifestation should ideally contain, regardless of the elements present in the archive. For example, the original runtime of a film might be 1:30:00, but the manifestation in the archive may be shorter due to missing film material.',
  'contact.workContent.5': 'Item',
  'contact.workContent.6': 'An item is the physical product of a manifestation of a work or a variant, i.e. the physical copy of a work or a variant. An item may consist of one or more components, i.e. the entire item may consist of one reel or five spools, two VHS tapes, or one DVD. An item record may include fields or areas for separate barcodes and condition information for each component of the item (e.g. each spool) as needed. The item may be complete, incomplete, or a fragment. For purely digital media, an item is defined as the availability of the file, regardless of the number of backup copies that may exist.',
  'countdownworkshop': 'Countdown till Workshop Anforderungsdokumentation:',
  'countries': 'Production Location',
  'copiedToClipboard': 'copied to clipboard',
  'linkCopied': 'Link copied to clipboard',
  'copyLinkPrompt': 'Copy this link',
  'share': {
    'shareTemplate': 'I want to share this search:\n\nQuery: {query}\nURL: {url}',
    'suggestTemplate': 'I would like to suggest this search/query for AVefi:\n\nQuery: {query}\nURL: {url}'
  },
  'shareSearch': 'Share search',
  'suggestSearchToAVefi': 'Share search/query with the AVefi team',
  'closeDrawer': 'Close',
  'close': 'Close',
  'openDrawer': 'Open',
  "place": "Place",
  'showFacetsFor': ({ named }: { named: (key: string) => string }) => `Show facets for ${named('headerText')} on level ${named('category')}`,
  'location': 'Location',
  'copyEFI': ({ named }: { named: (key: string) => string }) => `Copy efi of ${named('category')}`,
  'dashboard': 'Dashboard',
  'dataprovider': 'Data Provider',
  'dataholding': 'Data Holding Institution',
  'dataset1': 'Dataset 1',
  'dataset2': 'Dataset 2',
  'detailview': 'Detailed View',
  'directors': 'Directors',
  'directors_or_editors': 'Filmmakers',
  'disambiguation': 'Disambiguation',
  'emptyItem': 'No metadata',
  'emptyItemTooltip': 'This item has no additional metadata',
  'emptyManifestation': 'Empty',
  'emptyManifestationTooltip': 'This manifestation has no additional metadata',
  'emptyItemsShort': 'Manifestation items without metadata',
  'emptyItemsLong': 'Manifestation items do not contain further information',
  'allItemsEmpty': 'All Items without metadata',
  'allItemsEmptyTooltip': 'All items in this work have no additional metadata',
  'enterSearchTermFirst': 'Please enter a search term first',
  'enterobjectname': 'enter object name',
  'expandAll': 'Expand all',
  'expand': 'Expand',
  'viewType': 'View type',
  'tableView': 'Table',
  'exportdata': 'export data',
  'exportAsCSV': 'Export as CSV',
  'exportAsJSON': 'Export as JSON',
  'exportAsXLSX': 'Export as XLSX',
  'exportAsXML': 'Export as XML',
  'facettype': 'Type',
  'facetyear': 'Year',
  'facetyearonoff': 'Only show data with year',
  'favourites': 'Favourites',
  'filmidentification': 'Film Identification',
  'filmportalref': 'reference at filmportal.de',
  'filmresearch': 'Search',
  'copyToClipboard': 'Copy to clipboard',
  'castMember': 'Cast member',
  'CastMember': 'Cast member',
  'crewMember': 'Crew member',
  'crewMemberType': 'Crew member type',
  'agentsList': 'Agents list',
  'agent': 'Agent',
  'sameAs': 'Same as',
  'filmsViewable': 'Films viewable',
  'filmsViewableContent': 'The AVefi platform provides access to films that are viewable online. The availability of films for viewing is determined by the contributing institution and may be subject to restrictions. The platform does not host films itself, but rather provides links to the respective institutions or platforms where the films can be viewed.',
  'gotofavourites': 'Go to Favourites List',
  'howToDoc': 'AVefi How-to Document: https://projects.tib.eu/fileadmin/data/av-efi/docs/2025-02_AVefi-how-to-vv1.pdf',
  'manual': 'AVefi Manual: https://projects.tib.eu/fileadmin/data/av-efi/docs/2025-01_AVefi-Manual_vv2.pdf',
  'multihelptext': ({ named }: { named: (key: string) => string }) => `Several works have been found that are associated with the entity identified by efi <strong>${named('name')}</strong>. Please note that these are distinct works that may be linked to this entity in various ways. To view more detailed information about a specific work, please select one from the list. Once selected, you will be shown details such as the production information, directors and other relevant metadata.`,
  'multiResults': 'Multiple Results',
  'filter': 'filter',
  'gotodisamiguationparam': () => `Go to disambiguation`,
  'grid': 'Grid',
  'goToMerge': 'View Merge',
  "has_note": "Note",
  "noResults": "No results found",
  "recent": "Recent searches",
  'prodYearOnlyProductionYear': 'Only Records with production year',
  'prodYearOnlyProductionYearExtended': 'Show only records that have production year information',
  'has_date': 'Production year',
  'duration': 'Duration',
  'hello': 'Hello',
  'help': 'Help',
  'faq': 'FAQ',
  'helpAndGlossary': 'Help & Glossary',
  'hours': 'hours',
  'info': 'Info',
  'isPartOf': 'Is Part Of',
  'language': 'Language',
  'licensing': 'Licensing',
  'licensingContent': 'Details about licensing and reuse, such as Creative Commons, are yet to be finalized.',
  'linkscollection': 'Links',
  'list': 'List',
  'logList': 'Logs',
  'logout': 'Logout',
  'located_in_has_name': 'Location',
  'manifestation': 'Manifestation',
  'manifestation_event_type': 'Manifestation Type',
  'manifestationContent': 'A manifestation is a specific embodiment of a work or variant, represented through physical or digital media. This level describes what the manifestation ideally includes, regardless of the completeness of archival elements. For example, a film’s original runtime might be 1:30:00, but an archived copy could be shorter due to missing material.',
  'mergeTool': 'Merge Tool',
  'minutes': 'minutes',
  'myDatasets': 'My Datasets',
  'noItemsFound': 'No items found.',
  'open': 'Open',
  'other_ids': 'Other IDs',
  'matchedField': 'Matched Field',
  'pleaseusemanifestationlink': 'Please use the link to the Manifestation or Work',
  'producers': 'Producers',
  'production': 'Production',
  'productioncompany': 'Production company',
  'productionyears': 'Production Years',
  'productionDetailsOn': 'Production Details on',
  'productionDetailsOff': 'Production Details off',
  'productionDetailsOnShort': 'Production Details Off',
  'productionDetailsOffShort': 'Production Details On',
  'profile': 'Profile',
  'remove': 'remove',
  'results': 'results',
  'resultsUsage': 'How Can Search Results Be Used?',
  'resultsUsageContent': 'Search results can be exported as a table or CSV file. Further reuse options, such as JSON format, are still under consideration.',
  'scrollToTop': 'Scroll to Top',
  'search': 'search',
  'searchhereactors': 'Search for actors',
  'searchheredirectors': 'Search for directors',
  'searchplaceholder': 'Search for title, director, production, keyword',
  'seconds': 'seconds',
  'favouritesalready': 'The element already exists in the Favourites list',
  'favouritesfull': 'The Favourites list must not contain more than ten elements. Please remove at least one element from the list before adding another one.',
  'showLess': 'Show less',
  'showMore': 'Show more',
  'showchildren': 'Show child nodes',
  'showfavourites': 'Show Favourites list',
  'sorting': 'sorting (disabled)',
  'sponsoring': 'Funding',
  'subject': 'Subject',
  'subjects': 'Subjects',
  "searchcontent": "Search content",
  "searchpanel": "Search panel",
  "searchresults": "Search results",
  "searchbox": "Searchbox",
  "mainSearch": "Main search",
  "Search": "Search",
  "submitSearch": "Submit search",
  "resetQuery": "Reset query",
  "recentSearches": "Recent searches",
  "clearSearchHistory": "Clear search history",
  "clearAll": "Clear all",
  "removeFromHistory": "Remove from history",
  "showEntireCollection": "Show all",
  "filteringsection": "Filtering Section",
  'temporarytestdata': 'Temporary link until data available',
  'twinManifestationShort': 'Twin',
  'twinManifestationLong': 'Twins are manifestations that are very similar in content and form.',
  'Episode/Part': 'Episode/Part',
  'theme': 'Theme',
  'todolinks': 'TODO: Add links etc.',
  'tryClearingFiltersOrQuery': 'Try adjusting the filters or search query',
  'usage': 'Usage and Availability',
  'welcome': 'Welcome',
  'welcomeheading': 'Welcome to the AVefi homepage',
  'workvariants': 'Work Variants',
  'year': 'Year',
  'years': 'Year',
  'result': 'Result',
  'updateallproperties': 'Update all properties',
  'resetFormData': 'Reset Form Data',
  'cookiesModalDescription': 'Here you can adjust your cookie settings. You have the option to enable or disable certain cookies used for the functionality and improvement of our website. Please note that disabling some cookies may affect your use of the website.',
  'bannerText': 'Selected collections and highlights from the world of film metadata',
  'bannerDescription': 'AVefi presents selected collections and key insights from the field of film metadata. Explore a variety of datasets, from comprehensive filmographies to detailed technical specifications, enabling in-depth analysis and new insights into the cinematic landscape.',
  'message': 'Message',
  'slogan': 'Find, discover and compare comprehensive data on film holdings of all genres',
  'coreFunctionsTitle': 'Core Functions',
  'coreFunctions': [
    'Detailed metadata according to FIAF standards.',
    'Persistent IDs (PIDs) for long-term identification.',
    'Compliance with FAIR principles for optimal data usage.',
    'Easy search across various institutions.',
    'Central, regularly updated database.'
  ],
  'learnMore': 'Learn more',
  'lookWhatWeFound' : 'These parts matched your query',
  'forFilmResearchersTitle': 'Film Research',
  'forFilmResearchers': [
    'Time savings through efficient search.',
    'New insights through untapped collections.',
    'Reproducible research thanks to PIDs.',
    'Better collaboration between researchers.'
  ],
  'technicalBasicsTitle': 'Technical Basics',
  'technicalBasics': [
    'Solid technical foundation: Based on the Handle System, ensuring long-term data identification.',
    'Flexible integration: Allows easy integration into existing systems and workflows.',
    'High data quality: Through the use of a type registry and data model.'
  ],
  'licensingInfo': {
    'title': 'Licensing and Reuse',
    'content': [
      'All datasets, metadata, and accompanying information published on this website are – unless otherwise indicated – licensed under Creative Commons Attribution (CC BY).',
      'This license permits free use, redistribution, and adaptation of the content, including for commercial purposes, provided appropriate credit is given.',
      'By applying CC BY, the project affirms its commitment to openness, transparency, and the sustainable circulation of knowledge in the digital sphere. The data are designed to remain accessible and interoperable for research, cultural practice, and future reuse.',
    ]
  },
  'videoTitle': 'AVefi',
  'videoDescription': 'Find, discover and compare comprehensive data on film holdings of all genres. You can research both film works and versions from various participating film archives and collections.',
  'videoNotSupported': 'Your browser does not support the video tag.',
  'partnersTitle': 'Partners',
  'partnersDescription': 'AVefi is a project by TIB, SDK, FMD, and GWDG. It is supported by advisory expertise and active participation from practice partners, including archives, museums, and academic institutions in the field of film culture and research.',
  'ddrTitle': 'GDR Films',
  'ddrDescription': 'This collection represents a unique resource dealing with the film history of the GDR. By providing comprehensive metadata, it enables sophisticated research projects and contributes to the further development of scientific knowledge about the culture and society of the GDR.',
  'ddrLinkText': 'View collection',
  'imageSource': 'Image source',
  'copyValueToTargetModelPropertyName': ({ named }: { named: (key: string) => string }) => `Transfer value of ${named('name')} to result`,
  "moreOptionsFor": "More options for",
  'mergeResultHelpText': 'Merge two similar datasets into a single result. For each property in the result set, there’s one input for the value and an optional second input for external or authority IDs. Use the format "ID (Type)". To enter multiple IDs, separate them with commas: "ID (Type), ID (Type), …"',
  "listOfTerms": "List of terms",
  'breadcrumb': 'Breadcrumb',
  'author': 'Author',
  'has_genre_has_name': 'Genre',
  'has_issuer_name': 'Dataholder',
  'has_language': 'Language',
  'has_duration_has_value': 'Duration',
  'has_format_type': 'Materialformat',
  'tryAdjustingFacets': 'Try adjusting the facets',
  'workVariantIsPartOf': ({ named }: { named: (key: string) => string }) => `Works that are part of the efi <strong>${named('name')}</strong>`,
  "loading": "Loading...",
  "divider": "Divider",
  "avefi:PreservationEvent": "Preservation Event",
  "avefi:WorkVariantPart": "Work Variant Part",
  'unknownLanguage': 'Unknown language',
  "filterItemsAndManifestations": "Exemplare und Manifestationen filtern",
  "facetsInsideSearchResults": "Facets for Item and Manifestation are located within the search results in this mode",
  "accordionView": "Hierarchical",
  "flatView": "Flat",
  "viewTypeCheckedWarning": "Switching the view type will reset all active facets.",
  "itemLevel": "Item details",
  "manifestationLevel": "Manifestation details",
  "fromManifestation": "From manifestation",
  "searchItems": "Search items",
  "contact.about.2.beforeLink": "The specially developed AVefi schema follows the ",
  "contact.about.2.afterLink": ". Evidence is provided at the three levels Work/Variant, Manifestation, and Item",
  "contact.normdataContent.beforeLink": "Authority data used by the contributing institution, such as the ",
  "contact.normdataContent.afterLink": " – are adopted and displayed accordingly.",
  'skipToContent': 'Skip to content',
  'videoSectionTitle': 'Find, discover, and compare comprehensive data on film holdings across all genres.',
  'videoSectionDescription': 'Searchable are both film works and the respective manifestations and items from participating film archives and collections, including their relationships, identifiers, and selected metadata for nuanced cross-institutional research and comparison.',
  "seo": {
    "home": {
      "siteName": "AVefi – Film Metadata Database for Audiovisual Research",
      "title": "Film Metadata Database for Film Archives – AVefi",
      "ogTitle": "AVefi – Film Metadata Database for Works from Archives",
      "description": "AVefi is a film metadata database for film archives and audiovisual collections. Search film works, manifestations, and items across multiple institutions using authority links, persistent identifiers (efi), and structured film metadata for research and archival work.",
      "ogDescription": "Discover film works across archives. AVefi connects film metadata, authority data, and persistent identifiers so audiovisual holdings can be searched, compared, and used for scholarly research."
    },
    "search": {
      "title": "Film Archive Search – AVefi",
      "titleWithQuery": "{query} – Film Search | AVefi",
      "description": "Search film works, manifestations, and audiovisual materials from film archives. Use filters and authority data to research film metadata across multiple archives.",
      "descriptionWithQuery": "Search results for \"{query}\" in the AVefi film metadata database. Discover film works and audiovisual materials from multiple film archives."
    },
    "contact": {
      "title": "Contact and FAQ – AVefi Film Metadata Database",
      "description": "FAQ, background information, and glossary for the AVefi film metadata database and research infrastructure.",
      "ogTitle": "Contact – AVefi",
      "ogDescription": "Information, FAQ, and glossary for the AVefi platform for film metadata."
    },
    "imprint": {
      "title": "Legal Notice – AVefi Film Metadata Database",
      "description": "Legal information about the AVefi platform for film metadata.",
      "ogTitle": "Legal Notice – AVefi",
      "ogDescription": "Legal information about the AVefi platform."
    },
    "accessibility": {
      "title": "Accessibility â€“ AVefi Film Metadata Database",
      "description": "Information about accessibility at AVefi, including standards, current status, and how to report barriers.",
      "ogTitle": "Accessibility â€“ AVefi",
      "ogDescription": "Learn how AVefi approaches accessibility and how to report accessibility issues."
    },
    "resource": {
      "title": "{title} – Film Work | AVefi",
      "description": "Film work with metadata from film archives. AVefi displays manifestations, items, and linked film metadata from multiple institutions."
    },
    "vocab": {
      "title": "Film Metadata Vocabulary – AVefi",
      "titleWithField": "Vocabulary: {field} – Film Metadata | AVefi",
      "titleWithFieldAndFilter": "Vocabulary: {field} – \"{filter}\" | AVefi",
      "description": "The AVefi vocabulary explains key concepts related to film metadata, authority data, and audiovisual cultural heritage.",
      "descriptionWithField": "Vocabulary view for the field \"{field}\". Explore controlled terms and authority data used in film archives.",
      "descriptionWithFieldAndFilter": "Vocabulary view for \"{field}\" with entries matching \"{filter}\". Explore film metadata and authority data across multiple archives."
    },
    "compare": {
      "title": "Compare Film Metadata – AVefi",
      "titleWithItems": "Film Metadata Comparison {prev} vs {next} – AVefi",
      "description": "Compare metadata of audiovisual works from film archives side by side.",
      "descriptionWithItems": "Side-by-side comparison of two film work datasets with synchronized views and highlighted differences for research and archival analysis."
    },
    "glossary": {
      "title": "Glossary – AVefi",
      "description": "The glossary provides definitions and explanations of key terms related to film metadata, manifestations, items, and other concepts used in the AVefi platform.",
      "ogTitle": "Glossary | AVefi",
      "ogDescription": "Explore the AVefi glossary for definitions and explanations of key concepts related to film metadata and audiovisual collections."
    },
    "faq": {
      "title": "FAQ – AVefi",
      "description": "Frequently asked questions about the AVefi film metadata database, its features, and its use for research and archival work.",
      "ogTitle": "FAQ | AVefi",
      "ogDescription": "Find answers to common questions about the AVefi platform for film metadata and audiovisual collections."
    },
    "normdata": {
      "title": "Authority Data for Film Metadata – AVefi",
      "titleWithField": "{field} – Authority Data | AVefi",
      "titleWithFieldAndFilter": "{field} – {filter} | Authority Data | AVefi",
      "description": "Browse authority data and controlled vocabulary used in film archives.",
      "descriptionWithField": "Authority data overview for the field \"{field}\" in the AVefi film metadata database.",
      "descriptionWithFieldAndFilter": "Authority data for \"{field}\" with entries matching \"{filter}\" across the AVefi partner archives."
    }
  },
  "normdata": {
    "pageTitle": "Normdata",
    "pageDescription": "Browse controlled vocabulary entries and their normdata references.",
    "field": "Field",
    "filter": "Filter",
    "filterPlaceholder": "Search...",
    "onlyWithNormdata": "Only show entries with normdata",
    "perPage": "Per page",
    "export": "Export",
    "currentPageCSV": "Current page (CSV)",
    "currentPageJSON": "Current page (JSON)",
    "currentPageXML": "Current page (XML)",
    "fullExportTitle": "Full export",
    "allFilteredResults": "All filtered results",
    "completeDataset": "Complete dataset",
    "limitedResultsInfo": "Only the first 1000 results are shown of {total} total. Some entries may not be included.",
    "filterByLetter": "Filter by letter",
    "all": "All",
    "loading": "Loading…",
    "value": "Value",
    "normdata": "Normdata",
    "provider": "Provider",
    "docs": "Documents",
    "noEntries": "No entries found",
    "exportRow": "Export row",
    "showInSearch": "Show in search",
    "page": "Page",
    "of": "of",
    "entries": "entries",
    "disclaimer": "Data may be incomplete.",
    "fields": {
      "hasSubject": "Subjects",
      "hasGenre": "Genre"
    }
  },
  "accessibilityPage": {
    "title": "Accessibility",
    "intro": "AVefi is committed to making its digital services accessible to as many people as possible. We aim to design and maintain our website and product interfaces so they are usable, understandable, and robust for people with different abilities and assistive technologies.",
    "commitment": {
      "title": "Our commitment",
      "body": "We strive to follow recognized accessibility standards, in particular the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA. These guidelines provide the foundation for perceivable, operable, understandable, and robust digital experiences.",
      "areas": [
        "website content and navigation",
        "forms and interactive controls",
        "color contrast and typography",
        "keyboard navigation",
        "semantic HTML and screen reader compatibility",
        "responsive layouts across devices"
      ]
    },
    "principles": {
      "title": "Accessibility principles",
      "perceivable": {
        "title": "Perceivable",
        "body": "Information and interface components should be presented in ways users can perceive. This includes sufficient color contrast, meaningful text alternatives, and a clear visual hierarchy."
      },
      "operable": {
        "title": "Operable",
        "body": "The interface should be usable with different input methods, including keyboard navigation. Interactive elements should be large enough, predictable, and easy to activate."
      },
      "understandable": {
        "title": "Understandable",
        "body": "Content and actions should be clear and consistent. Labels, headings, and navigation patterns should help users understand where they are and what will happen next."
      },
      "robust": {
        "title": "Robust",
        "body": "Our code and components should work reliably across browsers, devices, and assistive technologies, using standards-based HTML and accessible implementation patterns."
      }
    },
    "status": {
      "title": "Current status",
      "body": "We are continuously improving accessibility across AVefi. Some areas of the platform may not yet fully meet our target standard, especially where third-party components or legacy content are involved. Accessibility improvements are part of our ongoing design, development, and QA process."
    },
    "feedback": {
      "title": "Feedback and contact",
      "body": "If you experience barriers while using AVefi, or if you notice accessibility issues, please let us know. Your feedback helps us improve.",
      "contactLabel": "Contact",
      "includeLabel": "Please include:",
      "includeItems": [
        "the page or feature where the issue occurred",
        "the device and browser you used",
        "a short description of the problem"
      ]
    },
    "improvement": {
      "title": "Ongoing improvement",
      "body": "We regularly review our digital services and aim to improve accessibility over time through design reviews, implementation standards, and testing."
    }
  },
};

export default {
  ...avefiBase,
  ...avefiEn,
  accessibilityStatement: "Accessibility Statement",
  seo: {
    ...avefiBase.seo,
    ...avefiEn.seo,
    resource: {
      title: "{title} – Film Work | AVefi",
      description: "Film work with metadata from film archives. AVefi displays manifestations, items, and linked film metadata from multiple institutions."
    },
    faq: {
      title: "FAQ - AVefi Film Metadata Database",
      description: "Frequently asked questions, background information, and help texts for AVefi.",
      ogTitle: "FAQ - AVefi",
      ogDescription: "Answers to common questions about using AVefi and its research context."
    },
    accessibility: {
      title: "Accessibility Statement - AVefi Film Metadata Database",
      description: "This page outlines standards, current status, and contact routes for digital accessibility at AVefi.",
      ogTitle: "Accessibility Statement - AVefi",
      ogDescription: "Information about digital accessibility at AVefi, including official references and contact options."
    }
  },
  accessibilityPage: {
    title: "Accessibility Statement",
    intro: "This statement explains how AVefi addresses digital accessibility across the website and related interfaces. AVefi is designed as an open, research-oriented infrastructure. The information on this page is therefore intended to be factual, clear, and easy to follow.",
    commitment: {
      title: "Our commitment",
      body: "AVefi follows recognized accessibility standards. The main reference point is the Web Content Accessibility Guidelines (WCAG) 2.1, Level AA. For us, accessibility is part of information quality, open access, and long-term usability.",
      areas: [
        "website content and navigation",
        "forms and interactive controls",
        "color contrast and typography",
        "keyboard navigation",
        "semantic HTML and screen reader compatibility",
        "responsive layouts across devices"
      ]
    },
    standards: {
      title: "Standards and official references",
      body: "The following official sources and standards are particularly relevant to our accessibility work:",
      niedersachsenVersion: "as of 2020-11-11, version 1.0"
    },
    principles: {
      title: "Accessibility principles",
      perceivable: {
        title: "Perceivable",
        body: "Information must be provided in forms people can perceive. This includes sufficient contrast, meaningful text alternatives, and a clear visual hierarchy."
      },
      operable: {
        title: "Operable",
        body: "The interface must work with different input methods, including keyboard navigation. Interactive elements should be predictable, reachable, and easy to activate."
      },
      understandable: {
        title: "Understandable",
        body: "Content, labels, and actions should be clear and consistent. People should be able to understand where they are and what will happen next."
      },
      robust: {
        title: "Robust",
        body: "Code and components should work reliably across browsers, devices, and assistive technologies. This depends on standards-based and accessible implementation patterns."
      }
    },
    status: {
      title: "Current status",
      body: "AVefi is developed continuously. As part of that work, we review barriers in navigation, content, interaction, and technical implementation. Some areas may not yet fully meet the target standard, especially where third-party components or legacy content are involved."
    },
    feedback: {
      title: "Feedback and contact",
      body: "If you encounter barriers or notice accessibility issues, please let us know. Concrete feedback helps us review and improve the affected area.",
      contactLabel: "Accessibility contact",
      includeLabel: "Please include:",
      includeItems: [
        "the page or feature where the issue occurred",
        "the device and browser you used",
        "a short description of the problem"
      ]
    },
    improvement: {
      title: "Ongoing improvement",
      body: "We review texts, components, and interaction patterns on a regular basis and adjust them where needed. This includes clarity, keyboard access, contrast, semantic structure, and robust technical implementation."
    }
  }
};
