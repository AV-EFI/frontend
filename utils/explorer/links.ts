/** Cross references from the explorer to the places where the same facts are documented. */

const SCHEMA_DOCS_BASE = 'https://av-efi.github.io/av-efi-schema/';

/** Documentation page of a class, field or value list in the AVefi schema. */
export function schemaDocsUrl(name?: string): string {
  return name ? `${SCHEMA_DOCS_BASE}${encodeURIComponent(name)}/` : SCHEMA_DOCS_BASE;
}

/** Glossary and vocabulary page, filtered to one value list. */
export function vocabularyUrl(enumName: string): string {
  return `/vocab?q=${encodeURIComponent(enumName)}`;
}

export interface FurtherLink {
  id: 'faqDefinitions' | 'faqEfis' | 'faqNormdata' | 'vocab' | 'schemaDocs' | 'schemaExplorer' | 'manual' | 'howto' | 'project';
  href: string;
  external: boolean;
}

/** Manual, how-to and project site are the same addresses the FAQ page uses. FAQ sections are anchored by faq.vue as the section key with every non-alphanumeric run turned into "-". */
export const FURTHER_LINKS: readonly FurtherLink[] = [
  { id: 'faqDefinitions', href: '/faq#faq-sections-definitions', external: false },
  { id: 'faqEfis', href: '/faq#faq-sections-efis', external: false },
  { id: 'faqNormdata', href: '/faq#faq-sections-normdata', external: false },
  { id: 'vocab', href: '/vocab', external: false },
  { id: 'schemaDocs', href: schemaDocsUrl(), external: true },
  { id: 'schemaExplorer', href: '/schema-explorer', external: false },
  { id: 'manual', href: 'https://projects.tib.eu/fileadmin/data/av-efi/docs/AVefi_Manual_aktuell.pdf', external: true },
  { id: 'howto', href: 'https://projects.tib.eu/fileadmin/data/av-efi/docs/AVefi_how-to_aktuell.pdf', external: true },
  { id: 'project', href: 'https://projects.tib.eu/av-efi/', external: true },
];
