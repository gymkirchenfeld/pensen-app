<template>
  <Page icon="mdi-cogs" title="Wartung">
    <v-card v-for="job in jobs" :key="job.id" class="mb-5">
      <v-card-title>{{ job.title }}</v-card-title>
      <v-card-text>
        <JobView :value="job"></JobView>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions
        ><v-btn
          :disabled="job.running"
          @click="startJob(job)"
          text
          color="success"
          >Starten</v-btn
        ></v-card-actions
      ></v-card
    ></Page
  >
</template>
<script>
import JobView from '@/components/JobView.vue';
import Page from '@/components/Page.vue';

export default {
  components: {
    JobView,
    Page,
  },
  data() {
    return {
      jobs: [],
      division: null,
      schoolYear: null,
      timeoutId: null,
    };
  },
  created() {
    this.fetchData();
  },
  destroyed() {
    clearTimeout(this.timeoutId);
  },
  methods: {
    async fetchData() {
      this.jobs = await this.apiList({ resource: 'job' });
      this.timeoutId = setTimeout(this.fetchData, 1000);
    },
    async startJob(job) {
      job.action = 'start';
      job.schoolYear = this.schoolYear;
      await this.apiPut({
        resource: 'job',
        data: job,
      });
    },
  },
};
</script>
