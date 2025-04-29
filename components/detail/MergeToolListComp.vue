<template>
  <table class="table table-xs table-fixed w-full dark:bg-gray-800 dark:text-gray-200">
    <thead class="dark:bg-gray-700">
      <tr>
        <th>ID 1</th>
        <th>Title 1</th>
        <th>ID 2</th>
        <th>Title 2</th>
        <th class="w-24">
          Status
        </th>
        <th class="w-24">
          Similarity
        </th>
        <th class="w-32">
          Actions
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="dark:bg-gray-900 dark:hover:bg-gray-700 even:bg-gray-100 odd:bg-white dark:even:bg-gray-800 dark:odd:bg-gray-900">
        <td>
          6B1DA15A-E1F1-40C3-8BB5-12A4221EBED7-SDK-TEST
        </td>
        <td>Tunguska - die Kisten sind da</td>
        <td>
          0FE417A7-D2E8-45B8-90AD-3BF376E3C425
        </td>
        <td>
          TUNGUSKA - DIE KISTEN SIND DA
        </td>
        <td :class="{'text-orange-500 dark:text-orange-300': true}">
          Open
        </td>
        <td :class="getColor(75)">
          75%
        </td>
        <td>
          <button
            class="btn btn-primary btn-xs dark:bg-blue-600 dark:hover:bg-blue-500"
            @click="showDetails('0FE417A7-D2E8-45B8-90AD-3BF376E3C425','357A73F8-F9C4-4B0A-A333-E943EB3C3F84')"
          >
            Show Details
          </button>
        </td>
      </tr>
      <tr
        v-for="(pair, index) in itemPairs"
        :key="index"
        class="dark:bg-gray-900 dark:hover:bg-gray-700 even:bg-gray-100 odd:bg-white dark:even:bg-gray-800 dark:odd:bg-gray-900"
      >
        <td>{{ pair.items[0].id }}</td>
        <td>
          <ul>
            <li
              v-for="(title, idx) in pair.items[0].title"
              :key="idx"
              class="break-all mb-1"
            >
              {{ title }}
            </li>
          </ul>
        </td>
        <td>{{ pair.items[1]?.id || 'N/A' }}</td>
        <td>
          <ul>
            <li
              v-for="(title, idx) in pair.items[1].title"
              :key="idx"
              class="break-all mb-1"
            >
              {{ title }}
            </li>
          </ul>
        </td>
        <td>
          <ul>
            <li
              v-for="(status, idx) in ['Resolved', 'Open', 'Ignored', 'Duplicate', 'Not a Duplicate']"
              :key="idx"
            >
              {{ status }}
            </li>
          </ul>
        </td>
        <td :class="getColor(pair.similarity < 1 ? pair.similarity * 100 : pair.similarity)">
          {{ pair.similarity < 1 ? (pair.similarity * 100).toFixed(2) : pair.similarity }}%
        </td>
        <td>
          <button
            class="btn btn-primary btn-disabled btn-xs dark:bg-blue-600 dark:hover:bg-blue-500"
            @click="showDetails(pair.items)"
          >
            Show Details
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';

