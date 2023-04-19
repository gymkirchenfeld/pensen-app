<template>
  <v-list>
    <v-list-item v-if="selectTeacher">
      <TeacherInput
        v-model="modelValue.teacher"
        :employed="false"
        :schoolYear="schoolYear"
      ></TeacherInput>
    </v-list-item>
    <v-list-item>
      <LookupInput
        v-model="modelValue.division"
        label="Abteilung"
        resource="division"
      ></LookupInput>
    </v-list-item>
    <v-list-item>
      <v-row>
        <v-col>
          <v-text-field
            v-model="modelValue.employmentMin"
            label="Verfügung Minimum"
            lang="de-CH"
            type="number"
          ></v-text-field> </v-col
        ><v-col>
          <v-text-field
            v-model="modelValue.employmentMax"
            label="Verfügung Maximum"
            lang="de-CH"
            type="number"
          ></v-text-field> </v-col
      ></v-row>
    </v-list-item>
    <v-list-item>
      <v-row>
        <v-col>
          <v-text-field
            v-model="modelValue.payment1"
            label="Auszahlungsziel 1. Semester"
            lang="de-CH"
            type="number"
          ></v-text-field> </v-col
        ><v-col>
          <v-text-field
            v-model="modelValue.payment2"
            label="Auszahlungsziel 2. Semester"
            lang="de-CH"
            type="number"
          ></v-text-field> </v-col
      ></v-row>
    </v-list-item>
    <v-list-item>
      <v-checkbox
        v-model="modelValue.temporary"
        label="befristete Anstellung"
      ></v-checkbox>
    </v-list-item>
    <v-list-item>
      <v-textarea
        v-model="modelValue.comments"
        counter
        label="Kommentar"
        rows="2"
      ></v-textarea>
    </v-list-item>
  </v-list>
</template>
<script>
import LookupInput from '@/components/LookupInput.vue';
import TeacherInput from '@/components/TeacherInput.vue';
export default {
  components: { LookupInput, TeacherInput },
  props: {
    schoolYear: { type: Object },
    selectTeacher: { type: Boolean, default: true },
    value: { type: Object },
  },
  watch: {
    value() {
      this.modelValue = this.value;
    },
  },
  data() {
    return {
      modelValue: this.value,
    };
  },
};
</script>
