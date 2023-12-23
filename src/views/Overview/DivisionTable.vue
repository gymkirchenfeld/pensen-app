<template>
  <v-data-table
    dense
    :headers="headers"
    hide-default-footer
    :items="items"
    :items-per-page="-1"
    :loading="loading"
  >
    <template v-slot:item.division="{ item }">
      <LookupValue :value="item.division" />
    </template>
    <template v-slot:item.payment1="{ item }">
      {{ (item.payment1 / 100).toFixed(1) }}
    </template>
    <template v-slot:item.payment2="{ item }">
      {{ (item.payment2 / 100).toFixed(1) }}
    </template>
    <template v-slot:item.closingBalance="{ item }">
      {{ item.closingBalance.toFixed() }} %
    </template>
    <template slot="body.append">
      <tr class="font-weight-bold">
        <td>Total</td>
        <td class="text-right">{{ total.count }}</td>
        <td class="text-right">{{ (total.payment1 / 100).toFixed(1) }}</td>
        <td class="text-right">{{ (total.payment2 / 100).toFixed(1) }}</td>
        <td class="text-right">{{ total.closingBalance.toFixed() + ' %' }}</td>
      </tr>
    </template>
  </v-data-table>
</template>
<script>
import LookupValue from '@/components/LookupValue.vue';

function initTotal() {
  return {
    closingBalance: 0.0,
    count: 0,
    payment1: 0.0,
    payment2: 0.0,
  };
}

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
        { text: 'Abteilung', value: 'division' },
        { align: 'right', text: 'Anzahl Lehrpersonen', value: 'count' },
        { align: 'right', text: 'Vollzeitstellen 1. Sem.', value: 'payment1' },
        { align: 'right', text: 'Vollzeitstellen 2. Sem.', value: 'payment2' },
        { align: 'right', text: 'IPB-Guthaben', value: 'closingBalance' },
      ],
      total: initTotal(),
    };
  },
  watch: {
    items() {
      this.total = initTotal();
      this.items.forEach((item) => {
        this.total.closingBalance += item.closingBalance;
        this.total.count += item.count;
        this.total.payment1 += item.payment1;
        this.total.payment2 += item.payment2;
      });
    },
  },
};
</script>
