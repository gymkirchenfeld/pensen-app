<template>
  <div v-if="data">
    <p class="text-h5 mt-8">Pensum: Übersicht</p>
    <v-data-table
      dense
      :headers="headers"
      hide-default-footer
      :items="data.items"
      :items-per-page="-1"
    >
      <template v-slot:item.semester1.percent="{ item }">
        <SemesterValue type="percent" :value="item.percent1" />
      </template>
      <template v-slot:item.semester1.ageRelief="{ item }">
        <SemesterValue type="percent" :value="item.ageRelief1" />
      </template>
      <template v-slot:item.semester2.percent="{ item }">
        <SemesterValue type="percent" :value="item.percent2" />
      </template>
      <template v-slot:item.semester2.ageRelief="{ item }">
        <SemesterValue type="percent" :value="item.ageRelief2" />
      </template>
      <template v-slot:item.percent="{ item }">
        <SemesterValue type="percent" :value="item.percentWithAgeRelief" />
      </template>
      <template slot="body.append">
        <tr class="font-weight-bold">
          <td>Total</td>
          <td class="text-right">
            <SemesterValue
              type="percent"
              :value="data.total.percent1"
            ></SemesterValue>
          </td>
          <td class="text-right">
            <SemesterValue
              type="percent"
              :value="data.total.ageRelief1"
            ></SemesterValue>
          </td>
          <td class="text-right">
            <SemesterValue
              type="percent"
              :value="data.total.percent2"
            ></SemesterValue>
          </td>
          <td class="text-right">
            <SemesterValue
              type="percent"
              :value="data.total.ageRelief2"
            ></SemesterValue>
          </td>
          <td class="text-right">
            <SemesterValue
              type="percent"
              :value="data.total.percentWithAgeRelief"
            ></SemesterValue>
          </td>
        </tr>
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
    data: { type: Object, default: null },
  },
  data() {
    return {
      headers: [
        { sortable: false, text: 'Bezeichnung', value: 'description' },
        {
          align: 'right',
          sortable: false,
          text: 'Prozent 1. Sem.',
          value: 'semester1.percent',
        },
        {
          align: 'right',
          sortable: false,
          text: 'AE 1. Sem.',
          value: 'semester1.ageRelief',
        },
        {
          align: 'right',
          sortable: false,
          text: 'Prozent 2. Sem.',
          value: 'semester2.percent',
        },
        {
          align: 'right',
          sortable: false,
          text: 'AE 2. Sem.',
          value: 'semester2.ageRelief',
        },
        {
          align: 'right',
          sortable: false,
          text: 'Prozent Jahr',
          value: 'percent',
        },
      ],
    };
  },
  watch: {
    data() {
      this.headers[2].text = 'AE 1. Sem.';
      if (this.data && this.data.ageReliefFactor1) {
        this.headers[2].text += ` (${this.data.ageReliefFactor1}%)`;
      }
      this.headers[4].text = 'AE 2. Sem.';
      if (this.data && this.data.ageReliefFactor2) {
        this.headers[4].text += ` (${this.data.ageReliefFactor2}%)`;
      }
    },
  },
};
</script>
