<template>
  <div v-if="data.items.length > 0">
    <p class="text-h5 mt-8">{{ title }}</p>
    <v-data-table
      @click:row="(item) => editPoolEntry(item)"
      dense
      :headers="headers"
      hide-default-footer
      :items="data.items"
      :items-per-page="-1"
    >
      <template v-slot:item.type="{ item }">
        <LookupValue :value="item.type" />
      </template>
      <template v-slot:item.percent1="{ item }">
        <SemesterValue type="percent" :value="item.percent1" />
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
    ageReliefIncluded: { type: Boolean, default: false },
    data: { type: Object, default: null },
  },
  computed: {
    title() {
      let result = 'Pensum: Pool';
      if (this.ageReliefIncluded) result += ' (inkl. AE)';
      return result;
    },
  },
  data() {
    return {
      headers: [
        { sortable: false, text: 'Bezeichnung', value: 'description' },
        { sortable: false, text: 'Typ', value: 'type' },
        {
          align: 'right',
          sortable: false,
          text: 'Prozent 1. Sem.',
          value: 'percent1',
        },
        {
          align: 'right',
          sortable: false,
          text: 'Prozent 2. Sem.',
          value: 'percent2',
        },
      ],
    };
  },
};
</script>
