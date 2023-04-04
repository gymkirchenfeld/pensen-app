<template>
  <v-stepper-content step="4">
    Bitte warte, während die Schuljahreseröffnung durchgeführt wird.
    <JobView v-model="job">
      <v-alert outlined type="success">
        Das neue Schuljahr ist bereit.
      </v-alert>
    </JobView>
    <v-btn class="mr-5" outlined @click="next" color="success">
      <v-icon left>mdi-check</v-icon> Weiter
    </v-btn>
    <v-btn outlined @click="close">
      <v-icon left>mdi-close</v-icon> Abbrechen
    </v-btn>
  </v-stepper-content>
</template>
<script>
import JobView from '@/components/JobView.vue';
export default {
  components: {
    JobView,
  },
  props: {
    value: { type: Object, default: null },
  },
  data() {
    return {
      job: {},
      modelValue: this.value,
    };
  },
  created() {
    this.timeoutId = setTimeout(this._updateProgress, 1000);
  },
  methods: {
    close() {
      this.$emit('reset');
    },
    next() {
      this.$emit('next');
    },
    async _updateProgress() {
      this.timeoutId = setTimeout(this._updateProgress, 1000);
      if (!this.modelValue.job) return;
      const result = await this.apiGet({
        resource: 'job',
        id: this.modelValue.job.id,
      });
      console.log(result);
      this.job = result;
    },
  },
};
</script>
