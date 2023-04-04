<template>
  <v-autocomplete
    :value="value"
    chips
    :disabled="items.length < 1"
    :items="items"
    label="Fachschaften"
    item-text="description"
    item-value="id"
    @change="select"
    return-object
    multiple
  >
    <template v-slot:item="data">
      <v-list-item-content>
        <v-list-item-title>{{ data.item.description }} </v-list-item-title>
        <v-list-item-subtitle> {{ data.item.code }}</v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  props: {
    value: { type: Array, default: null },
  },
  data() {
    return {
      items: [],
    };
  },
  async created() {
    this.items = await this.apiList({ resource: 'subjectcategory' });
  },
  methods: {
    select($event) {
      this.$emit('input', $event);
    },
  },
};
</script>
