<template>
  <span>
    <v-icon color="grey" v-if="modelValue === 'ready'">mdi-check</v-icon>
    <v-icon color="success" v-if="modelValue === 'imported'">mdi-check</v-icon>
    <v-progress-circular
      v-if="modelValue === 'importing'"
      indeterminate
      :width="3"
      :size="20"
      color="accent"
    ></v-progress-circular>
    <v-icon color="error" v-if="modelValue === 'error'">mdi-exclamation</v-icon>
  </span>
</template>
<script>
export default {
  props: {
    value: { type: String, default: 'ready' },
  },
  data() {
    return {
      modelValue: this.value,
    };
  },
  watch: {
    value() {
      this.modelValue = this.value;
    },
  },
};
</script>
