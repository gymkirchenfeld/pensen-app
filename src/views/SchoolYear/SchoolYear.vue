<template>
  <Page icon="mdi-calendar-month" title="Schuljahre">
    <template v-slot:toolbar>
      <ShowArchivedSwitch v-model="showArchived"></ShowArchivedSwitch>
      <v-spacer></v-spacer>
      <v-btn outlined color="success" @click="add" class="ma-1"
        ><v-icon left>mdi-plus</v-icon> Neues Schuljahr
      </v-btn>
    </template>
    <Table
      @click="edit"
      :headers="headers"
      :items="filteredItems"
      :loading="loading"
      sort-by="graduationYear"
    >
    </Table>
    <router-view @dataChanged="fetchData"></router-view>
  </Page>
</template>
<script>
import { filterArchived } from '@/utils/table.js';
import Page from '@/components/Page.vue';
import ShowArchivedSwitch from '@/components/ShowArchivedSwitch.vue';
import Table from '@/components/Table.vue';
export default {
  components: { Page, ShowArchivedSwitch, Table },
  data() {
    return {
      headers: [
        {
          value: 'archived',
          sortable: false,
          text: '',
          type: 'icon',
          icon: 'mdi-archive',
          iconTooltip: 'archiviert',
        },
        {
          value: 'code',
          sortable: false,
          text: 'Kürzel',
        },
        {
          value: 'description',
          sortable: false,
          text: 'Bezeichnung',
        },
        {
          value: 'graduationYear',
          sortable: false,
          text: 'Maturjahr',
        },
      ],
      items: [],
      loading: false,
      showArchived: false,
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter((item) =>
        filterArchived(item, this.showArchived),
      );
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    add() {
      this.$router.push({ name: 'SchoolYearEdit', params: { id: -1 } });
    },
    edit(item) {
      this.$router.push({ name: 'SchoolYearEdit', params: { id: item.id } });
    },
    async fetchData() {
      this.loading = true;
      this.items = await this.apiList({ resource: 'schoolyear' });
      this.loading = false;
    },
  },
};
</script>
