<template>
  <Page icon="mdi-school" title="Lehrgänge">
    <template v-slot:toolbar>
      <ShowArchivedSwitch v-model="showArchived"></ShowArchivedSwitch>
      <v-spacer></v-spacer>
    </template>
    <Table
      @click="edit"
      :headers="headers"
      :items="filteredItems"
      :loading="loading"
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
          text: 'Kürzel',
        },
        {
          value: 'description',
          text: 'Beschreibung',
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
      this.$router.push({
        name: 'CurriculumEdit',
        params: { id: -1 },
      });
    },
    edit(item) {
      this.$router.push({
        name: 'CurriculumEdit',
        params: { id: item.id },
      });
    },
    async fetchData() {
      this.items = await this.apiList({ resource: `curriculum` });
    },
  },
};
</script>
