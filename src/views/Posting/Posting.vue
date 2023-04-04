<template>
  <Page
    icon="mdi-plus-minus-variant"
    title="IPB-Buchungen"
    v-model="schoolYear"
    schoolYearVisible
  >
    <template v-slot:toolbar>
      <SearchField v-model="search"></SearchField>
      <v-spacer></v-spacer>
      <v-btn outlined color="success" @click="add" class="ma-1"
        ><v-icon left>mdi-plus</v-icon> Neuer Eintrag
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
import { filterPerson, filterText } from '@/utils/table.js';
import Page from '@/components/Page.vue';
import SearchField from '@/components/SearchField.vue';
import Table from '@/components/Table.vue';

export default {
  components: {
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
        {
          value: 'description',
          sortable: false,
          text: 'Beschreibung',
        },
        {
          value: 'startDate',
          sortable: false,
          text: 'von',
          type: 'date',
        },
        {
          value: 'endDate',
          sortable: false,
          text: 'bis',
          type: 'date',
        },
        {
          value: 'totalPercent',
          align: 'right',
          sortable: false,
          text: 'Prozent',
          type: 'percent',
        },
      ],
      items: [],
      loading: false,
      schoolYear: null,
      search: '',
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
  methods: {
    add() {
      this.$router.push({ name: 'PostingEdit', params: { id: -1 } });
    },
    edit(item) {
      this.$router.push({ name: 'PostingEdit', params: { id: item.id } });
    },
    async fetchData() {
      if (!this.schoolYear) return;
      this.loading = true;
      this.items = await this.apiList({
        resource: 'posting',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      this.loading = false;
    },
  },
};
</script>
