<template>
  <v-switch hide-details v-model="modelValue" :label="label"></v-switch>
</template>
<script>
export default {
  props: {
    value: null,
  },
  data() {
    return {
      modelValue: false,
    };
  },
  computed: {
    label() {
      return this.modelValue
        ? 'Archivierte sichtbar'
        : 'Archivierte ausgeblendet';
    },
  },
  watch: {
    modelValue() {
      this.$emit('input', this.modelValue);
      localStorage.setItem('showArchived', this.modelValue);
    },
  },
  created() {
    this.modelValue = localStorage.getItem('showArchived') === 'true';
  },
};
</script>
