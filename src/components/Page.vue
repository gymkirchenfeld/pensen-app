<template>
  <v-main>
    <v-app-bar app dark :color="appBarColor">
      <v-app-bar-nav-icon>
        <v-icon>{{ icon }}</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>{{ displayTitle }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <Select
        v-if="schoolYearVisible"
        class="flex-grow-0"
        label="Schuljahr"
        outlined
        resource="schoolyear"
        storeSelection="selectedSchoolYear"
        v-model="modelValue"
      ></Select>
    </v-app-bar>
    <v-container>
      <v-toolbar flat short class="mb-4"
        ><slot name="toolbar"></slot
      ></v-toolbar>
      <slot></slot>
    </v-container>
  </v-main>
</template>
<script>
import Select from '@/components/Select.vue';

export default {
  components: {
    Select,
  },
  props: {
    icon: { type: String, default: 'mdi-help-circle' },
    schoolYear: { type: Object, default: null },
    schoolYearVisible: { type: Boolean, default: false },
    title: { type: String, default: 'Titel' },
    value: { type: Object, default: null },
  },
  data() {
    return {
      currentSchoolYear: false,
      modelValue: this.value,
    };
  },
  computed: {
    appBarColor() {
      if (
        !this.schoolYearVisible ||
        !this.modelValue ||
        this.modelValue.archived
      )
        return 'blue-grey darken-2';
      if (!this.modelValue.finalised) return 'red darken-2';
      return this.currentSchoolYear ? 'indigo darken-2' : 'indigo darken-4';
    },
    displayTitle() {
      if (!this.schoolYearVisible) return this.title;
      if (this.currentSchoolYear) return `${this.title} (aktuelles Schuljahr)`;
      return this.title;
    },
  },
  watch: {
    modelValue() {
      this.currentSchoolYear = false;
      if (this.modelValue) {
        const today = new Date();
        const start = new Date(this.modelValue.graduationYear - 1, 8, 1);
        const end = new Date(this.modelValue.graduationYear, 7, 31);
        this.currentSchoolYear = start <= today && today <= end;
      }
      this.$emit('input', this.modelValue);
    },
  },
};
</script>
