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
    <v-data-table
      dense
      v-if="!loading"
      disable-pagination
      fixed-header
      :headers="headers"
      hide-default-footer
      :items="filteredItems"
      :items-per-page="-1"
    >
      <template v-slot:item="params">
        <tr @click="edit(params.item)">
          <td :class="col.class" :key="i" v-for="(col, i) in params.headers">
            <LookupValue
              v-if="col.value === 'subject'"
              short
              :value="params.item[col.value]"
            ></LookupValue>
            <template v-else
              ><LessonTableEntry
                v-model="params.item[col.value]"
              ></LessonTableEntry
            ></template>
          </td>
        </tr>
      </template>
    </v-data-table>
    <router-view @dataChanged="fetchData"></router-view>
  </Page>
</template>
<script>
import LessonTableEntry from './LessonTableEntry.vue';
import LookupValue from '@/components/LookupValue.vue';
import Page from '@/components/Page.vue';
import Select from '@/components/Select.vue';
export default {
  components: {
    LessonTableEntry,
    LookupValue,
    Page,
    Select,
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
  computed: {
    filteredItems() {
      return this.items.filter((item) => this.filter(item));
    },
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
    buildHeaders(grades) {
      const headers = [
        {
          value: 'subject',
          text: 'Fach',
          sortable: false,
        },
      ];
      grades.forEach((grade) => {
        headers.push({
          sortable: false,
          text: grade.code,
          value: grade.id.toString(),
        });
      });
      this.headers = headers;
    },
    edit(item) {
      this.$router.push({
        name: 'LessonTableEdit',
        params: { id: item.id },
      });
    },
    async fetchData() {
      if (!(this.curriculum && this.division)) return;
      this.loading = true;
      let query = `curriculum=${this.curriculum.id}`;
      if (!this.crossClass) {
        query += `&division=${this.division.id}`;
      }
      const data = await this.apiList({
        resource: 'lessontable',
        query: query,
      });
      this.buildHeaders(data.grades);
      this.items = data.items;
      this.loading = false;
    },
    filter(item) {
      return !item.subject.archived;
    },
  },
};
</script>
