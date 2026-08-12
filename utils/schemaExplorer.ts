export type SchemaClassId =
  | 'WorkVariant'
  | 'Manifestation'
  | 'Item'
  | 'Title'
  | 'Event'
  | 'Activity'
  | 'Agent'
  | 'Genre'
  | 'Subject'
  | 'Language'
  | 'Format'
  | 'Extent'
  | 'Duration'
  | 'DescriptionResource'
  | 'MovingImageResource'
  | 'AuthorityResource';

export type SchemaClassGroup =
  | 'spine'
  | 'description'
  | 'event'
  | 'agent'
  | 'vocabulary'
  | 'identifier';

export type SchemaSlotKind =
  | 'property'
  | 'relationship'
  | 'controlledVocabulary'
  | 'identifier'
  | 'provenance';

export type SchemaEdgeKind =
  | 'spine'
  | 'relationship'
  | 'shared'
  | 'event'
  | 'authority'
  | 'vocabulary';

export interface SchemaSlot {
  name: string;
  range: string;
  kind: SchemaSlotKind;
  required?: boolean;
  multivalued?: boolean;
  inheritedFrom?: SchemaClassId;
  description: string;
  anyOf?: string[];
}

export interface SchemaClass {
  id: SchemaClassId;
  label: string;
  shortLabel: string;
  group: SchemaClassGroup;
  abstract?: boolean;
  rank?: number;
  aliases?: string[];
  inherits?: SchemaClassId;
  description: string;
  modellingNotes: string[];
  slots: SchemaSlot[];
  controlledVocabularies?: string[];
}

export interface SchemaEdge {
  id: string;
  source: SchemaClassId;
  target: SchemaClassId;
  slot: string;
  kind: SchemaEdgeKind;
  required?: boolean;
  multivalued?: boolean;
  description: string;
}

export interface VocabularyGroup {
  id: string;
  label: string;
  appliesTo: SchemaClassId[];
  enumNames: string[];
  description: string;
}

export interface SchemaExplorerModel {
  classes: SchemaClass[];
  edges: SchemaEdge[];
  vocabularyGroups: VocabularyGroup[];
}

const commonMovingImageSlots: SchemaSlot[] = [
  {
    name: 'category',
    range: 'AVefiCurie',
    kind: 'identifier',
    required: true,
    inheritedFrom: 'AuthorityResource',
    description: 'Designates the concrete AVefi type, such as avefi:WorkVariant or avefi:Item.',
  },
  {
    name: 'described_by',
    range: 'DescriptionResource',
    kind: 'provenance',
    inheritedFrom: 'DescriptionResource',
    description: 'Metadata about the responsible issuer and PID record history.',
  },
  {
    name: 'has_primary_title',
    range: 'Title',
    kind: 'property',
    inheritedFrom: 'Title',
    description: 'Primary display title for works, manifestations, or items.',
  },
  {
    name: 'has_alternative_title',
    range: 'Title',
    kind: 'property',
    multivalued: true,
    inheritedFrom: 'Title',
    description: 'Additional title forms associated with the described moving image record.',
  },
  {
    name: 'has_event',
    range: 'Event',
    kind: 'relationship',
    multivalued: true,
    inheritedFrom: 'Event',
    description: 'Lifecycle events associated with the moving image record.',
  },
  {
    name: 'has_identifier',
    range: 'MovingImageResource',
    kind: 'identifier',
    multivalued: true,
    inheritedFrom: 'MovingImageResource',
    description: 'Record PID or local identifier for data transfer before PID registration.',
  },
  {
    name: 'same_as',
    range: 'AuthorityResource',
    kind: 'identifier',
    multivalued: true,
    inheritedFrom: 'AuthorityResource',
    description: 'External or AVefi authority reference for the same described entity.',
  },
];

