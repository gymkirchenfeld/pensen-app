<template>
  <div v-if="data">
    <p class="text-h5">Pensum: Unterricht</p>
    <v-data-table
      @click:row="(item) => editCourse(item)"
      dense
      :headers="headers"
      hide-default-footer
      :items="data.items"
      :items-per-page="-1"
    >
      <template v-slot:item.subject="{ item }">
        <LookupValue :value="item.subject" />
      </template>
      <template v-slot:item.schoolClasses="{ item }">
        {{
          item.schoolClasses.map((schoolClass) => schoolClass.code).join(', ')
        }}
      </template>
      <template v-slot:item.grade="{ item }">
        <LookupValue short :value="item.grade" />
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
          <td></td>
          <td class="text-right">
            <SemesterValue
              type="lessons"
              :value="data.total.lessons1"
            ></SemesterValue>
          </td>
          <td class="text-right">
            <SemesterValue
              type="percent"
              :value="data.total.percent1"
            ></SemesterValue>
          </td>
          <td class="text-right">
            <SemesterValue
              type="lessons"
              :value="data.total.lessons2"
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
    data: { type: Object, default: null },
  },
  data() {
    return {
      headers: [
        { sortable: false, text: 'Fach', value: 'subject' },
        { sortable: false, text: 'Klasse(n)', value: 'schoolClasses' },
        { sortable: false, text: 'Stufe', value: 'grade' },
        {
          align: 'right',
          sortable: false,
          text: 'Lektionen 1. Sem.',
          value: 'lessons1',
        },
        {
          align: 'right',
          sortable: false,
          text: 'Prozent 1. Sem.',
          value: 'percent1',
        },
        {
          align: 'right',
          sortable: false,
          text: 'Lektionen 2. Sem.',
          value: 'lessons2',
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
