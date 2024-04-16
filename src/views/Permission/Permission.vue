<template>
  <Page icon="mdi-key-variant" title="Berechtigungen">
    <template v-slot:toolbar>
      <v-btn outlined color="success" @click="add" class="ma-1"
        ><v-icon left>mdi-plus</v-icon> Neuer Eintrag
      </v-btn>
    </template>
    <Table @click="edit" :headers="headers" :items="items" :loading="loading">
    </Table>
    <router-view @dataChanged="fetchData"></router-view>
  </Page>
</template>
<script>
import Page from '@/components/Page.vue';
import Table from '@/components/Table.vue';

export default {
  components: {
    Page,
    Table,
  },
  data() {
    return {
      headers: [
        {
          value: 'accountName',
          sortable: false,
          text: 'Kontoname',
        },
        {
          value: 'editAllowed',
          text: 'kann bearbeiten',
          type: 'icon',
          icon: 'mdi-pencil',
          iconTooltip: 'kann bearbeiten',
        },
        {
          value: 'grantAllowed',
          text: 'kann Berechtigungen vergeben',
          type: 'icon',
          icon: 'mdi-key-variant',
          iconTooltip: 'kann Berechtigungen vergeben',
        },
      ],
      items: [],
      loading: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    add() {
      this.$router.push({ name: 'PermissionEdit', params: { id: -1 } });
    },
    edit(item) {
      this.$router.push({ name: 'PermissionEdit', params: { id: item.id } });
    },
    async fetchData() {
      this.loading = true;
      this.items = await this.apiList({
        resource: 'authorisation',
      });
      this.loading = false;
    },
  },
};
</script>
