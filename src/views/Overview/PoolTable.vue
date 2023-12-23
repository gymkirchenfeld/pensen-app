<template>
  <v-data-table
    dense
    :headers="headers"
    hide-default-footer
    :items="items"
    :items-per-page="-1"
    :loading="loading"
  >
    <template v-slot:item.poolType="{ item }">
      <LookupValue :value="item.poolType" />
    </template>
    <template v-slot:item.percent1="{ item }">
      {{ item.percent1.toFixed() }} %
    </template>
    <template v-slot:item.percent2="{ item }">
      {{ item.percent2.toFixed() }} %
    </template>
    <template v-slot:item.percent="{ item }">
      {{ item.percent.toFixed() }} %
    </template>
  </v-data-table>
</template>
<script>
import LookupValue from '@/components/LookupValue.vue';

function sumPool(sum, pool) {
  sum.percent1 += pool.percent1;
  sum.percent2 += pool.percent2;
  sum.percent += (pool.percent1 + pool.percent2) / 2.0;
}

export default {
  components: {
    LookupValue,
  },
  props: {
    schoolYear: { type: Object, defaultValue: null },
  },
  data() {
    return {
      headers: [
        { text: 'Pool', value: 'poolType' },
        { align: 'right', text: '1. Sem.', value: 'percent1' },
        { align: 'right', text: '2. Sem.', value: 'percent2' },
        { align: 'right', text: 'Total', value: 'percent' },
      ],
      items: [],
      loading: false,
    };
  },
  watch: {
    schoolYear() {
      this.fetchData();
    },
  },
  methods: {
    async fetchData() {
      const poolTypes = await this.apiList({ resource: 'pooltype' });
      const map = {};
      poolTypes.forEach((poolType) => {
        map[poolType.id] = {
          poolType: poolType,
          percent1: 0.0,
          percent2: 0.0,
          percent: 0.0,
        };
      });
      const pool = await this.apiList({
        resource: 'poolentry',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      pool.forEach((poolEntry) => {
        sumPool(map[poolEntry.type.id], poolEntry);
      });
      this.items = [];
      poolTypes.forEach((poolType) => {
        this.items.push(map[poolType.id]);
      });
    },
  },
};
</script>
