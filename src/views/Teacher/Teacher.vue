<template>
  <Page icon="mdi-account" title="Lehrpersonen">
    <template v-slot:toolbar>
      <ShowArchivedSwitch v-model="showArchived"></ShowArchivedSwitch>
      <v-spacer></v-spacer>
      <v-btn outlined color="success" @click="add" class="ma-1"
        ><v-icon left>mdi-plus</v-icon> Neue Lehrperson
      </v-btn>
    </template>
    <Table
      @click="edit"
      :headers="headers"
      :items="filteredItems"
      :loading="loading"
      sort-by="lastName"
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
  components: {
    Page,
    ShowArchivedSwitch,
    Table,
  },
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
          value: 'firstName',
          text: 'Vorname',
        },
        {
          value: 'lastName',
          text: 'Nachname',
        },
        {
          value: 'employeeNumber',
          text: 'Personalnummer',
        },
        {
          value: 'email',
          text: 'E-Mail-Adresse',
        },
        {
          value: 'birthday',
          text: 'Geburtsdatum',
          type: 'date',
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
      this.$router.push({ name: 'TeacherEdit', params: { id: -1 } });
    },
    edit(item) {
      this.$router.push({ name: 'TeacherEdit', params: { id: item.id } });
    },
    openImport() {
      this.$router.push({ name: 'TeacherImport' });
    },
    async fetchData() {
      this.loading = true;
      this.items = await this.apiList({ resource: 'teacher' });
      this.loading = false;
    },
  },
};
</script>
