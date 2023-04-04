<template>
  <div v-if="data.items.length > 0">
    <p class="text-h5 mt-8">IPB: Ein- und Ausbuchungen</p>
    <v-data-table
      @click:row="(item) => editPosting(item)"
      dense
      :headers="headers"
      hide-default-footer
      :items="data.items"
      :items-per-page="-1"
    >
      <template v-slot:item.type="{ item }">
        <LookupValue :value="item.type" />
      </template>
      <template v-slot:item.startDate="{ item }">
        <DateValue :value="item.startDate" />
      </template>
      <template v-slot:item.endDate="{ item }">
        <DateValue :value="item.endDate" />
      </template>
      <template v-slot:item.startDate="{ item }">
        <DateValue :value="item.startDate" />
      </template>
      <template v-slot:item.endDate="{ item }">
        <DateValue :value="item.endDate" />
      </template>
      <template v-slot:item.totalPercent="{ item }">
        <SemesterValue type="percent" :value="item.totalPercent" />
      </template>
      <template slot="body.append">
        <tr class="font-weight-bold">
          <td>Total</td>
          <td></td>
          <td></td>
          <td class="text-right">
            <SemesterValue
              type="percent"
              :value="data.total.percent"
            ></SemesterValue>
          </td>
        </tr>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import DateValue from '@/components/DateValue.vue';
import LookupValue from '@/components/LookupValue.vue';
import SemesterValue from '@/components/SemesterValue.vue';

export default {
  components: {
    DateValue,
    LookupValue,
    SemesterValue,
  },
  props: {
    data: { type: Object, default: null },
  },
  data() {
    return {
      headers: [
        { sortable: false, text: 'Beschreibung', value: 'description' },
        { sortable: false, text: 'von', value: 'startDate' },
        { sortable: false, text: 'bis', value: 'endDate' },
        {
          align: 'right',
          sortable: false,
          text: 'Total',
          value: 'totalPercent',
        },
      ],
    };
  },
};
</script>
