<template>
  <Page icon="mdi-table-large" title="Lektionentafel">
    <template v-slot:toolbar>
      <Select
        v-model="curriculum"
        class="flex-grow-0 mr-5"
        label="Lehrgang"
        outlined
        resource="curriculum"
        storeSelection="selectedCurriculum"
      ></Select>
      <Select
        v-if="!crossClass"
        v-model="division"
        class="flex-grow-0 mr-5"
        label="Abteilung"
        outlined
        resource="division"
        showWhenNeeded
        storeSelection="selectedDivision"
      ></Select>
      <v-spacer></v-spacer>
      <v-switch
        hide-details
        label="gesamtschulisch"
        v-model="crossClass"
      ></v-switch>
    </template>
    <Table @click="edit" :headers="headers" :items="items" :loading="loading">
    </Table>
    <router-view @dataChanged="fetchData"></router-view>
  </Page>
</template>
<script>
import Page from '@/components/Page.vue';
import Select from '@/components/Select.vue';
import Table from '@/components/Table.vue';
export default {
  components: {
    Page,
    Select,
    Table,
  },
  data() {
    return {
      crossClass: false,
      curriculum: null,
      division: null,
      headers: [],
      items: [],
      loading: false,
    };
  },
  watch: {
    crossClass() {
      this.fetchData();
    },
    curriculum() {
      this.fetchData();
    },
    division() {
      this.fetchData();
    },
  },
  methods: {
    edit(item) {
      this.$router.push({
        name: 'DefaultLessonsEdit',
        params: { id: item.id },
      });
    },
    async fetchData() {
      if (!(this.curriculum && this.division)) return;
      this.loading = true;
      let query = `curriculum=${this.curriculum.id}`;
      if (this.crossClass) {
        query += `&crossClass=true`;
      } else {
        query += `&division=${this.division.id}`;
      }
      const res = await this.apiList({
        resource: 'defaultlessons',
        query: query,
      });
      const headers = [
        {
          value: 'subject',
          text: 'Fach',
          width: '125px',
          sortable: false,
          type: 'lookup',
          short: true,
        },
      ];
      res.grades.forEach((column) => {
        headers.push({
          value: column.id.toString() + '-1',
          text: column.code + '-1',
          align: 'right',
          sortable: false,
          type: 'lesson',
        });
        headers.push({
          value: column.id.toString() + '-2',
          text: column.code + '-2',
          align: 'right',
          sortable: false,
          type: 'lesson',
        });
      });
      this.items = [];
      res.items.forEach((entry) => {
        const item = {
          id: entry.id,
          subject: entry.subject,
        };
        res.grades.forEach((grade) => {
          item[grade.id + '-1'] = entry.lessons1[grade.id];
          item[grade.id + '-2'] = entry.lessons2[grade.id];
        });
        this.items.push(item);
      });
      this.headers = headers;
      this.loading = false;
    },
  },
};
</script>
