<template>
  <div>
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
              class="btn btn-primary btn-xs"
              @click="showDetails('6B1DA15A-E1F1-40C3-8BB5-12A4221EBED7-SDK-TEST','0FE417A7-D2E8-45B8-90AD-3BF376E3C425')"
            >
              Show Details
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
              Show Details
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { v4 as uuidv4 } from 'uuid';

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
    title: getRandomTitle()
})));

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
