<template>
  <div class="w-full">
    <div class="">
      <section>
        <h2 class="text-2xl font-bold mb-4">
          Editor
        </h2>
        <div class="flex flex-row w-full">
          <div class="w-1/2 p-4 editor mt-8">
            <h3 class="text-xl mb-4">
              #1
            </h3>
            <textarea
              v-if="text1"
              v-model="text1"
              class="p-2 rounded-lg border-2 border-gray-500 w-full min-h-96"
            />
          </div>
          <div class="w-1/2 p-4 editor mt-8">
            <h3 class="text-xl mb-4">
              #2
            </h3>
            <textarea
              v-if="text2"
              v-model="text2"
              class="p-2 rounded-lg border-2 border-gray-500 w-full min-h-96"
            />
          </div>
        </div>
      </section>
    </div>
  </div>

  <div class="viewer">
    <div class="flex flex-row flex-wrap">
      <section class="mt-8 min-h-96 bg-neutral-100 dark:bg-neutral-900 p-4 w-1/2">
        <label>Diff:</label>
        <pre
          v-if="ds"
          wrap
          v-html="ds"
        />
      </section>
      <section class="mt-8 min-h-96 bg-neutral-100 dark:bg-neutral-900 p-4 w-1/2">
        <label>HighlightJS:</label>
        <pre
          v-if="highlightedCode"
          class="bg-neutral-800 text-white"
          v-html="highlightedCode"
        />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
//cf. https://neil.fraser.name/software/diff_match_patch/demos/diff.html
import { DiffMatchPatch } from "diff-match-patch-ts";
import type {IAVefiSingleResponse} from '../../models/interfaces/IAVefiWork';
import hljs from 'highlight.js/lib/core';
import json from 'highlight.js/lib/languages/json';
import 'highlight.js/styles/stackoverflow-dark.min.css';
import { refresh } from "@formkit/icons";
hljs.registerLanguage('json', json);

const props = defineProps({
    'items': {
        type: Array,
        required:true,
        default: () => []
    }
});