const manifestationOrItemSlots: SchemaSlot[] = [
  ...commonMovingImageSlots,
  {
    name: 'has_note',
    range: 'TextArea',
    kind: 'property',
    multivalued: true,
    description: 'Free-text notes for manifestation or item level documentation.',
  },
  {
    name: 'has_webresource',
    range: 'HttpUri',
    kind: 'identifier',
    multivalued: true,
    description: 'External presentation URL from the data provider.',
  },
];

export const schemaExplorerModel: SchemaExplorerModel = {
  classes: [
    {
      id: 'WorkVariant',
      label: 'Work / WorkVariant',
      shortLabel: 'Work',
      group: 'spine',
      rank: 1,
      inherits: undefined,
      aliases: ['Werk', 'Work'],
      description: 'The intellectual or conceptual moving image work level in the AVefi model.',
      modellingNotes: [
        'The persistent conceptual spine starts here and continues through Manifestation to Item.',
        'A WorkVariant can point to another WorkVariant via is_variant_of and to larger aggregates via is_part_of.',
        'Genres, subjects, titles, events, and authority links describe the work level without turning the explorer into a record view.',
      ],
      controlledVocabularies: ['WorkVariantTypeEnum', 'VariantTypeEnum', 'WorkFormEnum'],
      slots: [
        ...commonMovingImageSlots.map((slot) => slot.name === 'has_primary_title'
          ? { ...slot, required: true }
          : slot),
        {
          name: 'type',
          range: 'WorkVariantTypeEnum',
          kind: 'controlledVocabulary',
          required: true,
          description: 'Controlled term for the work variant type.',
        },
        {
          name: 'variant_type',
          range: 'VariantTypeEnum',
          kind: 'controlledVocabulary',
          description: 'Controlled term describing the type of variant.',
        },
        {
          name: 'has_form',
          range: 'WorkFormEnum',
          kind: 'controlledVocabulary',
          multivalued: true,
          description: 'Controlled form terms such as broad work purpose or form.',
        },
        {
          name: 'has_genre',
          range: 'Genre',
          kind: 'relationship',
          multivalued: true,
          description: 'Genre descriptor terms for the work.',
        },
        {
          name: 'has_subject',
          range: 'CategorizedThing',
          kind: 'relationship',
          multivalued: true,
          anyOf: ['Subject', 'Agent', 'GeographicName'],
          description: 'Subject descriptors for content, people, organizations, or places.',
        },
        {
          name: 'is_variant_of',
          range: 'MovingImageResource',
          kind: 'relationship',
          description: 'Link to the reference WorkVariant for this variant.',
        },
        {
          name: 'is_part_of',
          range: 'MovingImageResource',
          kind: 'relationship',
          multivalued: true,
          description: 'Relates episodes, parts, or similar units to a larger work-level resource.',
        },
      ],
    },
    {
      id: 'Manifestation',
      label: 'Manifestation',
      shortLabel: 'Manifestation',
      group: 'spine',
      rank: 2,
      inherits: undefined,
      aliases: ['Manifestation'],
      description: 'The publication, preservation, or carrier expression level of a moving image work.',
      modellingNotes: [
        'Manifestation is not only a child in a tree; it explicitly points back to one or more WorkVariant resources.',
        'The schema records items through has_item and records the owning work relationship through is_manifestation_of.',
        'same_as on manifestations is restricted to AVefi moving image resources or EIDR resources.',
      ],
      slots: [
        ...manifestationOrItemSlots,
        {
          name: 'is_manifestation_of',
          range: 'MovingImageResource',
          kind: 'relationship',
          required: true,
          multivalued: true,
          description: 'Indicates the WorkVariant that is the subject of the manifestation.',
        },
        {
          name: 'has_item',
          range: 'MovingImageResource',
          kind: 'relationship',
          multivalued: true,
          description: 'Indicates AVefi Items registered as part of this manifestation.',
        },
      ],
    },
    {
      id: 'Item',
      label: 'Item',
      shortLabel: 'Item',
      group: 'spine',
      rank: 3,
      aliases: ['Exemplar', 'Item'],
      description: 'The concrete holding, file, copy, or exemplar level.',
      modellingNotes: [
        'Every item must be associated with a manifestation from the same data provider through is_item_of.',
        'Items carry material and access details such as format, extent, duration, language, and access status.',
        'is_copy_of and is_derivative_of preserve copy and derivation relationships between item-level resources.',
      ],
      controlledVocabularies: [
        'ItemAccessStatusEnum',
        'ItemElementTypeEnum',
        'ColourTypeEnum',
        'SoundTypeEnum',
      ],
      slots: [
        ...manifestationOrItemSlots,
        {
          name: 'is_item_of',
          range: 'MovingImageResource',
          kind: 'relationship',
          required: true,
          description: 'Indicates the AVefi Manifestation this item belongs to.',
        },
        {
          name: 'is_copy_of',
          range: 'AuthorityResource',
          kind: 'relationship',
          multivalued: true,
          anyOf: ['DOIResource', 'MovingImageResource'],
          description: 'Links to another item known to be a copy of this item.',
        },
        {
          name: 'is_derivative_of',
          range: 'MovingImageResource',
          kind: 'relationship',
          multivalued: true,
          description: 'Links to an item from which this item was derived in whole or in part.',
        },
        {
          name: 'element_type',
          range: 'ItemElementTypeEnum',
          kind: 'controlledVocabulary',
          description: 'Controlled material or element type.',
        },
        {
          name: 'has_access_status',
          range: 'ItemAccessStatusEnum',
          kind: 'controlledVocabulary',
          description: 'Access status controlling item-level access conditions.',
        },
        {
          name: 'has_format',
          range: 'Format',
          kind: 'relationship',
          multivalued: true,
          description: 'Physical or digital format branch for the item.',
        },
        {
          name: 'has_extent',
          range: 'Extent',
          kind: 'property',
          description: 'Physical length or size of the item.',
        },
        {
          name: 'has_duration',
          range: 'Duration',
          kind: 'property',
          description: 'Running time in ISO 8601 duration form.',
        },
        {
          name: 'in_language',
          range: 'Language',
          kind: 'relationship',
          multivalued: true,
          description: 'Language metadata with code and usage vocabulary.',
        },
      ],
    },
    {
      id: 'Title',
      label: 'Title',
      shortLabel: 'Title',
      group: 'description',
      rank: 11,
      description: 'Reusable title object for primary and alternative titles.',
      modellingNotes: [
        'The same title structure is shared by WorkVariant, Manifestation, and Item.',
        'The type slot is controlled by TitleTypeEnum.',
      ],
      controlledVocabularies: ['TitleTypeEnum'],
      slots: [
        {
          name: 'has_name',
          range: 'TextLine',
          kind: 'property',
          required: true,
          description: 'Human-readable title text.',
        },
        {
          name: 'has_ordering_name',
          range: 'TextLine',
          kind: 'property',
          description: 'Normalized title form for sorting when it differs from display text.',
        },
        {
          name: 'type',
          range: 'TitleTypeEnum',
          kind: 'controlledVocabulary',
          required: true,
          description: 'Controlled title type, such as preferred or supplied title.',
        },
      ],
    },
    {
      id: 'Event',
      label: 'Event',
      shortLabel: 'Event',
      group: 'event',
      rank: 15,
      abstract: true,
      description: 'Lifecycle event for a work, manifestation, or item.',
      modellingNotes: [
        'Events are abstract in the shared branch; concrete event classes refine has_activity and type.',
        'Production, preservation, publication, manufacture, and rights events constrain activity ranges differently.',
      ],
      controlledVocabularies: [
        'ProductionEventTypeEnum',
        'PreservationEventTypeEnum',
        'PublicationEventTypeEnum',
        'ManufactureEventTypeEnum',
      ],
      slots: [
        {
          name: 'has_activity',
          range: 'Activity',
          kind: 'relationship',
          multivalued: true,
          description: 'Associates activities and their agents with the event.',
        },
        {
          name: 'has_date',
          range: 'ISODate',
          kind: 'property',
          description: 'Date or interval when the event took place.',
        },
        {
          name: 'located_in',
          range: 'GeographicName',
          kind: 'relationship',
          multivalued: true,
          description: 'Location associated with the event.',
        },
      ],
    },
    {
      id: 'Activity',
      label: 'Activity',
      shortLabel: 'Activity',
      group: 'event',
      rank: 17,
      abstract: true,
      description: 'Role-bearing activity within an event.',
      modellingNotes: [
        'Activity connects an event to agents through has_agent.',
        'Concrete activity classes use FIAF-derived controlled vocabularies for roles.',
      ],
      controlledVocabularies: [
        'AnimationActivityTypeEnum',
        'CastActivityTypeEnum',
        'CinematographyActivityTypeEnum',
        'DirectingActivityTypeEnum',
        'EditingActivityTypeEnum',
        'ManifestationActivityTypeEnum',
        'ProducingActivityTypeEnum',
      ],
      slots: [
        {
          name: 'type',
          range: 'Activity type enum',
          kind: 'controlledVocabulary',
          required: true,
          description: 'Controlled activity role term.',
        },
        {
          name: 'has_agent',
          range: 'Agent',
          kind: 'relationship',
          required: true,
          multivalued: true,
          description: 'Agent involved in the activity.',
        },
      ],
    },
    {
      id: 'Agent',
      label: 'Agent',
      shortLabel: 'Agent',
      group: 'agent',
      rank: 18,
      aliases: ['Person', 'Organization', 'Family'],
      description: 'Person, family, or organization involved in an activity or used as a subject.',
      modellingNotes: [
        'Agents are reached from events through has_activity and has_agent.',
        'same_as supports authority links such as GND, VIAF, Wikidata, and Filmportal resources.',
      ],
      controlledVocabularies: ['AgentTypeEnum'],
      slots: [
        {
          name: 'has_name',
          range: 'TextLine',
          kind: 'property',
          required: true,
          description: 'Preferred display name. For natural persons, the schema expects family name, given name.',
        },
        {
          name: 'has_alternate_name',
          range: 'TextLine',
          kind: 'property',
          multivalued: true,
          description: 'Alternative names for indexing and matching.',
        },
        {
          name: 'same_as',
          range: 'AuthorityResource',
          kind: 'identifier',
          multivalued: true,
          anyOf: ['FilmportalResource', 'GNDResource', 'VIAFResource', 'WikidataResource'],
          description: 'Authority identifiers for the agent.',
        },
        {
          name: 'type',
          range: 'AgentTypeEnum',
          kind: 'controlledVocabulary',
          description: 'Controlled agent type.',
        },
      ],
    },
    {
      id: 'Genre',
      label: 'Genre',
      shortLabel: 'Genre',
      group: 'vocabulary',
      rank: 25,
      description: 'Genre descriptor for categories of works.',
      modellingNotes: [
        'Genre is distinct from Subject: genre describes categories with similar plots, themes, or settings.',
        'same_as is restricted to GNDResource in the current schema.',
      ],
      slots: [
        {
          name: 'has_name',
          range: 'TextLine',
          kind: 'property',
          required: true,
          description: 'Preferred genre label.',
        },
        {
          name: 'has_alternate_name',
          range: 'TextLine',
          kind: 'property',
          multivalued: true,
          description: 'Alternative genre labels.',
        },
        {
          name: 'same_as',
          range: 'GNDResource',
          kind: 'identifier',
          description: 'GND authority resource for the genre.',
        },
      ],
    },
    {
      id: 'Subject',
      label: 'Subject',
      shortLabel: 'Subject',
      group: 'vocabulary',
      rank: 23,
      description: 'Subject descriptors for film content, period, places, themes, people, or organizations.',
      modellingNotes: [
        'Subject is broader than Genre and can also be modelled as Agent or GeographicName through has_subject.',
        'same_as accepts several authority resource classes.',
      ],
      slots: [
        {
          name: 'has_name',
          range: 'TextLine',
          kind: 'property',
          required: true,
          description: 'Preferred subject label.',
        },
        {
          name: 'has_alternate_name',
          range: 'TextLine',
          kind: 'property',
          multivalued: true,
          description: 'Alternative subject labels.',
        },
        {
          name: 'same_as',
          range: 'AuthorityResource',
          kind: 'identifier',
          anyOf: ['AATResource', 'AVefiResource', 'EIDRResource', 'FilmportalResource', 'GNDResource', 'VIAFResource', 'WikidataResource'],
          description: 'Supported authority link for the subject.',
        },
      ],
    },
    {
      id: 'Language',
      label: 'Language',
      shortLabel: 'Language',
      group: 'vocabulary',
      rank: 21,
      aliases: ['Sprache'],
      description: 'Language object with ISO 639-2 code and controlled language usage.',
      modellingNotes: [
        'Language appears on item-level in_language and supports both a code and usage terms.',
        'usage is required and multivalued.',
      ],
      controlledVocabularies: ['LanguageCodeEnum', 'LanguageUsageEnum'],
      slots: [
        {
          name: 'code',
          range: 'LanguageCodeEnum',
          kind: 'controlledVocabulary',
          description: 'ISO 639-2 language code.',
        },
        {
          name: 'usage',
          range: 'LanguageUsageEnum',
          kind: 'controlledVocabulary',
          required: true,
          multivalued: true,
          description: 'Controlled language usage such as subtitles, intertitles, or spoken language.',
        },
      ],
    },
    {
      id: 'Format',
      label: 'Format',
      shortLabel: 'Format',
      group: 'vocabulary',
      rank: 31,
      abstract: true,
      description: 'Abstract branch for item format information.',
      modellingNotes: [
        'Concrete format subclasses include Audio, DigitalFile, DigitalFileEncoding, Film, Optical, and Video.',
        'Each concrete subclass constrains type to its own format vocabulary.',
      ],
      controlledVocabularies: [
        'FormatAudioTypeEnum',
        'FormatDigitalFileTypeEnum',
        'FormatDigitalFileEncodingTypeEnum',
        'FormatFilmTypeEnum',
        'FormatOpticalTypeEnum',
        'FormatVideoTypeEnum',
      ],
      slots: [
        {
          name: 'type',
          range: 'Format type enum',
          kind: 'controlledVocabulary',
          description: 'Controlled format type, constrained by concrete format subclass.',
        },
      ],
    },
    {
      id: 'Extent',
      label: 'Extent',
      shortLabel: 'Extent',
      group: 'description',
      rank: 35,
      aliases: ['Extent'],
      description: 'Physical length or size of the described object.',
      modellingNotes: [
        'Extent combines a numeric value, unit, and optional precision.',
      ],
      controlledVocabularies: ['UnitEnum', 'PrecisionEnum'],
      slots: [
        {
          name: 'has_value',
          range: 'Decimal',
          kind: 'property',
          required: true,
          description: 'Numeric value of the extent.',
        },
        {
          name: 'has_unit',
          range: 'UnitEnum',
          kind: 'controlledVocabulary',
          required: true,
          description: 'Controlled unit for the value.',
        },
        {
          name: 'has_precision',
          range: 'PrecisionEnum',
          kind: 'controlledVocabulary',
          description: 'Qualifier for precision.',
        },
      ],
    },
    {
      id: 'Duration',
      label: 'Duration',
      shortLabel: 'Duration',
      group: 'description',
      rank: 33,
      aliases: ['Running time'],
      description: 'Total running time in ISO 8601 duration format.',
      modellingNotes: [
        'Duration uses a value plus optional precision rather than a free text runtime.',
      ],
      controlledVocabularies: ['PrecisionEnum'],
      slots: [
        {
          name: 'has_value',
          range: 'ISODurationInHours',
          kind: 'property',
          description: 'ISO 8601 duration value.',
        },
        {
          name: 'has_precision',
          range: 'PrecisionEnum',
          kind: 'controlledVocabulary',
          description: 'Qualifier for precision.',
        },
      ],
    },
    {
      id: 'DescriptionResource',
      label: 'DescriptionResource',
      shortLabel: 'Issuer',
      group: 'identifier',
      description: 'Metadata about the PID record and the responsible issuer.',
      modellingNotes: [
        'This describes responsibility and history for the metadata record, not the film object itself.',
      ],
      slots: [
        {
          name: 'has_issuer_id',
          range: 'HttpUri',
          kind: 'identifier',
          required: true,
          description: 'Identifier for the responsible party.',
        },
        {
          name: 'has_issuer_name',
          range: 'TextLine',
          kind: 'property',
          required: true,
          description: 'Human-readable name of the issuer.',
        },
        {
          name: 'has_source_key',
          range: 'IDString',
          kind: 'identifier',
          multivalued: true,
          description: 'Original dataset or source identifier.',
        },
        {
          name: 'last_modified',
          range: 'ISODateTimeUTC',
          kind: 'property',
          description: 'Latest metadata modification timestamp.',
        },
      ],
    },
    {
      id: 'MovingImageResource',
      label: 'MovingImageResource',
      shortLabel: 'AVefi PID',
      group: 'identifier',
      description: 'Identifier resource for AVefi moving image records.',
      modellingNotes: [
        'Relationship slots such as is_manifestation_of, has_item, and is_item_of point to moving image resources rather than embedding full records.',
      ],
      slots: [
        {
          name: 'category',
          range: 'AVefiCurie',
          kind: 'identifier',
          required: true,
          description: 'Resource category, such as avefi:WorkVariant or avefi:Item.',
        },
        {
          name: 'id',
          range: 'IDString',
          kind: 'identifier',
          required: true,
          description: 'Persistent or local resource identifier.',
        },
      ],
    },
    {
      id: 'AuthorityResource',
      label: 'AuthorityResource',
      shortLabel: 'Authority',
      group: 'identifier',
      abstract: true,
      description: 'Abstract identifier branch for authority resources such as GND, DOI, VIAF, or Wikidata.',
      modellingNotes: [
        'same_as and related slots constrain this branch depending on class context.',
        'GND resources are especially important for Genre, Subject, Agent, and authority-linked entities.',
      ],
      slots: [
        {
          name: 'category',
          range: 'AVefiCurie',
          kind: 'identifier',
          required: true,
          description: 'Authority resource type.',
        },
        {
          name: 'id',
          range: 'IDString',
          kind: 'identifier',
          required: true,
          description: 'Identifier in the authority system.',
        },
      ],
    },
  ],
  edges: [
    {
      id: 'work-manifestation',
      source: 'WorkVariant',
      target: 'Manifestation',
      slot: 'is_manifestation_of',
      kind: 'spine',
      required: true,
      multivalued: true,
      description: 'Manifestation points to at least one WorkVariant through is_manifestation_of.',
    },
    {
      id: 'manifestation-item',
      source: 'Manifestation',
      target: 'Item',
      slot: 'has_item / is_item_of',
      kind: 'spine',
      required: true,
      multivalued: true,
      description: 'Manifestation lists items with has_item; each item points back with is_item_of.',
    },
    {
      id: 'work-work-variant',
      source: 'WorkVariant',
      target: 'WorkVariant',
      slot: 'is_variant_of',
      kind: 'relationship',
      description: 'A WorkVariant can reference another WorkVariant as its reference work.',
    },
    {
      id: 'work-part-of',
      source: 'WorkVariant',
      target: 'MovingImageResource',
      slot: 'is_part_of',
      kind: 'relationship',
      multivalued: true,
      description: 'A WorkVariant can belong to a larger moving image resource such as a series.',
    },
    {
      id: 'item-copy-of',
      source: 'Item',
      target: 'Item',
      slot: 'is_copy_of',
      kind: 'relationship',
      multivalued: true,
      description: 'An Item can link to another item known to be a copy.',
    },
    {
      id: 'item-derivative-of',
      source: 'Item',
      target: 'Item',
      slot: 'is_derivative_of',
      kind: 'relationship',
      multivalued: true,
      description: 'An Item can link to another item from which it was derived.',
    },
    {
      id: 'record-title',
      source: 'WorkVariant',
      target: 'Title',
      slot: 'has_primary_title / has_alternative_title',
      kind: 'shared',
      multivalued: true,
      description: 'Title objects are reused across the moving image record levels.',
    },
    {
      id: 'record-event',
      source: 'WorkVariant',
      target: 'Event',
      slot: 'has_event',
      kind: 'event',
      multivalued: true,
      description: 'Works, manifestations, and items can carry lifecycle events.',
    },
    {
      id: 'event-activity',
      source: 'Event',
      target: 'Activity',
      slot: 'has_activity',
      kind: 'event',
      multivalued: true,
      description: 'Events hold activities, which specify roles.',
    },
    {
      id: 'activity-agent',
      source: 'Activity',
      target: 'Agent',
      slot: 'has_agent',
      kind: 'event',
      required: true,
      multivalued: true,
      description: 'Activities connect to agents involved in the event.',
    },
    {
      id: 'work-genre',
      source: 'WorkVariant',
      target: 'Genre',
      slot: 'has_genre',
      kind: 'vocabulary',
      multivalued: true,
      description: 'WorkVariant uses Genre for categorical work descriptors.',
    },
    {
      id: 'work-subject',
      source: 'WorkVariant',
      target: 'Subject',
      slot: 'has_subject',
      kind: 'vocabulary',
      multivalued: true,
      description: 'WorkVariant uses Subject for content descriptors.',
    },
    {
      id: 'item-format',
      source: 'Item',
      target: 'Format',
      slot: 'has_format',
      kind: 'vocabulary',
      multivalued: true,
      description: 'Item format is represented through the abstract Format branch and concrete subclasses.',
    },
    {
      id: 'item-language',
      source: 'Item',
      target: 'Language',
      slot: 'in_language',
      kind: 'vocabulary',
      multivalued: true,
      description: 'Item language metadata links to Language objects.',
    },
    {
      id: 'item-extent',
      source: 'Item',
      target: 'Extent',
      slot: 'has_extent',
      kind: 'shared',
      description: 'Item can describe physical length or size through Extent.',
    },
    {
      id: 'item-duration',
      source: 'Item',
      target: 'Duration',
      slot: 'has_duration',
      kind: 'shared',
      description: 'Item can describe running time through Duration.',
    },
    {
      id: 'record-authority',
      source: 'WorkVariant',
      target: 'AuthorityResource',
      slot: 'same_as / has_identifier',
      kind: 'authority',
      multivalued: true,
      description: 'Moving image record levels connect to PID and authority resources.',
    },
    {
      id: 'agent-authority',
      source: 'Agent',
      target: 'AuthorityResource',
      slot: 'same_as',
      kind: 'authority',
      multivalued: true,
      description: 'Agents can link to Filmportal, GND, VIAF, and Wikidata resources.',
    },
    {
      id: 'genre-gnd',
      source: 'Genre',
      target: 'AuthorityResource',
      slot: 'same_as',
      kind: 'authority',
      description: 'Genre same_as is restricted to GNDResource.',
    },
    {
      id: 'record-description',
      source: 'WorkVariant',
      target: 'DescriptionResource',
      slot: 'described_by',
      kind: 'authority',
      description: 'Records can include issuer and PID metadata through described_by.',
    },
  ],
  vocabularyGroups: [
    {
      id: 'work-vocabularies',
      label: 'Work-level vocabularies',
      appliesTo: ['WorkVariant'],
      enumNames: ['WorkVariantTypeEnum', 'VariantTypeEnum', 'WorkFormEnum'],
      description: 'Controlled terms that classify work variants, variant type, and form.',
    },
    {
      id: 'event-activity-vocabularies',
      label: 'Event and activity vocabularies',
      appliesTo: ['Event', 'Activity'],
      enumNames: [
        'ProductionEventTypeEnum',
        'PreservationEventTypeEnum',
        'PublicationEventTypeEnum',
        'ManufactureEventTypeEnum',
        'DirectingActivityTypeEnum',
        'CastActivityTypeEnum',
        'ManifestationActivityTypeEnum',
      ],
      description: 'FIAF-oriented event and role vocabularies used to describe lifecycle context and involved agents.',
    },
    {
      id: 'item-vocabularies',
      label: 'Item-level vocabularies',
      appliesTo: ['Item', 'Format', 'Language', 'Extent', 'Duration'],
      enumNames: [
        'ItemAccessStatusEnum',
        'ItemElementTypeEnum',
        'FormatFilmTypeEnum',
        'FormatVideoTypeEnum',
        'FormatDigitalFileTypeEnum',
        'LanguageCodeEnum',
        'LanguageUsageEnum',
        'UnitEnum',
        'PrecisionEnum',
      ],
      description: 'Controlled terms for concrete holdings, language, format, dimensions, duration, and access.',
    },
    {
      id: 'authority-vocabularies',
      label: 'Authority resource classes',
      appliesTo: ['AuthorityResource', 'MovingImageResource', 'Agent', 'Genre', 'Subject'],
      enumNames: ['GNDResource', 'VIAFResource', 'WikidataResource', 'FilmportalResource', 'DOIResource', 'EIDRResource', 'AVefiResource'],
      description: 'Identifier resource classes used by same_as, has_identifier, and relationship slots.',
    },
  ],
};

