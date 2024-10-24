<template>
  <div class="sui-sorting">
    <div class="sui-sorting__label">
      Sort by
    </div>
    <pre>{{ disabledState == true? 'Please use the Table sorting':'' }}</pre>
    <select
      name="sortBy"
      :value="modelValue"
      :class="disabledState == true?'disabled':''"
      :disabled="disabledState == true"
      @input="$emit('update:modelValue', $event.target.value)"
    >
      <option value="_score">
        Relevance
      </option>
      <option value="Genres">
        Genres
      </option>
    </select>
  </div>
</template>

<script>
export default {
    props: {
        "modelValue": {
            type: String,
            default: ""
        },
        'disabledState': {
            type: Boolean,
            default: false,
        }

    },
    emits: ["update:modelValue"]
};
</script>