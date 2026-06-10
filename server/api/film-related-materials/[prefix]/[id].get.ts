import { defineEventHandler } from 'h3';
import { HARD_CODED_DATA } from '~/server/data/film-related-materials';

export default defineEventHandler((event) => {
  const prefix = event.context.params?.prefix;
  const id = event.context.params?.id;

  if (!prefix || !id) {
    return {
      statusCode: 400,
      body: {
        error: 'Missing required parameters: prefix and id'
      }
    };
  }

  const workVariantId = `${prefix}/${id}`;
  const data = HARD_CODED_DATA[workVariantId];

  if (data) {
    return {
      statusCode: 200,
      body: {
        success: true,
        workVariant: {
          title: data.title,
          handle: data.handle,
          url: data.url
        },
        materials: data.materials
      }
    };
  } 
  return {
    statusCode: 404,
    body: {
      success: false,
      error: 'No film-related materials found for this work variant'
    }
  };
  
});

// Hard-coded data for the two specific work variants
export const HARD_CODED_DATA = {
  "21.11155/7E2ABF44-85D2-4704-AF29-0331974A16FF": {
    title: "Marlene Dietrich Home Movies",
    handle: "21.11155/7E2ABF44-85D2-4704-AF29-0331974A16FF",
    url: "https://www.av-efi.net/res/21.11155/7E2ABF44-85D2-4704-AF29-0331974A16FF",
    materials: [
      {
        "has_record": {
          "category": "avefi:FilmRelatedMaterial",
          "described_by": {
            "has_issuer_id": "https://w3id.org/isil/DE-MUS-407010",
            "has_issuer_name": "Deutsche Kinemathek - Museum für Film und Fernsehen",
            "has_source_key": ["5969"]
          },
          "has_primary_title": {
            "has_name": "E.A. SWISS LOCATION STILLS",
            "type": "PreferredTitle"
          },
          "is_related_to_work": [
            {
              "category": "avefi:AVefiResource",
              "id": "21.11155/7E2ABF44-85D2-4704-AF29-0331974A16FF"
            }
          ],
          "has_event": [
            {
              "category": "avefi:ProductionEvent",
              "has_date": "1951",
              "located_in": [
                {
                  "category": "avefi:GeographicName",
                  "has_name": "Vereinigte Staaten von Amerika",
                  "same_as": [
                    {
                      "category": "avefi:GNDResource",
                      "id": "4078704-7"
                    },
                    {
                      "category": "avefi:TGNResource",
                      "id": "7012149"
                    }
                  ]
                }
              ]
            }
          ],
          "has_inventory_number": [
            {
              "category": "avefi:LocalResource",
              "id": "SDK_4.6_201216_N8261_960"
            }
          ],
          "has_note": [
            "beinhaltet 58 Objekte (Reproduktionen) / keine Originale/Varianten im Inventar vorhanden"
          ],
          "type": "Set"
        },
        "kip": "http://typeapi.lab.pidconsortium.net/v1/types/schema/21.T11969/873d5c9f6ebbffecf1df",
        "handle": "21.11155/9C6DA601-C678-4C66-9A6B-0E9AD69D8086",
        "url": "https://www.av-efi.net/res/21.11155/9C6DA601-C678-4C66-9A6B-0E9AD69D8086",
        "@timestamp": 1776954384689
      },
      {
        "has_record": {
          "category": "avefi:FilmRelatedMaterial",
          "described_by": {
            "has_issuer_id": "https://w3id.org/isil/DE-MUS-432511",
            "has_issuer_name": "Digitales Kunst- und Kulturarchiv Düsseldorf",
            "has_source_key": ["993330"]
          },
          "has_primary_title": {
            "has_name": "Rosi S.M. \"Es gibt nicht viele wunderbare Frauen\"",
            "type": "PreferredTitle"
          },
          "is_related_to_work": [
            {
              "category": "avefi:AVefiResource",
              "id": "21.11155/7E2ABF44-85D2-4704-AF29-0331974A16FF"
            }
          ],
          "has_object_category": ["Poster"],
          "has_subject": [
            {
              "category": "avefi:Person",
              "has_name": "S.M., Rosi",
              "same_as": [
                {
                  "category": "avefi:GNDResource",
                  "id": "1062098153"
                }
              ]
            }
          ],
          "has_event": [
            {
              "category": "avefi:ProductionEvent",
              "has_date": "1980~"
            }
          ],
          "has_inventory_number": [
            {
              "category": "avefi:LocalResource",
              "id": "FM.SLG.ROSISM 12"
            }
          ],
          "has_material": ["Papier"],
          "has_note": [
            "Plakat über Rosi S.M. mit einem Spruch \"Es gibt nicht viele wunderbare Frauen\""
          ],
          "type": "Poster"
        },
        "kip": "http://typeapi.lab.pidconsortium.net/v1/types/schema/21.T11969/873d5c9f6ebbffecf1df",
        "handle": "21.11155/F3A8C2D9-4E6B-4A1F-9B72-1C5E8A4D0F91",
        "url": "https://www.av-efi.net/res/21.11155/F3A8C2D9-4E6B-4A1F-9B72-1C5E8A4D0F91",
        "@timestamp": 1776954384689
      }
    ]
  },
  "21.11155/67A5228A-7C57-4EEA-A75B-2FD499D642FA": {
    title: "The Scarlet Empress",
    handle: "21.11155/67A5228A-7C57-4EEA-A75B-2FD499D642FA",
    url: "https://www.av-efi.net/res/21.11155/67A5228A-7C57-4EEA-A75B-2FD499D642FA",
    materials: [
      {
        "has_record": {
          "category": "avefi:FilmRelatedMaterial",
          "described_by": {
            "has_issuer_id": "https://w3id.org/isil/DE-MUS-407010",
            "has_issuer_name": "Deutsche Kinemathek - Museum für Film und Fernsehen",
            "has_source_key": ["12044"]
          },
          "has_primary_title": {
            "has_name": "Abendkleid mit Schößchen aus Leopardenpelz",
            "type": "SuppliedDevisedTitle"
          },
          "is_related_to_work": [
            {
              "category": "avefi:AVefiResource",
              "id": "21.11155/67A5228A-7C57-4EEA-A75B-2FD499D642FA"
            }
          ],
          "has_object_category": ["Costume"],
          "has_subject": [
            {
              "category": "avefi:Subject",
              "has_name": "Kostüm",
              "same_as": [
                {
                  "category": "avefi:GNDResource",
                  "id": "4114219-6"
                }
              ]
            },
            {
              "category": "avefi:Subject",
              "has_name": "Kostüm (Kleidung)"
            },
            {
              "category": "avefi:Subject",
              "has_name": "Abendkleid"
            }
          ],
          "has_event": [
            {
              "category": "avefi:ProductionEvent",
              "has_date": "1930~/1949~",
              "has_activity": [
                {
                  "category": "avefi:ProductionDesignActivity",
                  "has_agent": [
                    {
                      "category": "avefi:Agent",
                      "has_name": "Molineux, Edward",
                      "type": "Person"
                    }
                  ],
                  "type": "CostumeMaker"
                }
              ],
              "located_in": [
                {
                  "category": "avefi:GeographicName",
                  "has_name": "Frankreich",
                  "same_as": [
                    {
                      "category": "avefi:GNDResource",
                      "id": "4018145-5"
                    },
                    {
                      "category": "avefi:TGNResource",
                      "id": "1000070"
                    }
                  ]
                }
              ]
            }
          ],
          "has_inventory_number": [
            {
              "category": "avefi:LocalResource",
              "id": "E-70171"
            }
          ],
          "has_note": [
            "Maria Riva schreibt das Kleid in der Kartei von Sotheby's Irene, 40er Jahre zu. Im Buch \"Marlene Dietrich\" von Naudet u. Riva wird das Kleid zu einer Schöpfung von Molineux aus den 30er Jahren erklärt (S. 141)"
          ],
          "type": "Set"
        },
        "kip": "http://typeapi.lab.pidconsortium.net/v1/types/schema/21.T11969/873d5c9f6ebbffecf1df",
        "handle": "21.11155/EDF2287C-9F77-4BB8-A14F-45874038F589",
        "url": "https://www.av-efi.net/res/21.11155/EDF2287C-9F77-4BB8-A14F-45874038F589",
        "@timestamp": 1776954384689
      }
    ]
  }
};