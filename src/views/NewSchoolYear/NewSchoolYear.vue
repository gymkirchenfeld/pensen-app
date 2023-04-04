<template>
  <Page icon="mdi-calendar-plus" title="Schuljahr eröffnen">
    <template v-slot:toolbar> </template>
    <v-stepper vertical v-model="step" height="100%">
      <v-stepper-step :complete="step > 1" step="1">
        Abschlussjahr wählen
      </v-stepper-step>
      <Step1 v-model="data" @next="step += 1"></Step1>
      <v-stepper-step :complete="step > 2" step="2">
        Basisdaten erfassen
      </v-stepper-step>
      <Step2 v-model="data" @next="step += 1" @reset="step = 1"></Step2>
      <v-stepper-step :complete="step > 3" step="3">
        Schulklassen erfassen
      </v-stepper-step>
      <Step3 v-model="data" @next="step += 1" @reset="step = 1"></Step3>
      <v-stepper-step :complete="step > 4" step="4">
        Schuljahreseröffnung durchführen
      </v-stepper-step>
      <Step4 v-model="data" @next="step += 1" @reset="step = 1"></Step4>
    </v-stepper>
  </Page>
</template>
<script>
import Page from '@/components/Page.vue';
import Step1 from './Step1.vue';
import Step2 from './Step2.vue';
import Step3 from './Step3.vue';
import Step4 from './Step4.vue';

export default {
  components: {
    Page,
    Step1,
    Step2,
    Step3,
    Step4,
  },
  data() {
    return {
      headers: [{ text: 'Lehrperson', value: 'teacher' }],
      data: {
        graduationYear: 0,
        job: null,
        schoolClasses: [],
        schoolYear: {},
      },
      step: 1,
    };
  },
  computed: {
    typeLabel() {
      return this.type ? 'Maturaarbeiten' : 'Abschlussarbeiten FMS';
    },
  },
  watch: {
    schoolYear() {
      this.step = 1;
    },
  },
  async created() {
    const schoolYears = await this.apiList({ resource: 'schoolyear' });
    let candidate = null;
    schoolYears.forEach((schoolYear) => {
      if (!candidate || schoolYear.graduationYear > candidate) {
        candidate = schoolYear.graduationYear;
      }
    });
    this.data.graduationYear = candidate;
  },
};
</script>
