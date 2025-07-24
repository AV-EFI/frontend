<template>
  <<<<<<< HEAD
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
            @click="showDetails('6B1DA15A-E1F1-40C3-8BB5-12A4221EBED7-SDK-TEST','0FE417A7-D2E8-45B8-90AD-3BF376E3C425')"
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
              =="====="
              <div
            >
              <table class="table table-xs table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID 1</th>
                    <th>Title 1</th>
                    <th>ID 2</th>
                    <th>Title 2</th>
                    <th>Status</th>
                    <th>Similarity</th>
                    <th class="min-w-[112px]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      357A73F8-F9C4-4B0A-A333-E943EB3C3F84
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
                        class="btn btn-primary btn-xs"
                        @click="showDetails('0FE417A7-D2E8-45B8-90AD-3BF376E3C425','357A73F8-F9C4-4B0A-A333-E943EB3C3F84')"
                      >
                        >>>>>> comp-structure-documentation
                        >
                        {{ $t('goToMerge') }}
                      </button>
                    </td>
                  </tr>
                  <tr
                    v-for="(pair, index) in itemPairs"
                    :key="index"
                  >
                    <td>{{ pair.items[0].id }}</td>
                    <td>{{ pair.items[0].title }}</td>
                    <td>{{ pair.items[1]?.id || 'N/A' }}</td>
                    <td>{{ pair.items[1]?.title || 'N/A' }}</td>
                    <td :class="{'text-green-500 dark:text-green-300': true}">
                      Resolved
                    </td>
                    <td :class="getColor(pair.similarity)">
                      {{ pair.similarity }}%
                    </td>
                    <td>
                      <button
                        class="btn btn-primary btn-disabled btn-xs"
                        @click="showDetails(pair.items)"
                      >
                        <<<<<<< HEAD
                        {{ title }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
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
  =======
  Show Details
  </button>
  </td>
  </tr>
  </tbody>
  </table>
  </div>
  >>>>>>> comp-structure-documentation
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';

const titles = [
    'Meine lieben Berliner',
    'Nr. 1 - Aus Berichten der Wach- und Patrouillendienste',
    'Nr. 5 - Aus Berichten der Wach- und Patrouillendienste',
    'Nr. 8 - Aus Berichten der Wach- und Patrouillendienste',
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
    'Privatfilme Bletzinger - Alfred Bletzinger',
    'Bau der Michaelskirche inForchtenberg',
    'Privataufnahmen',
    'Solo Sunny'
];

const getRandomTitle = () => {
    return titles[Math.floor(Math.random() * titles.length)];
};


const items = ref(Array.from({ length: 20 }, () => {
    // Decide randomly if this item should have a duplicate title (0-3)
    const shouldDuplicate = Math.floor(Math.random() * 2) === 0;
    const title = getRandomTitle();
    if (shouldDuplicate) {
    // Create two items with the same title (simulate identical pair)
        return {
            id: uuidv4(),
            title: title
        };
    }
    // Otherwise, create an item with a random title
    return {
        id: uuidv4(),
        title: getRandomTitle()
    };
}));

// After creating the initial items, randomly duplicate some titles to create pairs
for (let i = 0; i < items.value.length - 1; i++) {
    if (Math.floor(Math.random() * 4) === 0) {
    // Set the next item's title to be identical to the current item's title
        items.value[i + 1].title = items.value[i].title;
        i++; // Skip next to avoid triple pairing
    }
}

const getRandomSimilarity = () => {
    return Math.floor(Math.random() * 51) + 50;
};

const itemPairs = computed(() => {
    const pairs = [];
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