const dmp = new DiffMatchPatch();
/*
const text1 = JSON.stringify({
    "data": {
        "id": 1,
        "attributes": {
            "Title": "Test Work Title",
            "createdAt": "2024-02-20T15:24:57.333Z",
            "updatedAt": "2024-03-21T16:43:27.663Z",
            "publishedAt": "2024-02-20T16:04:33.002Z",
            "locale": "de",
            "CountryOfReference": "DE",
            "RelatedIdentifier": "Test Related Identifier",
            "LastModified": "2024-02-21T00:00:00.000Z",
            "seoshared": [],
            "YearOfReference": [
                {
                    "id": 11,
                    "yearOfReferenceDate": "2024-01-01",
                    "yearOfReferenceStart": 2024,
                    "yearOfReferenceEnd": 2024,
                    "yearOfReferenceType": "Copyrighted"
                },
                {
                    "id": 12,
                    "yearOfReferenceDate": "2024-01-01",
                    "yearOfReferenceStart": 2024,
                    "yearOfReferenceEnd": 2024,
                    "yearOfReferenceType": "Copyrighted"
                }
            ],
            "Series": {
                "data": [
                    {
                        "id": 1,
                        "attributes": {
                            "SeriesTitle": "Test Series",
                            "createdAt": "2024-02-22T15:48:02.925Z",
                            "updatedAt": "2024-02-22T15:48:02.925Z",
                            "publishedAt": null,
                            "SeriesIdentifier": "Test Series Identifier",
                            "SeriesTitleType": "Original Title"
                        }
                    }
                ]
            },
            "Cast": {
                "data": [
                    {
                        "id": 4,
                        "attributes": {
                            "CastName": "Test CastName 1",
                            "CastFirstName": "Test Cast First Name 1",
                            "CastLastName": "Test Cast Last Name 1",
                            "CastIdentifier": "Test Cast Identifier 1",
                            "createdAt": "2024-02-22T15:57:28.543Z",
                            "updatedAt": "2024-02-22T15:57:28.543Z"
                        }
                    }
                ]
            },
            "ProductionCompany": {
                "data": {
                    "id": 1,
                    "attributes": {
                        "ProductionCompanyName": "Test Production Company Name",
                        "ProductionCompanyIdentifier": "Test Production Company Identifer",
                        "createdAt": "2024-02-22T15:48:26.044Z",
                        "updatedAt": "2024-02-22T15:48:26.044Z",
                        "publishedAt": null
                    }
                }
            },
            "OriginalFormat": {
                "id": 4
            },
            "FirstKnownManifestation": {
                "id": 5,
                "OriginalLength": 7,
                "OriginalLengthUnit": "Meters",
                "OriginalDuration": "55:33"
            },
            "Genre": [
                {
                    "id": 14,
                    "GenreName": "Animation with Live Action"
                },
                {
                    "id": 15,
                    "GenreName": "Documentary Drama"
                },
                {
                    "id": 16,
                    "GenreName": "Advertising Film"
                },
                {
                    "id": 17,
                    "GenreName": "Animation with Live Action"
                },
                {
                    "id": 18,
                    "GenreName": "Documentary Drama"
                },
                {
                    "id": 19,
                    "GenreName": "Advertising Film"
                }
            ],
            "Source": {
                "data": {
                    "id": 1,
                    "attributes": {
                        "SourceName": "Test Source Name",
                        "SourceIdentifier": "Test Source Identifier",
                        "SourceAttribution": "attribution",
                        "SourceAttributionDate": "2024-01-28",
                        "SourceAttributionType": "Created",
                        "createdAt": "2024-02-21T15:52:51.545Z",
                        "updatedAt": "2024-02-22T15:50:49.034Z"
                    }
                }
            },
            "Subject": {
                "data": [
                    {
                        "id": 70,
                        "attributes": {
                            "LangDe": "Test Subject De",
                            "LangEn": "Test Subject En",
                            "ref_AAT": "test ref AAT",
                            "ref_GND": "test ref GND",
                            "createdAt": "2024-02-22T15:49:01.894Z",
                            "updatedAt": "2024-02-22T15:49:01.894Z",
                            "locale": "de"
                        }
                    }
                ]
            },
            "SchemaVersion": [
                {
                    "id": 6,
                    "VersionName": "AVEFI SCHEMA",
                    "VersionNumber": 2
                },
                {
                    "id": 7,
                    "VersionName": "AVEFI SCHEMA",
                    "VersionNumber": 2
                }
            ],
            "TitleType": {
                "id": 7,
                "TitleTypeName": "Original Title"
            },
            "localizations": {
                "data": [
                    {
                        "id": 4,
                        "attributes": {
                            "Title": "Paul und Paula EN",
                            "createdAt": "2024-02-20T16:03:44.937Z",
                            "updatedAt": "2024-03-21T16:43:21.584Z",
                            "publishedAt": "2024-02-20T16:06:34.313Z",
                            "locale": "en",
                            "CountryOfReference": "DE",
                            "RelatedIdentifier": "Test Related Identifier",
                            "LastModified": "2024-02-21T00:00:00.000Z"
                        }
                    }
                ]
            }
        }
    },
    "meta": {}
},null,2);

const text2 = JSON.stringify({
    "data": {
        "id": 5,
        "attributes": {
            "Title": "SUBJEKTITÜDE",
            "createdAt": "2024-02-22T15:33:43.232Z",
            "updatedAt": "2024-02-22T18:22:12.337Z",
            "publishedAt": "2024-02-22T18:22:12.169Z",
            "locale": "de",
            "CountryOfReference": "DE",
            "RelatedIdentifier": "asd",
            "LastModified": "2024-02-21T23:00:00.000Z",
            "seoshared": [],
            "YearOfReference": [
                {
                    "id": 8,
                    "yearOfReferenceDate": "1970-09-23",
                    "yearOfReferenceStart": 1970,
                    "yearOfReferenceEnd": 1970,
                    "yearOfReferenceType": "Created"
                }
            ],
            "Series": {
                "data": []
            },
            "Cast": {
                "data": [
                    {
                        "id": 1,
                        "attributes": {
                            "CastName": "Hello CastNameNameName",
                            "CastFirstName": "Barbara",
                            "CastLastName": "Lamers",
                            "CastIdentifier": null,
                            "createdAt": "2024-02-22T15:36:58.713Z",
                            "updatedAt": "2024-03-05T14:18:29.323Z"
                        }
                    },
                    {
                        "id": 2,
                        "attributes": {
                            "CastName": "CastName",
                            "CastFirstName": "Hans-Jürgen",
                            "CastLastName": "Minow",
                            "CastIdentifier": null,
                            "createdAt": "2024-02-22T15:37:31.476Z",
                            "updatedAt": "2024-02-22T15:37:31.476Z"
                        }
                    },
                    {
                        "id": 3,
                        "attributes": {
                            "CastName": "CastName",
                            "CastFirstName": "Wolfgang",
                            "CastLastName": "Sippel",
                            "CastIdentifier": null,
                            "createdAt": "2024-02-22T15:37:53.323Z",
                            "updatedAt": "2024-02-22T15:37:53.323Z"
                        }
                    }
                ]
            },
            "ProductionCompany": {
                "data": null
            },
            "OriginalFormat": {
                "id": 2
            },
            "FirstKnownManifestation": {
                "id": 3,
                "OriginalLength": null,
                "OriginalLengthUnit": null,
                "OriginalDuration": null
            },
            "Genre": [
                {
                    "id": 7,
                    "GenreName": null
                }
            ],
            "Source": {
                "data": {
                    "id": 2,
                    "attributes": {
                        "SourceName": "DEUTSCHE KINEMATHEK – MUSEUM FÜR FILM UND FERNSEHEN",
                        "SourceIdentifier": "Identifier",
                        "SourceAttribution": "insert attribution value",
                        "SourceAttributionDate": "2024-02-22",
                        "SourceAttributionType": "Created",
                        "createdAt": "2024-02-22T15:47:20.034Z",
                        "updatedAt": "2024-02-22T15:47:20.034Z"
                    }
                }
            },
            "Subject": {
                "data": []
            },
            "SchemaVersion": [
                {
                    "id": 3,
                    "VersionName": "AV-EFI",
                    "VersionNumber": 1
                }
            ],
            "TitleType": {
                "id": 1,
                "TitleTypeName": "Original Title"
            },
            "localizations": {
                "data": []
            }
        }
    },
    "meta": {}
},null,2);
*/

async function getCollectionType (routeParamsId:number):Promise<string> {  
    const { data } = await useApiFetchLocal<IAVefiSingleResponse>(`/api/work-levels/${routeParamsId}`, {method: 'GET'});
    if(data) {
        return JSON.stringify(data.value, null, 2);
    }
    return "";
}

const { data: prev } = await useAsyncData<string>('prev', () =>
    getCollectionType(props.items[0] as number)
);

const { data: current } = await useAsyncData<string|undefined>('current', () =>
    getCollectionType(props.items[1] as number)
);

refreshNuxtData('prev');
refreshNuxtData('current');

const text1 = ref(prev.value);
const text2 = ref(current.value);
const highlightedCode = hljs.highlight(
    text1.value||'',
    { language: 'json' }
).value;
const diff = dmp.diff_main(text1?.value||'', text2?.value||'');
// Result: [(-1, "Hell"), (1, "G"), (0, "o"), (1, "odbye"), (0, " World.")]
dmp.diff_cleanupSemantic(diff);
const ds = dmp.diff_prettyHtml(diff);

</script>