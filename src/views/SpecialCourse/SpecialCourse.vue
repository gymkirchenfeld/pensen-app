<template>
  <Page
    icon="mdi-card-account-details-star-outline"
    title="Planung gesamtschulische Kurse"
    v-model="schoolYear"
    schoolYearVisible
  >
    <template v-slot:toolbar>
      <Select
        v-model="subjectType"
        class="flex-grow-0 mr-5"
        label="Fachtyp"
        outlined
        resource="subjecttype"
        showAll
        storeSelection="selectedSubjectType"
      ></Select>
      <v-spacer></v-spacer>
      <v-btn outlined color="success" @click="add" class="ma-1"
        ><v-icon left>mdi-plus</v-icon> Neuer Kurs
      </v-btn>
    </template>
    <Table
      @click="edit"
      :headers="headers"
      :items="filteredItems"
      :loading="loading"
    >
    </Table>
    <router-view
      @dataChanged="fetchData"
      :schoolYear="schoolYear"
    ></router-view>
  </Page>
</template>
<script>
import { filterType } from '@/utils/table.js';
import Page from '@/components/Page.vue';
import Select from '@/components/Select.vue';
import Table from '@/components/Table.vue';

export default {
  components: { Page, Select, Table },
  data() {
    return {
      headers: [
        {
          value: 'info',
          sortable: false,
          text: '',
        },
        {
          value: 'subject',
          sortable: false,
          text: 'Fach',
          type: 'lookup',
          short: true,
        },
        {
          value: 'grade',
          sortable: false,
          text: 'Stufe',
          type: 'lookup',
          short: true,
        },
        {
          value: 'lessons1',
          sortable: false,
          text: '1. Semester',
          type: 'lesson',
        },
        {
          value: 'teachers1',
          sortable: false,
          text: '1. Semester',
        },
        {
          value: 'lessons2',
          sortable: false,
          text: '2. Semester',
          type: 'lesson',
        },
        {
          value: 'teachers2',
          sortable: false,
          text: '2. Semester',
        },
      ],
      items: [],
      loading: false,
      schoolYear: null,
      subjectType: null,
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter((item) =>
        filterType(item.subject, this.subjectType),
      );
    },
  },
  watch: {
    async schoolYear() {
      this.fetchData();
    },
  },
  methods: {
    add() {
      this.$router.push({
        name: 'SpecialCourseEdit',
        params: { id: -1, schoolYearId: this.schoolYear.id },
      });
    },
    edit(item) {
      this.$router.push({ name: 'SpecialCourseEdit', params: { id: item.id } });
    },
    async fetchData() {
      if (!this.schoolYear) return;
      this.loading = true;
      this.items = await this.apiList({
        resource: 'course',
        query: `schoolYear=${this.schoolYear.id}&crossClass=true`,
      });
      this.items.forEach((item) => {
        item.teachers1 = item.teachers1
          .map((teacher) => teacher.code)
          .join(', ');
        item.teachers2 = item.teachers2
          .map((teacher) => teacher.code)
          .join(', ');
      });
      this.items.sort((a, b) => {
        if (a.subject.code === b.subject.code) {
          if (a.grade.code === b.grade.code) {
            return a.id > b.id;
          }
          return a.grade.code < b.grade.code;
        }
        return a.subject.code > b.subject.code;
      });
      this.loading = false;
    },
  },
};
</script>
