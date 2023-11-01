<template>
  <v-stepper-content step="2">
    Gib Kürzel und Bezeichnung des neuen Schuljahres ein. Passe allenfalls die
    Anzahl Schulwochen an.
    <v-list>
      <v-list-item>
        <v-text-field
          v-model="modelValue.schoolYear.code"
          counter
          label="Kürzel"
          maxlength="10"
        ></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="modelValue.schoolYear.description"
          counter
          label="Bezeichnung"
          maxlength="100"
        ></v-text-field>
      </v-list-item>
      <v-list-item>
        <v-text-field
          v-model="modelValue.schoolYear.weeks"
          label="Anzahl Schulwochen für Einzellektionen"
          lang="de-CH"
          type="number"
        ></v-text-field>
      </v-list-item>
      <v-list-item>
        <LookupInput
          v-model="modelValue.schoolYear.calculationMode"
          label="Berechnungsmodus"
          resource="calculationmode"
        ></LookupInput>
      </v-list-item>
    </v-list>
    <v-alert outlined v-if="modelValue.schoolYear.id" type="success">
      Das Schuljahr ist bereits erstellt worden.
    </v-alert>
    <v-btn
      class="mr-5"
      outlined
      :disabled="!valid"
      @click="next"
      color="success"
    >
      <v-icon left>mdi-check</v-icon> Weiter
    </v-btn>
    <v-btn outlined @click="close">
      <v-icon left>mdi-close</v-icon> Abbrechen
    </v-btn>
  </v-stepper-content>
</template>
<script>
import LookupInput from '@/components/LookupInput.vue';

export default {
  components: {
    LookupInput,
  },
  props: {
    value: { type: Object, default: null },
  },
  data() {
    return {
      modelValue: this.value,
    };
  },
  computed: {
    valid() {
      const sy = this.modelValue.schoolYear;
      return sy.calculationMode && sy.code && sy.description;
    },
  },
  methods: {
    close() {
      this.$emit('reset');
    },
    async next() {
      const schoolYear = this.modelValue.schoolYear;
      if (schoolYear.id) {
        await this.apiPut({ resource: 'schoolyear', data: schoolYear });
      } else {
        this.modelValue.schoolYear = await this.apiPost({
          resource: 'schoolyear',
          data: schoolYear,
        });
      }
      const schoolClasses = await this.apiList({
        resource: 'schoolclass',
        query: `schoolYear=${this.modelValue.schoolYear.id}`,
      });
      schoolClasses.forEach((schoolClass) => {
        schoolClass.status = 'unknown';
        schoolClass.progress = 0;
      });
      this.modelValue.schoolClasses = schoolClasses;
      this.$emit('next');
    },
  },
};
</script>
