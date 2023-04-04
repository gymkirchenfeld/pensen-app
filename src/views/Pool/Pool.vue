<template>
  <Page
    icon="mdi-format-list-bulleted-type"
    title="Pool"
    v-model="schoolYear"
    schoolYearVisible
  >
    <template v-slot:toolbar>
      <Select
        class="mr-2"
        label="Typ"
        outlined
        resource="pooltype"
        showAll
        storeSelection="selectedPoolType"
        v-model="poolType"
      ></Select>
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
import { filterPerson, filterType, filterText } from '@/utils/table.js';
import Page from '@/components/Page.vue';
import SearchField from '@/components/SearchField.vue';
import Select from '@/components/Select.vue';
import Table from '@/components/Table.vue';

export default {
  components: {
    Page,
    SearchField,
    Select,
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
          value: 'type',
          sortable: false,
          text: 'Typ',
          type: 'lookup',
        },
        {
          value: 'percent1',
          align: 'right',
          sortable: false,
          text: 'Prozent 1. Sem.',
          type: 'percent',
        },
        {
          value: 'percent2',
          align: 'right',
          sortable: false,
          text: 'Prozent 2. Sem.',
          type: 'percent',
        },
      ],
      items: [],
      loading: false,
      poolType: null,
      schoolYear: null,
      search: '',
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter((item) => {
        return (
          (filterPerson(item.teacher, this.search) ||
            filterText(item.description, this.search)) &&
          filterType(item, this.poolType)
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
      this.$router.push({ name: 'PoolEdit', params: { id: -1 } });
    },
    edit(item) {
      this.$router.push({ name: 'PoolEdit', params: { id: item.id } });
    },
    async fetchData() {
      if (!this.schoolYear) return;
      this.loading = true;
      this.items = await this.apiList({
        resource: 'poolentry',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      this.loading = false;
    },
  },
};
</script>
