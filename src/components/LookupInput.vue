<template>
  <v-select
    :disabled="items.length < 1"
    :items="items"
    item-text="description"
    :label="label"
    return-object
    v-bind="$attrs"
    :value="modelValue"
    @change="select"
  >
  </v-select>
</template>
<script>
export default {
  props: {
    label: { type: String, default: null },
    resource: { type: String, default: null },
    value: { type: Object, default: null },
  },
  data() {
    return {
      items: [],
      modelValue: this.value,
    };
  },
  watch: {
    value(newValue) {
      this.modelValue = newValue;
    },
  },
  async created() {
    this.items = await this.apiList({ resource: this.resource });
    if (!this.modelValue && this.items.length > 0) {
      this.modelValue = this.items[this.items.length - 1];
      this.$emit('input', this.modelValue);
    }
  },
  methods: {
    select($event) {
      this.$emit('input', $event);
    },
  },
};
</script>
