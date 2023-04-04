<template>
  <v-select
    v-if="!showWhenNeeded || items.length > 1"
    dense
    hide-details
    item-text="description"
    :items="items"
    return-object
    v-bind="$attrs"
    v-model="modelValue"
  >
  </v-select>
</template>
<script>
export default {
  props: {
    resource: { type: String, default: null },
    showAll: { type: Boolean, default: false },
    showWhenNeeded: { type: Boolean, default: false },
    storeSelection: { type: String, default: null },
    value: null,
  },
  data() {
    return {
      items: [],
      modelValue: null,
    };
  },
  watch: {
    modelValue() {
      this.$emit('input', this.modelValue);
      if (this.storeSelection) {
        localStorage.setItem(this.storeSelection, this.modelValue.id);
      }
    },
  },
  async created() {
    let items = await this.apiList({ resource: this.resource });
    const showArchived = localStorage.getItem('showArchived') === 'true';
    items = items.filter((item) => showArchived || !item.archived);
    if (this.showAll && items.length > 1) {
      items.unshift({ id: -1, code: '-1', description: '(alle)' });
      this.modelValue = items[0];
    } else if (items.length > 0) {
      this.modelValue = items[items.length - 1];
    }
    if (this.storeSelection) {
      const id =
        Number.parseInt(localStorage.getItem(this.storeSelection)) || -1;
      items.forEach((item) => {
        if (item.id === id) this.modelValue = item;
      });
    }
    this.items = items;
  },
};
</script>
