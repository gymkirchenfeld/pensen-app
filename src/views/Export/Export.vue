<template>
  <Page
    icon="mdi-export-variant"
    title="Export"
    v-model="schoolYear"
    schoolYearVisible
  >
    <v-card class="mb-5">
      <v-card-title>Stundenplanung (CSV)</v-card-title>
      <v-card-text>
        <JobButton
          outlined
          text
          color="success"
          :prepare="prepareUntis1"
          class="mr-5"
          >Untis-Export 1. Semester</JobButton
        >
        <JobButton
          outlined
          text
          color="success"
          :prepare="prepareUntis2"
          class="mr-5"
          >Untis-Export 2. Semester</JobButton
        >
        <JobButton
          outlined
          text
          color="success"
          :prepare="perpareTeacherLessonSummary"
          >Unterrichtspensum</JobButton
        >
      </v-card-text>
    </v-card>
    <v-card class="mb-5">
      <v-card-title>Planung Liebefeld</v-card-title>
      <v-card-text>
        <JobButton
          outlined
          text
          color="success"
          class="mr-5"
          :prepare="prepareLiebefeld22"
          >Liebefeld 2/2</JobButton
        >
        <JobButton outlined text color="success" :prepare="prepareLiebefeld24"
          >Liebefeld 2/4</JobButton
        >
      </v-card-text></v-card
    >
    <v-card class="mb-5">
      <v-card-title>Lektionenzuteilung (PDF)</v-card-title>
      <v-card-text>
        <JobButton
          outlined
          text
          color="success"
          :prepare="prepareCoursesByTeacher"
          class="mr-5"
          >nach Lehrpersonen</JobButton
        >
        <JobButton
          outlined
          text
          color="success"
          :prepare="prepareCoursesBySubject"
          class="mr-5"
          >nach Fachgebiet</JobButton
        >
      </v-card-text>
    </v-card>
    <v-card class="mb-5">
      <v-card-title>nicht zugeteilte Pensen (PDF)</v-card-title>
      <v-card-text>
        <JobButton
          outlined
          text
          color="success"
          :prepare="prepareOpenWorkload"
          class="mr-5"
          >nicht zugeteilte Pensen</JobButton
        >
      </v-card-text>
    </v-card>
    <v-card class="mb-5">
      <v-card-title>Pensenblätter</v-card-title>
      <v-card-text>
        <Select
          v-model="division"
          class="mb-5"
          label="Organisationseinheit"
          outlined
          resource="division"
          showAll
          showWhenNeeded
          storeSelection="selectedDivision"
        ></Select>
        <JobButton
          outlined
          text
          color="success"
          :prepare="prepareWorkload"
          class="mr-5"
          >Pensenblätter herunterladen</JobButton
        >
        <MailDialog :division="division" :schoolYear="schoolYear"
          >Pensenblätter versenden</MailDialog
        >
      </v-card-text>
    </v-card>
    <v-card class="mb-5">
      <v-card-title>Pensenmeldung (CSV)</v-card-title>
      <v-card-text>
        <JobButton
          outlined
          text
          color="success"
          :prepare="preparePayroll1"
          class="mr-5"
          >Pensenmeldung 1. Semester</JobButton
        >
        <JobButton outlined text color="success" :prepare="preparePayroll2"
          >Pensenmeldung 2. Semester</JobButton
        >
      </v-card-text>
    </v-card>
  </Page>
</template>
<script>
import JobButton from '@/components/JobButton.vue';
import MailDialog from '@/components/MailDialog.vue';
import Page from '@/components/Page.vue';
import Select from '@/components/Select.vue';

export default {
  components: {
    JobButton,
    MailDialog,
    Page,
    Select,
  },
  data() {
    return {
      division: null,
      schoolYear: null,
    };
  },
  methods: {
    prepareCoursesBySubject() {
      return {
        name: 'SubjectCourseDownload',
        schoolYear: this.schoolYear,
      };
    },
    prepareCoursesByTeacher() {
      return {
        name: 'TeacherCourseDownload',
        schoolYear: this.schoolYear,
      };
    },
    prepareLiebefeld22() {
      return {
        name: 'GroupingCSVDownload',
        schoolYear: this.schoolYear,
        mode: 1,
      };
    },
    prepareLiebefeld24() {
      return {
        name: 'GroupingCSVDownload',
        schoolYear: this.schoolYear,
        mode: 2,
      };
    },
    prepareOpenWorkload() {
      return {
        name: 'OpenWorkloadDownload',
        schoolYear: this.schoolYear,
      };
    },
    preparePayroll1() {
      return {
        name: 'PayrollCSVDownload',
        schoolYear: this.schoolYear,
        semester: 1,
      };
    },
    preparePayroll2() {
      return {
        name: 'PayrollCSVDownload',
        schoolYear: this.schoolYear,
        semester: 2,
      };
    },
    perpareTeacherLessonSummary() {
      return {
        name: 'TeacherLessonSummaryCSVDownload',
        schoolYear: this.schoolYear,
      };
    },
    prepareTheses() {
      return {
        name: 'ThesisCSVDownload',
        schoolYear: this.schoolYear,
      };
    },
    prepareUntis1() {
      return {
        name: 'UntisDownload',
        schoolYear: this.schoolYear,
        semester: 1,
      };
    },
    prepareUntis2() {
      return {
        name: 'UntisDownload',
        schoolYear: this.schoolYear,
        semester: 2,
      };
    },
    prepareWorkload() {
      return {
        division: this.division,
        name: 'WorkloadDownload',
        schoolYear: this.schoolYear,
      };
    },
  },
};
</script>
