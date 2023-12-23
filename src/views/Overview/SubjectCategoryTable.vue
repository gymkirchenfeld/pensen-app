<template>
  <v-data-table
    dense
    :headers="headers"
    hide-default-footer
    :items="items"
    :items-per-page="-1"
    :loading="loading"
  >
    <template v-slot:item.subjectCategory="{ item }">
      <LookupValue :value="item.subjectCategory" />
    </template>
    <template v-slot:item.lessons="{ item }">
      <SemesterValue
        type="lesson"
        :decimals="0"
        :first="item.lessons1"
        :second="item.lessons2"
      />
    </template>
    <template v-slot:item.open="{ item }">
      <SemesterValue
        type="lesson"
        :decimals="0"
        :first="item.open1"
        :second="item.open2"
      />
    </template>
    <template v-slot:item.closingBalance="{ item }">
      <SemesterValue type="percent" :value="item.closingBalance" />
    </template>
  </v-data-table>
</template>
<script>
import LookupValue from '@/components/LookupValue.vue';
import SemesterValue from '@/components/SemesterValue.vue';

function sumCourse(sum, course) {
  sum.lessons1 += course.lessons1;
  sum.lessons2 += course.lessons2;
  sum.open1 += course.open1;
  sum.open2 += course.open2;
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
        { text: 'Fachgebiet', value: 'subjectCategory' },
        {
          align: 'right',
          text: 'Total Lektionen 1. / 2. Sem.',
          value: 'lessons',
        },
        {
          align: 'right',
          text: 'nicht zugeteilte Lektionen 1. / 2. Sem.',
          value: 'open',
        },
      ],
      items: [],
      loading: false,
    };
  },
  methods: {
    async fetchData() {
      if (!this.schoolYear) return;
      this.loading = true;
      const subjectCategories = await this.apiList({
        resource: 'subjectcategory',
      });
      const map = {};
      subjectCategories.forEach((subjectCategory) => {
        map[subjectCategory.id] = {
          subjectCategory: subjectCategory,
          open1: 0.0,
          open2: 0.0,
          lessons1: 0.0,
          lessons2: 0.0,
        };
      });
      const courses = await this.apiList({
        resource: 'course',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      courses.forEach((course) => {
        sumCourse(map[course.subject.category.id], course);
      });
      this.items = [];
      subjectCategories.forEach((subjectCategory) => {
        this.items.push(map[subjectCategory.id]);
      });
      this.loading = false;
    },
  },
};
</script>
