<template>
  <div v-if="data.items.length > 0">
    <p class="text-h5 mt-8">Pensum: Abschlussarbeiten</p>
    <v-data-table
      @click:row="(item) => editThesisEntry(item)"
      dense
      :headers="headers"
      hide-default-footer
      :items="data.items"
      :items-per-page="-1"
    >
      <template v-slot:item.division="{ item }">
        <LookupValue :value="item.division" />
      </template>
      <template v-slot:item.percentEach="{ item }">
        <SemesterValue type="percent" :value="item.percentEach" />
      </template>
      <template v-slot:item.percent="{ item }">
        <SemesterValue type="percent" :value="item.percent" />
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
        { sortable: false, text: 'Art', value: 'description' },
        {
          align: 'right',
          sortable: false,
          text: 'Anzahl',
          value: 'count',
        },
        {
          align: 'right',
          sortable: false,
          text: 'Prozent je',
          value: 'percentEach',
        },
        { align: 'right', sortable: false, text: 'Total', value: 'percent' },
      ],
    };
  },
};
</script>
