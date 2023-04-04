<template>
  <Page
    icon="mdi-account-check"
    schoolYearVisible
    title="Anstellungen"
    v-model="schoolYear"
  >
    <template v-slot:toolbar>
      <Select
        v-model="division"
        class="flex-grow-0 mr-2"
        label="Organisationseinheit"
        outlined
        resource="division"
        showAll
        showWhenNeeded
        storeSelection="selectedDivision"
      ></Select>
      <SearchField class="mr-2" v-model="search"></SearchField>
      <JobButton
        class="mr-5"
        outlined
        color="success"
        :prepare="prepareDownload"
        >Liste</JobButton
      >
      <v-spacer></v-spacer>
      <v-btn outlined color="success" @click="add" class="ma-1"
        ><v-icon left>mdi-plus</v-icon> Neue Anstellung
      </v-btn>
    </template>
    <Table
      @click="edit"
      :headers="headers"
      :items="filteredItems"
      :loading="loading"
      :rowClass="rowClass"
      sort-by="teacher.code"
    >
      <template v-slot:item.info="{ item }">
        <v-tooltip right v-if="item && item.comments">
          <template v-slot:activator="{ on, attrs }">
            <v-icon small class="mr-2" v-bind="attrs" v-on="on"
              >mdi-comment</v-icon
            >
          </template>
          {{ item.comments }}
        </v-tooltip>
      </template>
      <template v-slot:item.employment="{ item }">
        <PercentRange
          :min="item.employmentMin"
          :max="item.employmentMax"
        ></PercentRange>
      </template>
      <template v-slot:item.payment="{ item }">
        <SemesterValue
          type="percent"
          :first="item.payment1"
          :second="item.payment2"
        ></SemesterValue>
      </template>
    </Table>
    <router-view
      @dataChanged="fetchData"
      :schoolYear="schoolYear"
    ></router-view>
  </Page>
</template>
<script>
import { filterPerson } from '@/utils/table.js';
import JobButton from '@/components/JobButton.vue';
import Page from '@/components/Page.vue';
import PercentRange from '@/components/PercentRange.vue';
import SearchField from '@/components/SearchField.vue';
import Select from '@/components/Select.vue';
import Table from '@/components/Table.vue';

export default {
  components: {
    JobButton,
    Page,
    PercentRange,
    SearchField,
    Select,
    Table,
  },
  data() {
    return {
      division: {},
      headers: [
        {
          value: 'comments',
          sortable: false,
          text: '',
          type: 'comment',
        },
        {
          value: 'teacher.code',
          text: 'Kürzel',
        },
        {
          value: 'teacher.firstName',
          text: 'Vorname',
        },
        {
          value: 'teacher.lastName',
          text: 'Nachname',
        },
        {
          value: 'division',
          text: 'Abteilung',
          type: 'lookup',
          short: true,
        },
        {
          value: 'temporary',
          text: 'befristet',
          type: 'icon',
          icon: 'mdi-calendar',
          iconTooltip: 'befristet',
        },
        {
          value: 'payment',
          align: 'right',
          text: 'Auszahlung',
          type: 'percent',
        },
        {
          value: 'openingBalance',
          align: 'right',
          text: 'IPB-Anfangssaldo',
          type: 'percent',
        },
        {
          value: 'change',
          align: 'right',
          text: 'IPB-Veränderung',
          type: 'percent',
        },
        {
          value: 'closingBalance',
          align: 'right',
          text: 'IPB-Schlusssaldo',
          type: 'percent',
        },
      ],
      items: [],
      loading: false,
      schoolYear: {},
      search: '',
    };
  },
  watch: {
    schoolYear() {
      this.fetchData();
    },
  },
  computed: {
    filteredItems() {
      return this.items.filter(
        (item) =>
          (this.division.id === -1 || item.division.id === this.division.id) &&
          filterPerson(item.teacher, this.search),
      );
    },
    retiredLabel() {
      return this.retired ? 'Ehemalige sichtbar' : 'Ehemalige versteckt';
    },
  },
  methods: {
    add() {
      this.$router.push({ name: 'EmploymentEdit', params: { id: -1 } });
    },
    edit(item) {
      this.$router.push({
        name: 'EmploymentEdit',
        params: { id: item.id },
      });
    },
    async fetchData() {
      this.loading = true;
      this.items = await this.apiList({
        resource: 'employment',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      this.loading = false;
    },
    prepareDownload() {
      return {
        division: this.division,
        name: 'EmploymentCSVDownload',
        schoolYear: this.schoolYear,
      };
    },
    rowClass(item) {
      const abs = Math.abs(item.change);
      if (abs < 2.5) {
        return '';
      }

      let result = item.change < 0 ? 'red ' : 'green ';
      if (abs < 7.5) {
        result += 'lighten-4';
      } else if (abs < 12.5) {
        result += 'lighten-3';
      } else {
        result += 'lighten-2';
      }

      return result;
    },
  },
};
</script>
