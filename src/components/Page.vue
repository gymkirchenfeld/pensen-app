<template>
  <v-main>
    <v-app-bar app dark :color="appBarColor">
      <v-app-bar-nav-icon>
        <v-icon>{{ icon }}</v-icon>
      </v-app-bar-nav-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
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
      modelValue: this.value,
    };
  },
  computed: {
    appBarColor() {
      if (!this.schoolYearVisible) {
        return 'indigo darken-2';
      }

      if (this.modelValue && !this.modelValue.archived) {
        return this.modelValue.finalised ? 'green darken-2' : 'red darken-2';
      }
      return 'blue-grey darken-2';
    },
  },
  watch: {
    modelValue() {
      this.$emit('input', this.modelValue);
    },
  },
};
</script>
