export type GlossaryLocale = 'de' | 'en';

export interface GlossaryEntry {
  id: string
  term: Record<GlossaryLocale, string>
  description: Record<GlossaryLocale, string>
  keywords: Record<GlossaryLocale, string[]>
  externalUrl?: string
}

export const glossaryEntries: GlossaryEntry[] = [
  {
    id: 'work-variant',
    term: {
      de: 'Werk/Variante',
      en: 'Work/Variant',
    },
    description: {
      de: 'Ein Werk umfasst den geistigen oder künstlerischen Inhalt eines Films. Varianten beschreiben abweichende Fassungen oder Ausprägungen dieses Werks.',
      en: 'A work captures the intellectual or artistic content of a film. Variants describe distinct versions or realizations of that work.',
    },
    keywords: {
      de: ['Werk/Variante', 'Werk', 'Variante', 'Werke'],
      en: ['Work/Variant', 'Work', 'Variant', 'Works'],
    },
    externalUrl: 'https://www.fiafnet.org/pages/E-Resources/FIAF-Handbuch-Katalogisierung.html',
  },
  {
    id: 'manifestation',
    term: {
      de: 'Manifestation',
      en: 'Manifestation',
    },
    description: {
      de: 'Eine Manifestation ist die konkrete Verkörperung eines Filmwerks, etwa als analoges, digitales oder online verfügbares Medium.',
      en: 'A manifestation is the concrete embodiment of a film work, for example as an analog, digital, or online medium.',
    },
    keywords: {
      de: ['Manifestation', 'Manifestationen'],
      en: ['Manifestation', 'Manifestations'],
    },
    externalUrl: 'https://www.fiafnet.org/pages/E-Resources/FIAF-Handbuch-Katalogisierung.html',
  },
  {
    id: 'item',
    term: {
      de: 'Exemplar',
      en: 'Item',
    },
    description: {
      de: 'Ein Exemplar ist die physische oder digitale Kopie einer Manifestation. Es kann vollständig, unvollständig oder fragmentarisch überliefert sein.',
      en: 'An item is the physical or digital copy of a manifestation. It may survive as a complete, incomplete, or fragmentary copy.',
    },
    keywords: {
      de: ['Exemplar', 'Exemplare', 'Item', 'Items'],
      en: ['Item', 'Items', 'Exemplar'],
    },
    externalUrl: 'https://www.fiafnet.org/pages/E-Resources/FIAF-Handbuch-Katalogisierung.html',
  },
  {
    id: 'metadata',
    term: {
      de: 'Metadaten',
      en: 'Metadata',
    },
    description: {
      de: 'Metadaten beschreiben audiovisuelle Werke, Manifestationen und Exemplare, etwa durch Titel, beteiligte Personen, Formate, Orte oder Zeiten.',
      en: 'Metadata describe audiovisual works, manifestations, and items through titles, people, formats, places, or dates.',
    },
    keywords: {
      de: ['Metadaten', 'Film-Metadaten'],
      en: ['Metadata', 'Film metadata'],
    },
  },
  {
    id: 'authority-data',
    term: {
      de: 'Normdaten',
      en: 'Authority data',
    },
    description: {
      de: 'Normdaten sind standardisierte Referenzen für Personen, Körperschaften, Orte oder Begriffe. Sie erleichtern eindeutige Zuordnung und Verknüpfung.',
      en: 'Authority data are standardized references for people, organizations, places, or concepts. They support unambiguous identification and linking.',
    },
    keywords: {
      de: ['Normdaten', 'Gemeinsame Normdatei', 'GND'],
      en: ['Authority data', 'Integrated Authority File', 'GND'],
    },
    externalUrl: 'https://gnd.network/Webs/gnd/DE/UeberGND/ueberGND_node.html',
  },
  {
    id: 'pid',
    term: {
      de: 'Persistente Identifikatoren',
      en: 'Persistent Identifiers',
    },
    description: {
      de: 'Persistente Identifikatoren, kurz PID, sind dauerhaft stabile Kennungen. In AVefi dienen sie der eindeutigen Identifikation und Verknüpfung von Filmdaten.',
      en: 'Persistent Identifiers, or PIDs, are stable long-term identifiers. In AVefi they support unambiguous identification and linking of film metadata.',
    },
    keywords: {
      de: ['Persistente Identifikatoren', 'Persistent Identifier', 'PID', 'PIDs'],
      en: ['Persistent Identifiers', 'Persistent Identifier', 'PID', 'PIDs'],
    },
    externalUrl: 'https://www.handle.net/',
  },
  {
    id: 'linked-open-data',
    term: {
      de: 'Linked Open Data',
      en: 'Linked Open Data',
    },
    description: {
      de: 'Linked Open Data beschreibt offene, standardisiert verknüpfte Daten, die über maschinenlesbare Beziehungen miteinander verbunden sind.',
      en: 'Linked Open Data refers to open, standardized data that are connected through machine-readable relationships.',
    },
    keywords: {
      de: ['Linked Open Data'],
      en: ['Linked Open Data'],
    },
    externalUrl: 'https://www.w3.org/standards/semanticweb/data',
  },
  {
    id: 'fair',
    term: {
      de: 'FAIR',
      en: 'FAIR',
    },
    description: {
      de: 'FAIR steht für Findable, Accessible, Interoperable und Reusable. Die Prinzipien helfen dabei, Forschungsdaten nachhaltig nutzbar zu machen.',
      en: 'FAIR stands for Findable, Accessible, Interoperable, and Reusable. The principles help make research data sustainably usable.',
    },
    keywords: {
      de: ['FAIR', 'FAIR-Prinzipien'],
      en: ['FAIR', 'FAIR principles'],
    },
    externalUrl: 'https://www.go-fair.org/fair-principles/',
  },
];