export function getSchemaClassById(id: SchemaClassId): SchemaClass {
  const schemaClass = schemaExplorerModel.classes.find((item) => item.id === id);
  if (!schemaClass) {
    throw new Error(`Unknown schema class: ${id}`);
  }
  return schemaClass;
}

export function getSchemaStats(model: SchemaExplorerModel = schemaExplorerModel) {
  return {
    classes: model.classes.length,
    relationships: model.edges.length,
    requiredSlots: model.classes.flatMap((schemaClass) => schemaClass.slots).filter((slot) => slot.required).length,
    vocabularyGroups: model.vocabularyGroups.length,
  };
}

export function getEdgesForClass(id: SchemaClassId, model: SchemaExplorerModel = schemaExplorerModel): SchemaEdge[] {
  return model.edges.filter((edge) => edge.source === id || edge.target === id);
}

export function getRequiredSlots(schemaClass: SchemaClass): SchemaSlot[] {
  return schemaClass.slots.filter((slot) => slot.required);
}

export function getControlledVocabularySlots(schemaClass: SchemaClass): SchemaSlot[] {
  return schemaClass.slots.filter((slot) => slot.kind === 'controlledVocabulary');
}

export function searchSchemaClasses(query: string, model: SchemaExplorerModel = schemaExplorerModel): SchemaClass[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return model.classes;
  }

  return model.classes.filter((schemaClass) => {
    const haystack = [
      schemaClass.id,
      schemaClass.label,
      schemaClass.shortLabel,
      schemaClass.description,
      ...(schemaClass.aliases ?? []),
      ...(schemaClass.controlledVocabularies ?? []),
      ...schemaClass.slots.flatMap((slot) => [
        slot.name,
        slot.range,
        slot.description,
        ...(slot.anyOf ?? []),
      ]),
      ...schemaClass.modellingNotes,
    ].join(' ').toLowerCase();

    return haystack.includes(normalized);
  });
}

export function formatSlotRange(slot: SchemaSlot): string {
  if (slot.anyOf?.length) {
    return `${slot.range} (${slot.anyOf.join(' | ')})`;
  }
  return slot.range;
}