const dataItems = [
    {
        "items": [
            {
                "id": "DFF53D88-158D-4C70-A1E3-1646CDA3B094-SDK-TEST",
                "title": [
                    " die liebe zum land. teil 11111111. familienbetrieb mit 6666666644444444 st\u00fcck milchvieh, kreis flensburg 11111111999999997777777733333333",
                    " liebe zum land. teil 11111111. familienbetrieb mit 6666666644444444 st\u00fcck milchvieh, kreis flensburg 11111111999999997777777733333333, die",
                    " liebe zum land, die; 11111111. familienbetrieb mit 6666666644444444 st\u00fcck milchvieh, kreis flensburg 11111111999999997777777733333333"
                ]
            },
            {
                "id": "8B81FE91-C471-40AB-B6D3-AF15B712B72C-SDK-TEST",
                "title": [
                    " die liebe zum land. teil 22222222. drei treckerfahrer, ein melker und ihre frauen, kreis herzogtum lauenburg 11111111999999997777777733333333",
                    " liebe zum land. teil 22222222. drei treckerfahrer, ein melker und ihre frauen, kreis herzogtum lauenburg 11111111999999997777777733333333, die",
                    " liebe zum land, die; 22222222. drei treckerfahrer, ein melker und ihre frauen, kreis herzogtum lauenburg 11111111999999997777777733333333"
                ]
            }
        ],
        "similarity": 0.8935857142857143
    },
    {
        "items": [
            {
                "id": "8B81FE91-C471-40AB-B6D3-AF15B712B72C-SDK-TEST",
                "title": [
                    " die liebe zum land. teil 22222222. drei treckerfahrer, ein melker und ihre frauen, kreis herzogtum lauenburg 11111111999999997777777733333333",
                    " liebe zum land. teil 22222222. drei treckerfahrer, ein melker und ihre frauen, kreis herzogtum lauenburg 11111111999999997777777733333333, die",
                    " liebe zum land, die; 22222222. drei treckerfahrer, ein melker und ihre frauen, kreis herzogtum lauenburg 11111111999999997777777733333333"
                ]
            },
            {
                "id": "DFF53D88-158D-4C70-A1E3-1646CDA3B094-SDK-TEST",
                "title": [
                    " die liebe zum land. teil 11111111. familienbetrieb mit 6666666644444444 st\u00fcck milchvieh, kreis flensburg 11111111999999997777777733333333",
                    " liebe zum land. teil 11111111. familienbetrieb mit 6666666644444444 st\u00fcck milchvieh, kreis flensburg 11111111999999997777777733333333, die",
                    " liebe zum land, die; 11111111. familienbetrieb mit 6666666644444444 st\u00fcck milchvieh, kreis flensburg 11111111999999997777777733333333"
                ]
            }
        ],
        "similarity": 0.8935857142857143
    },
    {
        "items": [
            {
                "id": "8B81FE91-C471-40AB-B6D3-AF15B712B72C-SDK-TEST",
                "title": [
                    " die liebe zum land. teil 22222222. drei treckerfahrer, ein melker und ihre frauen, kreis herzogtum lauenburg 11111111999999997777777733333333",
                    " liebe zum land. teil 22222222. drei treckerfahrer, ein melker und ihre frauen, kreis herzogtum lauenburg 11111111999999997777777733333333, die",
                    " liebe zum land, die; 22222222. drei treckerfahrer, ein melker und ihre frauen, kreis herzogtum lauenburg 11111111999999997777777733333333"
                ]
            },
            {
                "id": "351ACAA7-CE63-4458-ADC7-0C35BDAE2EAD-SDK-TEST",
                "title": [
                    " der mann mit der roten nelke",
                    " mann mit der roten nelke, der"
                ]
            }
        ],
        "similarity": 0.8271571428571428
    },
    {
        "items": [
            {
                "id": "351ACAA7-CE63-4458-ADC7-0C35BDAE2EAD-SDK-TEST",
                "title": [
                    " der mann mit der roten nelke",
                    " mann mit der roten nelke, der"
                ]
            },
            {
                "id": "8B81FE91-C471-40AB-B6D3-AF15B712B72C-SDK-TEST",
                "title": [
                    " die liebe zum land. teil 22222222. drei treckerfahrer, ein melker und ihre frauen, kreis herzogtum lauenburg 11111111999999997777777733333333",
                    " liebe zum land. teil 22222222. drei treckerfahrer, ein melker und ihre frauen, kreis herzogtum lauenburg 11111111999999997777777733333333, die",
                    " liebe zum land, die; 22222222. drei treckerfahrer, ein melker und ihre frauen, kreis herzogtum lauenburg 11111111999999997777777733333333"
                ]
            }
        ],
        "similarity": 0.8271571428571428
    },
    {
        "items": [
            {
                "id": "DFF53D88-158D-4C70-A1E3-1646CDA3B094-SDK-TEST",
                "title": [
                    " die liebe zum land. teil 11111111. familienbetrieb mit 6666666644444444 st\u00fcck milchvieh, kreis flensburg 11111111999999997777777733333333",
                    " liebe zum land. teil 11111111. familienbetrieb mit 6666666644444444 st\u00fcck milchvieh, kreis flensburg 11111111999999997777777733333333, die",
                    " liebe zum land, die; 11111111. familienbetrieb mit 6666666644444444 st\u00fcck milchvieh, kreis flensburg 11111111999999997777777733333333"
                ]
            },
            {
                "id": "351ACAA7-CE63-4458-ADC7-0C35BDAE2EAD-SDK-TEST",
                "title": [
                    " der mann mit der roten nelke",
                    " mann mit der roten nelke, der"
                ]
            }
        ],
        "similarity": 0.8163571428571428
    },
    {
        "items": [
            {
                "id": "351ACAA7-CE63-4458-ADC7-0C35BDAE2EAD-SDK-TEST",
                "title": [
                    " der mann mit der roten nelke",
                    " mann mit der roten nelke, der"
                ]
            },
            {
                "id": "DFF53D88-158D-4C70-A1E3-1646CDA3B094-SDK-TEST",
                "title": [
                    " die liebe zum land. teil 11111111. familienbetrieb mit 6666666644444444 st\u00fcck milchvieh, kreis flensburg 11111111999999997777777733333333",
                    " liebe zum land. teil 11111111. familienbetrieb mit 6666666644444444 st\u00fcck milchvieh, kreis flensburg 11111111999999997777777733333333, die",
                    " liebe zum land, die; 11111111. familienbetrieb mit 6666666644444444 st\u00fcck milchvieh, kreis flensburg 11111111999999997777777733333333"
                ]
            }
        ],
        "similarity": 0.8163571428571428
    }
];


