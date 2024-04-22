interface YearOfReference {
    id: number;
    yearOfReferenceDate: string;
    yearOfReferenceStart: number;
    yearOfReferenceEnd: number;
    yearOfReferenceType: string;
}

interface SeriesDataAttributes {
    SeriesTitle: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    SeriesIdentifier: string;
    SeriesTitleType: string;
}

interface SeriesData {
    id: number;
    attributes: SeriesDataAttributes;
}

interface CastDataAttributes {
    CastName: string;
    CastFirstName: string;
    CastLastName: string;
    CastIdentifier: string;
    createdAt: string;
    updatedAt: string;
}

interface CastData {
    id: number;
    attributes: CastDataAttributes;
}

interface CreditsDataAttributes {
    CreditsName: string;
    CreditsFirstName: string;
    CreditsLastName: string;
    CreditsIdentifier: string;
    createdAt: string;
    updatedAt: string;
}

interface CreditsData {
    id: number;
    attributes: CreditsDataAttributes;
}


interface ProductionCompanyDataAttributes {
    ProductionCompanyName: string;
    ProductionCompanyIdentifier: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
}

interface ProductionCompanyData {
    id: number;
    attributes: ProductionCompanyDataAttributes;
}

interface Genre {
    id: number;
    GenreName: string;
}

interface SourceDataAttributes {
    SourceName: string;
    SourceIdentifier: string;
    SourceAttribution: string;
    SourceAttributionDate: string;
    SourceAttributionType: string;
    createdAt: string;
    updatedAt: string;
}

interface SourceData {
    id: number;
    attributes: SourceDataAttributes;
}

interface SubjectDataAttributes {
    LangDe: string;
    LangEn: string;
    ref_AAT: string;
    ref_GND: string;
    createdAt: string;
    updatedAt: string;
    locale: string;
}

interface SubjectData {
    id: number;
    attributes: SubjectDataAttributes;
}

interface SchemaVersion {
    id: number;
    VersionName: string;
    VersionNumber: number;
}

interface LocalizationDataAttributes {
    Title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    CountryOfReference: string;
    RelatedIdentifier: string;
    LastModified: string;
}

interface LocalizationData {
    id: number;
    attributes: LocalizationDataAttributes;
}

interface IDataAttributes {
    Title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    CountryOfReference: string;
    RelatedIdentifier: string;
    LastModified: string;
    YearOfReference: YearOfReference[];
    Series: { data: SeriesData[] };
    Cast: { data: CastData[] };
    Credits: { data: CreditsData[] };
    ProductionCompany: { data: ProductionCompanyData };
    OriginalFormat: { id: number };
    FirstKnownManifestation: {
        id: number;
        OriginalLength: number;
        OriginalLengthUnit: string;
        OriginalDuration: string;
    };
    Genre: Genre[];
    Source: { data: SourceData };
    Subject: { data: SubjectData[] };
    SchemaVersion: SchemaVersion[];
    TitleType: { id: number; TitleTypeName: string };
    localizations: { data: LocalizationData[] };
}

export interface IDataAttributesWork extends IDataAttributes {
    Title: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
    CountryOfReference: string;
    RelatedIdentifier: string;
    LastModified: string;
    YearOfReference: YearOfReference[];
    Series: { data: SeriesData[] };
    Cast: { data: CastData[] };
    Credits: { data: CreditsData[] };
    ProductionCompany: { data: ProductionCompanyData };
    OriginalFormat: { id: number };
    FirstKnownManifestation: {
        id: number;
        OriginalLength: number;
        OriginalLengthUnit: string;
        OriginalDuration: string;
    };
    Genre: Genre[];
    Source: { data: SourceData };
    Subject: { data: SubjectData[] };
    SchemaVersion: SchemaVersion[];
    TitleType: { id: number; TitleTypeName: string };
    localizations: { data: LocalizationData[] };
}

export interface IAVefiData {
    id: number;
    attributes: IDataAttributes;
}

export interface Meta { }

export interface IAVefiSingleResponse {
    data: IAVefiData;
    meta: Meta;
}

export interface IAVefiListResponse {
    data: IAVefiData[];
    meta: Meta;
}