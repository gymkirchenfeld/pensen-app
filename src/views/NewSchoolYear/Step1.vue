<template>
  <v-stepper-content step="1">
    Wähle das Abschlussjahr für das zu eröffnende Schuljahr. Das 
    Abschlussjahr ist das Kalenderjahr, in welchem die Abschlussprüfungen in
    diesem Schuljahr stattfinden. Beispielsweise hat das Schuljahr 2022/23
    das Abschlussjahr 2023.
    <v-text-field
      v-model="modelValue.graduationYear"
      label="Abschlussjahr"
      lang="de-CH"
      type="number"
    ></v-text-field>
    <v-btn outlined @click="next" color="success">
      <v-icon left>mdi-check</v-icon> Weiter
    </v-btn>
  </v-stepper-content>
</template>
<script>
export default {
  props: {
    value: { type: Object, default: null },
  },
  data() {
    return {
      modelValue: this.value,
     };
  },
  methods: {
    async next() {
      const schoolYears = await this.apiList({ resource: 'schoolyear' });
      let last = null;
      let matching = null;
      schoolYears.forEach(schoolYear => {
        if (!last || schoolYear.graduationYear > last.graduationYear) {
          last = schoolYear;
        }
        if (schoolYear.graduationYear == this.modelValue.graduationYear) {
          matching = schoolYear;
        }
      });
      if (matching) {
        this.modelValue.schoolYear = matching;
      } else {
        this.modelValue.schoolYear = {
          graduationYear: this.modelValue.graduationYear,
          weeks: last.weeks,
          ageReliefIncluded: false,
        };
      }
      this.$emit('next');
    },
  },
};
</script>