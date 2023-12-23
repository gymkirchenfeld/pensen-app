<template>
  <Page
    icon="mdi-poll"
    title="Jahresüberblick"
    schoolYearVisible
    v-model="schoolYear"
  >
    <p class="text-h5">Übersicht nach Abteilung</p>
    <DivisionTable :items="divisions" :loading="loading"></DivisionTable>

    <p class="text-h5 mt-10">Anstellung nach Geschlecht</p>
    <GenderTable :items="genders" :loading="loading"></GenderTable>

    <p class="text-h5 mt-10">Übersicht nach Fachgebiet</p>
    <SubjectCategoryTable :schoolYear="schoolYear"></SubjectCategoryTable>

    <p class="text-h5 mt-10">Übersicht Pool</p>
    <PoolTable :schoolYear="schoolYear"></PoolTable>

    <p class="text-h5 mt-10">Übersicht Teilanstellungen</p>
    <PayrollTable :schoolYear="schoolYear"></PayrollTable>
  </Page>
</template>
<script>
import DivisionTable from './DivisionTable.vue';
import GenderTable from './GenderTable.vue';
import Page from '@/components/Page.vue';
import PayrollTable from './PayrollTable.vue';
import PoolTable from './PoolTable.vue';
import SubjectCategoryTable from './SubjectCategoryTable.vue';

function sumEmployment(sum, employment) {
  sum.count += 1;
  sum.payment1 += employment.payment1;
  sum.payment2 += employment.payment2;
  sum.closingBalance += employment.closingBalance;
}

function sumGender(sum, employment) {
  sum.count += 1;
  sum.employmentMin += employment.employmentMin;
  sum.employmentMax += employment.employmentMax;
}

export default {
  components: {
    DivisionTable,
    GenderTable,
    Page,
    PayrollTable,
    PoolTable,
    SubjectCategoryTable,
  },
  data() {
    return {
      loading: false,
      genders: [],
      divisions: [],
      schoolYear: null,
    };
  },
  watch: {
    schoolYear() {
      this.fetchData();
    },
  },
  computed: {
    filtered() {
      return this.items.filter(this.searchFilter);
    },
  },
  methods: {
    async fetchData() {
      if (!this.schoolYear) return;
      this.loading = true;
      await this.fetchEmployments();
      this.loading = false;
    },
    async fetchEmployments() {
      const divisions = await this.apiList({ resource: 'division' });
      const divisionMap = {};
      divisions.forEach((division) => {
        divisionMap[division.id] = {
          count: 0,
          division: division,
          payment1: 0.0,
          payment2: 0.0,
          closingBalance: 0.0,
        };
      });
      const genders = await this.apiList({ resource: 'gender' });
      const genderMap = {};
      genders.forEach((gender) => {
        genderMap[gender.id] = {
          gender: gender,
          count: 0,
          employmentMin: 0.0,
          employmentMax: 0.0,
        };
      });
      const employments = await this.apiList({
        resource: 'employment',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      employments.forEach((employment) => {
        sumEmployment(divisionMap[employment.division.id], employment);
        const gender = employment.teacher.gender;
        if (gender) sumGender(genderMap[gender.id], employment);
      });
      this.divisions = [];
      divisions.forEach((division) => {
        this.divisions.push(divisionMap[division.id]);
      });
      this.genders = [];
      genders.forEach((gender) => {
        this.genders.push(genderMap[gender.id]);
      });
    },
  },
};
</script>
