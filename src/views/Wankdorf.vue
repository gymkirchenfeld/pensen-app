<template>
  <Page
    icon="mdi-home-group"
    title="Planung Wankdorf"
    schoolYearVisible
    v-model="schoolYear"
  >
    <template v-slot:toolbar>
      <SearchField
        hint="Klasse oder Kürzel einer Lehrperson"
        v-model="search"
      ></SearchField>
    </template>
    <v-data-table
      disable-pagination
      :headers="headers"
      hide-default-footer
      :items="filtered"
      :items-per-page="-1"
      :loading="loading"
    >
      <template v-slot:item.course1="{ item }">
        <Course show-title v-model="item.course1"></Course
      ></template>
      <template v-slot:item.course2="{ item }">
        <Course show-title v-model="item.course2"></Course
      ></template>
      <template v-slot:item.course3="{ item }">
        <Course show-title v-model="item.course3"></Course
      ></template>
      <template v-slot:item.course4="{ item }">
        <Course show-title v-model="item.course4"></Course
      ></template>
    </v-data-table>
  </Page>
</template>
<script>
import Course from '@/components/Course.vue';
import Page from '@/components/Page.vue';
import SearchField from '@/components/SearchField.vue';

const W_GRADES = ['GYM1', 'GYM2', 'GYM3', 'GYM4'];
const W_SUBJECTS = [
  'D',
  'E',
  'F',
  'G',
  'M',
  'Ge',
  'Me',
  'EWR',
  'SF PH',
  'SF PP',
  'SF WR',
];

export default {
  components: { Course, Page, SearchField },
  data() {
    return {
      courses: [],
      headers: [
        { text: 'Kurs 1', value: 'course1' },
        { text: 'Kurs 2', value: 'course2' },
        { text: 'Kurs 3', value: 'course3' },
        { text: 'Kurs 4', value: 'course4' },
      ],
      loading: false,
      schoolYear: {},
      search: '',
      items: [],
    };
  },
  watch: {
    schoolYear() {
      this.fetchData();
    },
  },
  computed: {
    filtered() {
      return this.items.filter(this.searchFilter);
    },
  },
  methods: {
    async fetchData() {
      if (!this.schoolYear) return;
      this.loading = true;
      this.items = [];
      this.courses = await this.apiList({
        resource: 'course',
        query: `&schoolYear=${this.schoolYear.id}`,
      });
      this.wankdorffeldstrasse();
      this.loading = false;
    },
    wankdorffeldstrasse() {
      const mapBySchoolClass = {};
      const mapByTeacher = {};
      this.courses.forEach((course) => {
        if (this.wFilter(course)) {
          const sc = course.schoolClasses[0].code;
          if (!(sc in mapBySchoolClass)) mapBySchoolClass[sc] = [];
          mapBySchoolClass[sc].push(course);
          course.teachers1.forEach((teacher) => {
            const tc = teacher.code;
            if (!(tc in mapByTeacher)) mapByTeacher[tc] = [];
            mapByTeacher[tc].push(course);
          });
        }
      });

      for (let sc1 in mapBySchoolClass) {
        mapBySchoolClass[sc1].forEach((course1) => {
          const t1 = course1.teachers1[0].code;
          mapByTeacher[t1].forEach((course2) => {
            const sc2 = course2.schoolClasses[0].code;
            if (sc2 != sc1) {
              mapBySchoolClass[sc2].forEach((course3) => {
                const t2 = course3.teachers1[0].code;
                if (t2 != t1) {
                  mapByTeacher[t2].forEach((course4) => {
                    if (course4.schoolClasses[0].code === sc1) {
                      this.addRow([course1, course2, course3, course4]);
                    }
                  });
                }
              });
            }
          });
        });
      }
    },
    addRow(courses) {
      courses.sort((a, b) => {
        return a.id - b.id;
      });
      let duplicate = false;
      this.items.forEach((item) => {
        if (
          item.course1.id === courses[0].id &&
          item.course2.id === courses[1].id &&
          item.course3.id === courses[2].id &&
          item.course4.id === courses[3].id
        ) {
          duplicate = true;
        }
      });
      if (duplicate) return;
      this.items.push({
        course1: courses[0],
        course2: courses[1],
        course3: courses[2],
        course4: courses[3],
      });
    },
    searchFilter(item) {
      return (
        this.courseSearchFilter(item.course1) ||
        this.courseSearchFilter(item.course2) ||
        this.courseSearchFilter(item.course3) ||
        this.courseSearchFilter(item.course4)
      );
    },
    courseSearchFilter(course) {
      return (
        !this.search ||
        course.teachers1[0].code === this.search ||
        course.schoolClasses[0].code === this.search
      );
    },
    wFilter(course) {
      const sc = course.subject.code;
      const gc = course.grade.code;
      return (
        course.schoolClasses.length === 1 &&
        course.teachers1.length === 1 &&
        W_SUBJECTS.indexOf(sc) !== -1 &&
        W_GRADES.indexOf(gc) !== -1
      );
    },
  },
};
</script>
