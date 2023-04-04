<template>
  <v-stepper-content step="3">
    Überprüfe die Schulklassen für das neue Schuljahr. Erfasse fehlende
    Klassen unten an der Tabelle.
    <v-data-table
      dense
      disable-pagination
      :headers="headers"
      hide-default-footer
      :items="modelValue.schoolClasses"
      sort-by="code"
    >
      <template v-slot:item.division="{ item }">
        <LookupValue short v-model="item.division"></LookupValue>
      </template>
      <template v-slot:item.curriculum="{ item }">
        <LookupValue short v-model="item.curriculum"></LookupValue>
      </template>
    </v-data-table>
    <v-card outlined class="mb-5">
      <v-list-item outlined>
        <v-text-field
          v-model="schoolClass.code"
          counter
          label="Kürzel"
          maxlength="10"
        ></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="schoolClass.graduationYear"
          label="Abschlussjahr"
          maxlength="4"
          lang="de-CH"
          type="number"
        ></v-text-field>
      </v-list-item>
      <v-list-item>
        <LookupInput
          v-model="schoolClass.curriculum"
          label="Lehrgang"
          resource="curriculum"
        ></LookupInput>
      </v-list-item>
      <v-list-item>
        <LookupInput
          v-model="schoolClass.division"
          label="Abteilung"
          resource="division"
        ></LookupInput>
      </v-list-item>
      <v-list-item>
        <v-spacer></v-spacer>
        <v-btn outlined @click="add" color="success">
          Hinzufügen
        </v-btn>
      </v-list-item>
    </v-card>
    <v-btn class="mr-5" outlined @click="next" color="success">
      <v-icon left>mdi-check</v-icon> Weiter
    </v-btn>
    <v-btn outlined @click="close">
      <v-icon left>mdi-close</v-icon> Abbrechen
    </v-btn>
  </v-stepper-content>
</template>
<script>
import LookupInput from '@/components/LookupInput.vue';
import LookupValue from '@/components/LookupValue.vue';
export default {
  components: {
    LookupInput,
    LookupValue,
  },
  props: {
    value: { type: Object, default: null },
  },
  data() {
    return {
      headers: [
        { text: 'Bezeichnung', value: 'code' },
        { text: 'Abteilung', value: 'division' },
        { text: 'Lehrgang', value: 'curriculum' },
        { text: 'Abschlussjahr', value: 'graduationYear' },
      ],
      modelValue: this.value,
      schoolClass: {},
     };
  },
  methods: {
    async add() {
      const schoolClass = await this.apiPost({
        resource: 'schoolclass',
        data: this.schoolClass,
      });
      this.modelValue.schoolClasses.push(schoolClass);
      this.schoolClass = {
        code: '',
        division: this.schoolClass.division,
        curriculum: this.schoolClass.curriculum,
        graduationYear: this.schoolClass.graduationYear,
      };
    },
    close() {
      this.$emit('reset');
    },
    async startJob(job) {
      this.modelValue.job = job;
      job.action = 'start';
      job.schoolYear = this.modelValue.schoolYear;
      await this.apiPut({
        resource: 'job',
        data: job,
      });
    },
    async next() {
      this.$emit('next');
      // get jobs
      const jobs = await this.apiList({ resource: 'job' });
      jobs.forEach(job => {
        if (job.name === 'InitializeSchoolYear') this.startJob(job);
      });
    },
  }
};
</script>