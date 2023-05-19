<template>
  <Page icon="mdi-shape" title="Organisationseinheiten">
    <template v-slot:toolbar>
      <v-spacer></v-spacer>
      <v-btn outlined color="success" @click="add" class="ma-2"
        ><v-icon left>mdi-plus</v-icon> Neue Organisationseinheit
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
  components: { Page, Table },
  data() {
    return {
      headers: [
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
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    add() {
      this.$router.push({
        name: 'DivisionEdit',
        params: { id: -1 },
      });
    },
    edit(item) {
      this.$router.push({
        name: 'DivisionEdit',
        params: { id: item.id },
      });
    },
    async fetchData() {
      this.loading = true;
      this.items = await this.apiList({ resource: `division` });
      this.loading = false;
    },
  },
};
</script>
