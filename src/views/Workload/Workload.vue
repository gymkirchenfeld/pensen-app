<template>
  <Page
    icon="mdi-account-box"
    title="Pensenblatt"
    v-model="schoolYear"
    schoolYearVisible
  >
    <template v-slot:toolbar>
      <TeacherSelect :schoolYear="schoolYear" v-model="teacher"></TeacherSelect>
      <JobButton
        class="mr-5"
        outlined
        color="success"
        :prepare="prepareDownload"
        >PDF</JobButton
      >
      <MailDialog :schoolYear="schoolYear" :teacher="teacher"
        >E-Mail</MailDialog
      >
    </template>
    <v-card class="overflow-y-auto" id="fixedCard">
      <v-card-text>
        <Courses v-if="workload" :data="workload.course" />
        <Pool
          v-if="workload && workload.pool"
          :data="workload.pool"
          :ageReliefIncluded="workload.ageReliefIncluded"
        />
        <Theses v-if="workload && workload.thesis" :data="workload.thesis" />
        <Summary v-if="workload" :data="workload.summary" />
        <Postings
          v-if="workload && workload.postings"
          :data="workload.postings"
        />
        <Payroll v-if="workload" :data="workload.payroll" />
        <Balance v-if="workload" :data="workload.balance" />
      </v-card-text>
    </v-card>
    <router-view></router-view>
  </Page>
</template>
<script>
import Balance from './Balance.vue';
import Courses from './Courses.vue';
import MailDialog from '@/components/MailDialog.vue';
import Payroll from './Payroll.vue';
import Pool from './Pool.vue';
import Postings from './Postings.vue';
import Summary from './Summary.vue';
import Theses from './Theses.vue';
import JobButton from '@/components/JobButton.vue';
import Page from '@/components/Page.vue';
import TeacherSelect from '@/components/TeacherSelect.vue';
export default {
  components: {
    Balance,
    Courses,
    MailDialog,
    Payroll,
    Pool,
    Postings,
    Summary,
    Theses,
    JobButton,
    Page,
    TeacherSelect,
  },
  data() {
    return {
      teacher: null,
      schoolYear: null,
      workload: {},
    };
  },
  watch: {
    teacher() {
      this.fetchData();
    },
  },
  methods: {
    editCourse(item) {
      if (!item.id) return;
      this.$router.push({
        name: item.special ? 'SpecialCourseEdit' : 'CourseEdit',
        params: { id: item.id },
      });
    },
    editPoolEntry(item) {
      if (!item.id) return;
      this.$router.push({ name: 'PoolEdit', params: { id: item.id } });
    },
    editPosting(item) {
      if (!item.id) return;
      this.$router.push({ name: 'PostingEdit', params: { id: item.id } });
    },
    editThesisEntry(item) {
      if (!item.id) return;
      this.$router.push({ name: 'ThesisEdit', params: { id: item.id } });
    },
    async fetchData() {
      this.workload = {};
      if (!this.teacher || !this.schoolYear) return;
      this.workload = await this.apiList({
        resource: 'workload',
        query: `teacher=${this.teacher.id}&schoolYear=${this.schoolYear.id}`,
      });
    },
    prepareDownload() {
      return {
        name: 'WorkloadDownload',
        schoolYear: this.schoolYear,
        teacher: this.teacher,
      };
    },
  },
};
</script>
<style>
#fixedCard {
  height: calc(100vh - 160px) !important;
}
</style>