const titles = [
    'Meine lieben Berliner',
    'Nr. 1 - Aus Berichten der Wach- und Patrouillendienste',
    'Nr. 5 - Aus Berichten der Wach- und Patrouillendienste',
    'Nr. 8 - Aus Berichten der Wach- und Patrouillendienste',
    'Die Judengasse',
    'Noch einmal HH 4: Reeperbahn nebenan',
    'Nosferatu',
    'Der erste Schulgang',
    'Faust',
    'Engelein',
    'Dr. Mabuse. Der Spieler I: Der große Spieler. Ein Bild der Zeit',
    'Das Cabinet des Dr. Caligari',
    'Amphitryon',
    'Freier Fall: Johanna K.',
    'Neun Leben hat die Katze',
    'Utlänningar',
    'Die Straße',
    'Die Mysterien eines Frisiersalons',
    'Madame Dubarry',
    'Der letzte Mann',
    'Der Kongreß tanzt',
    'Der Golem, wie er in die Welt kam',
    'Terror 2000 - Intensivstation Deutschland'
];

const getRandomTitle = () => {
    return titles[Math.floor(Math.random() * titles.length)];
};

const items = ref(Array.from({ length: 20 }, () => ({
    id: uuidv4(),
    title: [getRandomTitle()]
})));

const getRandomSimilarity = () => {
    return Math.floor(Math.random() * 51) + 50;
};

const itemPairs = computed(() => {
    const pairs = dataItems.map(item => ({
        items: item.items,
        similarity: item.similarity
    }));

    for (let i = 0; i < items.value.length; i += 2) {
        pairs.push({
            items: [items.value[i], items.value[i + 1]],
            similarity: getRandomSimilarity()
        });
    }
    return pairs;
});

const getColor = (similarity) => {
    if (similarity >= 90) return 'text-red-600 dark:text-red-400';
    if (similarity >= 75) return 'text-orange-400 dark:text-orange-200';
    return 'text-black dark:text-white';
};

const showDetails = (id1,id2) => {
    if(id1 && id2) {
        navigateTo(`/protected/disambiguation?prev=${id1}&next=${id2}`);
    }
};
</script>