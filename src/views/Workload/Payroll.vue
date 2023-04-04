<template>
  <div v-if="data">
    <p class="text-h5 mt-8">Pensenmeldung</p>
    <v-data-table
      dense
      :headers="headers"
      hide-default-footer
      :items="data.items"
      :items-per-page="-1"
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
      <template slot="body.append">
        <tr class="font-weight-bold">
          <td>Total</td>
          <td></td>
          <td class="text-right">
            <SemesterValue
              type="percent"
              :value="data.total.percent1"
            ></SemesterValue>
          </td>
          <td></td>
          <td class="text-right">
            <SemesterValue
              type="percent"
              :value="data.total.percent2"
            ></SemesterValue>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import LookupValue from '@/components/LookupValue.vue';
import SemesterValue from '@/components/SemesterValue.vue';

export default {
  components: {
    LookupValue,
    SemesterValue,
  },
  props: {
    data: { type: Object, default: null },
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
    };
  },
};
</script>
