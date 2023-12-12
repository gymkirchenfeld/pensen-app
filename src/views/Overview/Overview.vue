<template>
  <Page
    icon="mdi-poll"
    title="Jahresüberblick"
    schoolYearVisible
    v-model="schoolYear"
  >
    <p class="text-h5">Übersicht nach Abteilung</p>
    <v-data-table
      dense
      :headers="divisionHeaders"
      hide-default-footer
      :items="divisions"
      :items-per-page="-1"
      :loading="loading"
    >
      <template v-slot:item.division="{ item }">
        <LookupValue :value="item.division" />
      </template>
      <template v-slot:item.payment1="{ item }">
        {{ (item.payment1 / 100).toFixed(1) }}
      </template>
      <template v-slot:item.payment2="{ item }">
        {{ (item.payment2 / 100).toFixed(1) }}
      </template>
      <template v-slot:item.closingBalance="{ item }">
        {{ item.closingBalance.toFixed() }} %
      </template>
    </v-data-table>

    <p class="text-h5 mt-10">Anstellung nach Geschlecht</p>
    <v-data-table
      dense
      :headers="genderHeaders"
      hide-default-footer
      :items="genders"
      :items-per-page="-1"
      :loading="loading"
    >
      <template v-slot:item.gender="{ item }">
        <LookupValue :value="item.gender" />
      </template>
      <template v-slot:item.employmentMin="{ item }">
        {{ item.employmentMin.toFixed() }} %
      </template>
      <template v-slot:item.employmentMax="{ item }">
        {{ item.employmentMax.toFixed() }} %
      </template>
    </v-data-table>

    <p class="text-h5 mt-10">Übersicht nach Fachgebiet</p>
    <v-data-table
      dense
      :headers="subjectCategoryHeaders"
      hide-default-footer
      :items="subjectCategories"
      :items-per-page="-1"
      :loading="loading"
    >
      <template v-slot:item.subjectCategory="{ item }">
        <LookupValue :value="item.subjectCategory" />
      </template>
      <template v-slot:item.lessons="{ item }">
        <SemesterValue
          type="lesson"
          :decimals="0"
          :first="item.lessons1"
          :second="item.lessons2"
        />
      </template>
      <template v-slot:item.open="{ item }">
        <SemesterValue
          type="lesson"
          :decimals="0"
          :first="item.open1"
          :second="item.open2"
        />
      </template>
      <template v-slot:item.closingBalance="{ item }">
        <SemesterValue type="percent" :value="item.closingBalance" />
      </template>
    </v-data-table>

    <p class="text-h5 mt-10">Übersicht Pool</p>
    <v-data-table
      dense
      :headers="poolHeaders"
      hide-default-footer
      :items="pool"
      :items-per-page="-1"
      :loading="loading"
    >
      <template v-slot:item.poolType="{ item }">
        <LookupValue :value="item.poolType" />
      </template>
      <template v-slot:item.percent1="{ item }">
        {{ item.percent1.toFixed() }} %
      </template>
      <template v-slot:item.percent2="{ item }">
        {{ item.percent2.toFixed() }} %
      </template>
      <template v-slot:item.percent="{ item }">
        {{ item.percent.toFixed() }} %
      </template>
    </v-data-table>

    <p class="text-h5 mt-10">Übersicht Teilanstellungen</p>
    <v-data-table
      dense
      :headers="payrollHeaders"
      hide-default-footer
      :items="payroll"
      :items-per-page="-1"
      :loading="loading"
    >
      <template v-slot:item.payrollType="{ item }">
        <LookupValue :value="item.payrollType" />
      </template>
      <template v-slot:item.lessons1="{ item }">
        <SemesterValue type="lessons" :value="item.lessons1" />
      </template>
      <template v-slot:item.percent1="{ item }">
        <SemesterValue type="percent" :value="item.percent1" />
      </template>
      <template v-slot:item.lessons2="{ item }">
        <SemesterValue type="lessons" :value="item.lessons2" />
      </template>
      <template v-slot:item.percent2="{ item }">
        <SemesterValue type="percent" :value="item.percent2" />
      </template>
    </v-data-table>
  </Page>
</template>
<script>
import LookupValue from '@/components/LookupValue.vue';
import Page from '@/components/Page.vue';
import SemesterValue from '@/components/SemesterValue.vue';

function sumCourse(sum, course) {
  sum.lessons1 += course.lessons1;
  sum.lessons2 += course.lessons2;
  sum.open1 += course.open1;
  sum.open2 += course.open2;
}

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

function sumPayroll(map, payroll) {
  payroll.items.forEach((item) => {
    const payroll = map[item.payrollType.id];
    payroll.lessons1 += item.lessons1;
    payroll.lessons2 += item.lessons2;
    payroll.percent1 += item.percent1;
    payroll.percent2 += item.percent2;
  });
}

