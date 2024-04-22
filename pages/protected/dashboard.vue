<template>
  <div>
    <button 
      title="Generate JSON Files"
      @click="generateJSON"
    >
      Generate JSON Files
    </button>
  </div>
</template>

<script>
export default {
    methods: {
        generateJSON() {
            // Your code to generate and save JSON files here...
            createRandomDataJson();
        }
    }
};
</script>