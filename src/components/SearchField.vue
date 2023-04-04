<template>
  <v-text-field
    append-icon="mdi-magnify"
    class="mr-2"
    clearable
    dense
    hide-details
    :hint="hint"
    label="Suche"
    outlined
    persistent-hint
    single-line
    v-model="modelValue"
  ></v-text-field>
</template>
<script>
export default {
  props: {
    hint: { type: String, default: null },
    value: { type: String, default: null },
  },
  data() {
    return {
      modelValue: this.value,
    };
  },
  watch: {
    modelValue() {
      this.$emit('input', this.modelValue);
    },
  },
};
</script>
