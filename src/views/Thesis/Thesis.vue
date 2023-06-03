<template>
  <Page
    icon="mdi-school"
    title="Abschlussarbeiten"
    v-model="schoolYear"
    schoolYearVisible
  >
    <template v-slot:toolbar>
      <SearchField v-model="search"></SearchField>
      <v-spacer></v-spacer>
      <JobButton
        v-if="!selecting"
        class="mr-5"
        outlined
        color="success"
        :prepare="prepareDownload"
        >Liste</JobButton
      >
    </template>
    <Table
      @click="edit"
      :headers="headers"
      :items="filteredItems"
      :loading="loading"
      sort-by="lastName"
    >
    </Table>
    <router-view
      @dataChanged="fetchData"
      :schoolYear="schoolYear"
    ></router-view>
  </Page>
</template>
<script>
import { filterPerson, filterText } from '@/utils/table.js';
import JobButton from '@/components/JobButton.vue';
import Page from '@/components/Page.vue';
import SearchField from '@/components/SearchField.vue';
import Table from '@/components/Table.vue';

export default {
  components: {
    JobButton,
    Page,
    SearchField,
    Table,
  },
  data() {
    return {
      headers: [
        {
          value: 'teacher',
          sortable: false,
          text: 'Lehrperson',
          type: 'teacher',
        },
      ],
      items: [],
      loading: false,
      schoolYear: null,
      search: '',
      thesisTypes: [],
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter((item) => {
        return (
          filterPerson(item.teacher, this.search) ||
          filterText(item.description, this.search)
        );
      });
    },
  },
  watch: {
    schoolYear() {
      this.fetchData();
    },
  },
  async created() {
    this.thesisTypes = await this.apiList({ resource: 'thesistype' });
    this.thesisTypes.forEach((thesisType) => {
      this.headers.push({
        sortable: false,
        align: 'right',
        text: thesisType.description,
        value: thesisType.id.toString(),
      });
    });
    this.fetchData();
  },
  methods: {
    edit(item) {
      this.$router.push({
        name: 'ThesisEdit',
        params: { id: item.id },
      });
    },
    async fetchData() {
      if (!this.schoolYear) return;
      this.loading = true;
      this.items = await this.apiList({
        resource: 'thesis',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      this.loading = false;
    },
    prepareDownload() {
      return {
        name: 'ThesisCSVDownload',
        schoolYear: this.schoolYear,
      };
    },
  },
};
</script>
