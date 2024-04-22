/* eslint-disable camelcase */
//import type IAVefiWork from '../models/interfaces/IAVefiWork';
import { fakerDE as faker } from '@faker-js/faker';
import * as fs from 'fs';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { IAVefiListResponse } from "../models/interfaces/IAVefiWork";
import type { IAVefiData } from "../models/interfaces/IAVefiWork";

const generateRandomJsonObject = (): IAVefiData => {
    // Generate random data for each field based on the interfaces
    const id = faker.number.int();
    const createdAt = faker.date.recent().toISOString();
    const updatedAt = faker.date.recent().toISOString();
    const publishedAt = faker.date.recent().toISOString();

    const locale = faker.helpers.arrayElement(['en', 'de', 'fr']);
    const countryOfReference = faker.helpers.arrayElement(['DE', 'US', 'UK', 'FR', 'RU']);
    const relatedIdentifier = faker.lorem.words();
    const lastModified = faker.date.recent().toISOString();

    const seriesTitle = faker.lorem.words();
    const seriesIdentifier = faker.lorem.word();

    const productionCompanyName = faker.company.name();
    const productionCompanyIdentifier = faker.lorem.word();
    const originalDuration = `${faker.number.int({ min: 1, max: 120 })}:${faker.number.int({ min: 0, max: 59 })}`;
    const genre = Array.from({ length: Math.floor(Math.random() * 10 + 1) }, () => ({
        id: faker.number.int(),
        GenreName: faker.helpers.arrayElement([
            "Amateur Film",
            "Animation",
            "Animation with Live Action",
            "Non Fiction",
            "Documentary Drama",
            "Anthology Film",
            "Essay Film",
            "Experimental Film",
            "Home Movie",
            "Industrial Film",
            "Compilation Film",
            "Short Film",
            "Educational Film",
            "Music Video",
            "Propaganda Film",
            "Fiction",
            "Trailer",
            "Advertising Film",
            "Newsreel"
        ]),
    }));
    const sourceName = faker.company.name();
    const sourceIdentifier = faker.lorem.word();
    const sourceAttribution = faker.lorem.sentence();
    const sourceAttributionDate = faker.date.recent().toISOString();
    const sourceAttributionType = faker.helpers.arrayElement(['Created', 'Modified', 'Attributed']);
    const subjectDe = faker.lorem.words();
    const subjectEn = faker.lorem.words();
    const refAAT = faker.lorem.word();
    const refGND = faker.lorem.word();
    const localizations = Array.from({ length: Math.random() * 5 + 1 }, (_, i) => ({
        id: i,
        attributes: {
            Title: faker.lorem.words(),
            createdAt: faker.date.recent().toISOString(),
            updatedAt: faker.date.recent().toISOString(),
            publishedAt: faker.date.recent().toISOString(),
            locale: faker.helpers.arrayElement(['en', 'de']),
            CountryOfReference: faker.helpers.arrayElement(['DE', 'US', 'UK']),
            RelatedIdentifier: faker.lorem.words(),
            LastModified: faker.date.recent().toISOString(),
        },
    }));

    // Additional attributes
    const yearOfReference = Array.from({ length: Math.random() * 3 + 1 }, () => ({
        id: faker.number.int(),
        yearOfReferenceDate: faker.date.recent().toISOString(),
        yearOfReferenceStart: faker.number.int({ min: 1900, max: 2022 }),
        yearOfReferenceEnd: faker.number.int({ min: 1900, max: 2022 }),
        yearOfReferenceType: faker.helpers.arrayElement(["Copyrighted", "Created", "Issued"])
    }));

    const seriesData = [{
        id: faker.number.int(),
        attributes: {
            SeriesTitle: seriesTitle,
            createdAt,
            updatedAt,
            publishedAt: null,
            SeriesIdentifier: seriesIdentifier,
            SeriesTitleType: faker.helpers.arrayElement([
                "Original Title",
                "Release Title",
                "Archive Title",
                "Alternative Title",
                "Sort Title"
            ]),
        },
    }];

    const productionCompanyDataId = faker.number.int();
    const productionCompanyData = {
        ProductionCompanyName: productionCompanyName,
        ProductionCompanyIdentifier: productionCompanyIdentifier,
        createdAt,
        updatedAt,
        publishedAt: null,
    };

    const schemaVersion = [{
        id: faker.number.int(),
        VersionName: "avefi",
        VersionNumber: faker.number.int(),
    }];

    const titleType = { id: faker.number.int(), TitleTypeName: faker.lorem.word() };

    // Construct the JSON object
    const jsonObject: IAVefiData = {
        id: id,
        attributes: {
            Title: faker.lorem.words(),
            createdAt,
            updatedAt,
            publishedAt,
            locale,
            CountryOfReference: countryOfReference,
            RelatedIdentifier: relatedIdentifier,
            LastModified: lastModified,
            YearOfReference: yearOfReference,
            Series: { data: seriesData },
            Cast: {
                data: Array.from({ length: Math.floor(Math.random() * 20) + 1 }, () => {
                    const castFirstName = faker.person.firstName();
                    const castLastName = faker.person.lastName();
                    return {
                        id: faker.number.int(),
                        attributes: {
                            CastFirstName: castFirstName,
                            CastLastName: castLastName,
                            CastName: `${castFirstName} ${castLastName}`,
                            CastIdentifier: faker.lorem.word(),
                            createdAt: faker.date.recent().toISOString(),
                            updatedAt: faker.date.recent().toISOString(),
                        }
                    };
                })
            },
            Credits: {
                data: Array.from({ length: Math.floor(Math.random() * 10) + 1 }, () => {
                    const creditsFirstName = faker.person.firstName();
                    const creditsLastName = faker.person.lastName();
                    return {
                        id: faker.number.int(),
                        attributes: {
                            CreditsFirstName: creditsFirstName,
                            CreditsLastName: creditsLastName,
                            CreditsName: `${creditsFirstName} ${creditsLastName}`,
                            CreditsRole: faker.helpers.arrayElement([
                                "Unspecified Value",
                                "Assistant Camera Operator",
                                "2nd Unit Director",
                                "2nd Unit Director of Photography",
                                "Adaptation",
                                "Animation",
                                "Art Director",
                                "Artistic Direction",
                                "Assistant",
                                "Assistant Art Direction",
                                "Assistant Camera Operator",
                                "Assistant Director",
                                "Assistant Editor",
                                "Assistant Set Designer",
                                "Associate producer",
                                "Casting Director",
                                "Caterer",
                                "Chief Lighting Technician",
                                "Choreographer",
                                "Clapper Loader",
                                "Commentary",
                                "Compilation",
                                "Consultant",
                                "Continuity",
                                "Costume Design",
                                "Director",
                                "Director of Photography",
                                "Editor",
                                "Executive Producer",
                                "Film Funding",
                                "Foley Artist",
                                "Gowns by",
                                "Host",
                                "Idea",
                                "Lamp Operator",
                                "Line Producer",
                                "Location Scout",
                                "Make Up",
                                "Musical direction",
                                "Narration",
                                "Negative Cutter",
                                "Pre Production Design",
                                "Producer",
                                "Production Assistant",
                                "Production Design",
                                "Props",
                                "Researcher",
                                "Screenplay",
                                "Set Decorator",
                                "Set Decorator",
                                "Set Designer",
                                "Singing Voice",
                                "Sound",
                                "Sound Assistant",
                                "Sound Design",
                                "Sound Editor",
                                "Sound Recordist",
                                "Source Material",
                                "Special Effects",
                                "Special Effects Camera",
                                "Steadicam Operator",
                                "Still Photography",
                                "Stock Footage",
                                "Storyboard Artist",
                                "Stunt Coordinator",
                                "Title Design",
                                "TV Director",
                                "Visual Effects"
                            ]),
                            CreditsIdentifier: faker.lorem.word(),
                            createdAt: faker.date.recent().toISOString(),
                            updatedAt: faker.date.recent().toISOString(),
                        }
                    };
                })
            },
            ProductionCompany: {
                data: { id: productionCompanyDataId, attributes: productionCompanyData }
            },
            OriginalFormat: { id: faker.number.int() },
            FirstKnownManifestation: {
                id: faker.number.int(),
                OriginalLength: faker.number.int(),
                OriginalLengthUnit: faker.lorem.word(),
                OriginalDuration: originalDuration,
            },
            Genre: genre,
            Source: {
                data: {
                    id,
                    attributes: {
                        SourceName: sourceName,
                        SourceIdentifier: sourceIdentifier,
                        SourceAttribution: sourceAttribution,
                        SourceAttributionDate: sourceAttributionDate,
                        SourceAttributionType: sourceAttributionType,
                        createdAt,
                        updatedAt,
                    },
                },
            },
            Subject: {
                data: [
                    {
                        id,
                        attributes: {
                            LangDe: subjectDe,
                            LangEn: subjectEn,
                            ref_AAT: refAAT,
                            ref_GND: refGND,
                            createdAt,
                            updatedAt,
                            locale,
                        },
                    },
                ],
            },
            SchemaVersion: schemaVersion,
            TitleType: titleType,
            localizations: { data: localizations },
        },
    };

    return jsonObject;
};

const createRandomDataJson = ((length: number) => {

    // Generate random JSON objects
    const jsonArray: IAVefiListResponse = { data: [], meta: {} } as IAVefiListResponse;
    for (let i = 0; i < length; i++) {
        const randomJsonObject = generateRandomJsonObject();
        jsonArray?.data.push(randomJsonObject);
    }

    // Convert array of JSON objects to a string
    const jsonString = JSON.stringify(jsonArray, null, 2);
    // Write JSON string to a file

    fs.writeFile(`./models/sampleData/random_iavefiwork_${length}.json`, jsonString, (err) => {
        if (err) {
            console.error('Error writing JSON file:', err);
        } else {
            console.log('JSON file has been saved!');
        }
    });
});

createRandomDataJson(500);