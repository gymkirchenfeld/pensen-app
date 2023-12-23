<template>
  <v-data-table
    dense
    :headers="headers"
    hide-default-footer
    :items="items"
    :items-per-page="-1"
    :loading="loading"
  >
    <template v-slot:item.gender="{ item }">
      <LookupValue :value="item.gender" />
    </template>
    <template v-slot:item.employmentMin="{ item }">
      {{ item.employmentMin.toFixed() }} %
    </template>
    <template v-slot:item.employmentMax="{ item }">
      {{ item.employmentMax.toFixed() }} %
    </template>
  </v-data-table>
</template>
<script>
import LookupValue from '@/components/LookupValue.vue';

export default {
  components: {
    LookupValue,
  },
  props: {
    items: { type: Array },
    loading: { type: Boolean, default: false },
  },
  data() {
    return {
      headers: [
        { text: 'Geschlecht', value: 'gender' },
        { align: 'right', text: 'Anzahl Lehrpersonen', value: 'count' },
        { align: 'right', text: 'Anstellung min.', value: 'employmentMin' },
        { align: 'right', text: 'Anstellung max.', value: 'employmentMax' },
      ],
    };
  },
};
</script>