function sumPool(sum, pool) {
  sum.percent1 += pool.percent1;
  sum.percent2 += pool.percent2;
  sum.percent += (pool.percent1 + pool.percent2) / 2.0;
}

export default {
  components: {
    LookupValue,
    Page,
    SemesterValue,
  },
  data() {
    return {
      loading: false,

      genders: [],
      genderHeaders: [
        { text: 'Geschlecht', value: 'gender' },
        { align: 'right', text: 'Anzahl Lehrpersonen', value: 'count' },
        { align: 'right', text: 'Anstellung min.', value: 'employmentMin' },
        { align: 'right', text: 'Anstellung max.', value: 'employmentMax' },
      ],
      subjectCategories: [],
      subjectCategoryHeaders: [
        { text: 'Fachgebiet', value: 'subjectCategory' },
        {
          align: 'right',
          text: 'Total Lektionen 1. / 2. Sem.',
          value: 'lessons',
        },
        {
          align: 'right',
          text: 'nicht zugeteilte Lektionen 1. / 2. Sem.',
          value: 'open',
        },
      ],
      divisions: [],
      divisionHeaders: [
        { text: 'Abteilung', value: 'division' },
        { align: 'right', text: 'Anzahl Lehrpersonen', value: 'count' },
        { align: 'right', text: 'Vollzeitstellen 1. Sem.', value: 'payment1' },
        { align: 'right', text: 'Vollzeitstellen 2. Sem.', value: 'payment2' },
        { align: 'right', text: 'IPB-Guthaben', value: 'closingBalance' },
      ],
      payroll: [],
      payrollHeaders: [
        { sortable: false, text: 'Bezeichnung', value: 'payrollType' },
        {
          sortable: false,
          align: 'right',
          text: 'Lektionen 1. Sem',
          value: 'lessons1',
        },
        {
          sortable: false,
          align: 'right',
          text: 'Prozent 1. Sem',
          value: 'percent1',
        },
        {
          sortable: false,
          align: 'right',
          text: 'Lektionen 2. Sem.',
          value: 'lessons2',
        },
        {
          sortable: false,
          align: 'right',
          text: 'Prozent 2. Sem.',
          value: 'percent2',
        },
      ],
      pool: [],
      poolHeaders: [
        { text: 'Pool', value: 'poolType' },
        { align: 'right', text: '1. Sem.', value: 'percent1' },
        { align: 'right', text: '2. Sem.', value: 'percent2' },
        { align: 'right', text: 'Total', value: 'percent' },
      ],
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
      await this.fetchCourses();
      await this.fetchEmployments();
      await this.fetchPool();
      await this.fetchWorkload();
      this.loading = false;
    },
    async fetchCourses() {
      const subjectCategories = await this.apiList({
        resource: 'subjectcategory',
      });
      const map = {};
      subjectCategories.forEach((subjectCategory) => {
        map[subjectCategory.id] = {
          subjectCategory: subjectCategory,
          open1: 0.0,
          open2: 0.0,
          lessons1: 0.0,
          lessons2: 0.0,
        };
      });
      const courses = await this.apiList({
        resource: 'course',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      courses.forEach((course) => {
        sumCourse(map[course.subject.category.id], course);
      });
      this.subjectCategories = [];
      subjectCategories.forEach((subjectCategory) => {
        this.subjectCategories.push(map[subjectCategory.id]);
      });
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
    async fetchPool() {
      const poolTypes = await this.apiList({ resource: 'pooltype' });
      const map = {};
      poolTypes.forEach((poolType) => {
        map[poolType.id] = {
          poolType: poolType,
          percent1: 0.0,
          percent2: 0.0,
          percent: 0.0,
        };
      });
      const pool = await this.apiList({
        resource: 'poolentry',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      pool.forEach((poolEntry) => {
        sumPool(map[poolEntry.type.id], poolEntry);
      });
      this.pool = [];
      poolTypes.forEach((poolType) => {
        this.pool.push(map[poolType.id]);
      });
    },
    async fetchWorkload() {
      const payrollTypes = await this.apiList({ resource: 'payrolltype' });
      const map = {};
      payrollTypes.forEach((payrollType) => {
        map[payrollType.id] = {
          payrollType: payrollType,
          lessons1: 0,
          lessons2: 0,
          percent1: 0,
          percent2: 0,
        };
      });
      const workloads = await this.apiList({
        resource: 'workload',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      workloads.forEach((workload) => {
        sumPayroll(map, workload.payroll);
      });
      this.payroll = [];
      payrollTypes.forEach((payrollType) => {
        this.payroll.push(map[payrollType.id]);
      });
    },
  },
};
</script>
