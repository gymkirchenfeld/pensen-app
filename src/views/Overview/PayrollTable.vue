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
      <span v-if="item.description">{{ item.description }}</span>
      <LookupValue v-else :value="item.payrollType" />
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

function sumPayroll(regularMap, correctionMap, payroll) {
  payroll.items.forEach((item) => {
    if (item.correction) {
      const id = item.parentPayrollType.id;
      if (!correctionMap[id]) {
        correctionMap[id] = {
          parentPayrollType: item.parentPayrollType,
          description: item.description,
          lessons1: 0,
          lessons2: 0,
          percent1: 0,
          percent2: 0,
        };
      }
      correctionMap[id].lessons1 += item.lessons1;
      correctionMap[id].lessons2 += item.lessons2;
      correctionMap[id].percent1 += item.percent1;
      correctionMap[id].percent2 += item.percent2;
    } else {
      const entry = regularMap[item.payrollType.id];
      if (!entry) return;
      entry.lessons1 += item.lessons1;
      entry.lessons2 += item.lessons2;
      entry.percent1 += item.percent1;
      entry.percent2 += item.percent2;
    }
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
      const regularMap = {};
      payrollTypes.forEach((payrollType) => {
        regularMap[payrollType.id] = {
          payrollType: payrollType,
          lessons1: 0,
          lessons2: 0,
          percent1: 0,
          percent2: 0,
        };
      });
      const correctionMap = {};
      const workloads = await this.apiList({
        resource: 'workload',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      workloads.forEach((workload) => {
        sumPayroll(regularMap, correctionMap, workload.payroll);
      });
      this.items = [];
      payrollTypes.forEach((payrollType) => {
        this.items.push(regularMap[payrollType.id]);
        if (correctionMap[payrollType.id]) {
          this.items.push(correctionMap[payrollType.id]);
        }
      });
      this.loading = false;
    },
  },
};
</script>
