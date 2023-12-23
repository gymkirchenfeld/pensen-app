<template>
  <v-data-table
    dense
    :headers="headers"
    hide-default-footer
    :items="items"
    :items-per-page="-1"
    :loading="loading"
  >
    <template v-slot:item.payrollType="{ item }">
      <LookupValue :value="item.payrollType" />
    </template>
    <template v-slot:item.lessons1="{ item }">
      <SemesterValue type="lessons" :value="item.lessons1" />
    </template>
    <template v-slot:item.percent1="{ item }">
      <SemesterValue type="percent" :value="item.percent1" />
    </template>
    <template v-slot:item.lessons2="{ item }">
      <SemesterValue type="lessons" :value="item.lessons2" />
    </template>
    <template v-slot:item.percent2="{ item }">
      <SemesterValue type="percent" :value="item.percent2" />
    </template>
  </v-data-table>
</template>
<script>
import LookupValue from '@/components/LookupValue.vue';
import SemesterValue from '@/components/SemesterValue.vue';

function sumPayroll(map, payroll) {
  payroll.items.forEach((item) => {
    const payroll = map[item.payrollType.id];
    payroll.lessons1 += item.lessons1;
    payroll.lessons2 += item.lessons2;
    payroll.percent1 += item.percent1;
    payroll.percent2 += item.percent2;
  });
}

export default {
  components: {
    LookupValue,
    SemesterValue,
  },
  props: {
    schoolYear: { type: Object, defaultValue: null },
  },
  watch: {
    schoolYear() {
      this.fetchData();
    },
  },
  data() {
    return {
      headers: [
        { sortable: false, text: 'Bezeichnung', value: 'payrollType' },
        {
          sortable: false,
          align: 'right',
          text: 'Lektionen 1. Sem',
          value: 'lessons1',
        },
        {
          sortable: false,
          align: 'right',
          text: 'Prozent 1. Sem',
          value: 'percent1',
        },
        {
          sortable: false,
          align: 'right',
          text: 'Lektionen 2. Sem.',
          value: 'lessons2',
        },
        {
          sortable: false,
          align: 'right',
          text: 'Prozent 2. Sem.',
          value: 'percent2',
        },
      ],
      items: [],
      loading: false,
    };
  },
  methods: {
    async fetchData() {
      this.loading = true;
      const payrollTypes = await this.apiList({ resource: 'payrolltype' });
      const map = {};
      payrollTypes.forEach((payrollType) => {
        map[payrollType.id] = {
          payrollType: payrollType,
          lessons1: 0,
          lessons2: 0,
          percent1: 0,
          percent2: 0,
        };
      });
      const workloads = await this.apiList({
        resource: 'workload',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      workloads.forEach((workload) => {
        sumPayroll(map, workload.payroll);
      });
      this.items = [];
      payrollTypes.forEach((payrollType) => {
        this.items.push(map[payrollType.id]);
      });
      this.loading = false;
    },
  },
};
</script>
