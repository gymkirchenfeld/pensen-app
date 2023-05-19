<template>
  <Page icon="mdi-book-open-variant" title="Fächer">
    <template v-slot:toolbar>
      <Select
        v-model="subjectType"
        class="flex-grow-0 mr-5"
        label="Typ"
        outlined
        resource="subjecttype"
        showAll
        storeSelection="selectedSubjectType"
      ></Select>
      <ShowArchivedSwitch v-model="showArchived"></ShowArchivedSwitch>
      <v-spacer></v-spacer>
      <v-btn outlined color="success" @click="add" class="ma-1"
        ><v-icon left>mdi-plus</v-icon> Neues Fach
      </v-btn>
    </template>
    <Table
      @click="edit"
      :headers="headers"
      :items="filteredItems"
      :loading="loading"
      sort-by="code"
    >
    </Table>
    <router-view @dataChanged="fetchData"></router-view>
  </Page>
</template>
<script>
import { filterArchived, filterType } from '@/utils/table.js';
import Page from '@/components/Page.vue';
import ShowArchivedSwitch from '@/components/ShowArchivedSwitch.vue';
import Select from '@/components/Select.vue';
import Table from '@/components/Table.vue';
export default {
  components: { Page, ShowArchivedSwitch, Select, Table },
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
          text: 'Bezeichnung',
        },
        {
          value: 'type',
          text: 'Typ',
          type: 'lookup',
        },
      ],
      items: [],
      loading: false,
      showArchived: false,
      subjectType: {},
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter(
        (item) =>
          filterArchived(item, this.showArchived) &&
          filterType(item, this.subjectType),
      );
    },
  },
  created() {
    this.fetchData();
  },
  methods: {
    add() {
      this.$router.push({ name: 'SubjectEdit', params: { id: -1 } });
    },
    edit(item) {
      this.$router.push({ name: 'SubjectEdit', params: { id: item.id } });
    },
    async fetchData() {
      this.loading = true;
      this.items = await this.apiList({ resource: 'subject' });
      this.loading = false;
    },
  },
};
</script>
