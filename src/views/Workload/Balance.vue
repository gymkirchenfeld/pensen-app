<template>
  <div v-if="data">
    <p class="text-h5 mt-8">IPB: Übersicht</p>
    <v-data-table
      dense
      :headers="headers"
      hide-default-footer
      :items="data"
      :items-per-page="-1"
    >
      <template v-slot:item.percent="{ item }">
        <SemesterValue type="percent" :value="item.percent" />
      </template>
    </v-data-table>
  </div>
</template>
<script>
import SemesterValue from '@/components/SemesterValue.vue';

export default {
  components: {
    SemesterValue,
  },
  props: {
    data: { type: Array, default: null },
  },
  data() {
    return {
      headers: [
        { sortable: false, text: 'Bezeichnung', value: 'description' },
        { sortable: false, align: 'right', text: 'Prozent', value: 'percent' },
      ],
    };
  },
};
</script>
