<template>
  <v-chip
    :class="chipClasses"
    :color="color"
    label
    :outlined="!selected"
    @click="onClick"
  >
    <v-icon v-if="!modelValue && !selecting" small>mdi-plus</v-icon>
    <template v-else>
      <v-icon v-if="selecting">{{ checkboxIcon }}</v-icon>
      <StatusIcon
        v-if="hasComments && !selecting"
        icon="mdi-message"
        v-model="hasComments"
        small
        left
        :label="comments"
      ></StatusIcon>
      <span v-if="showTitle">{{ shortTitle }}</span
      >&nbsp;
      {{ display }}
    </template>
  </v-chip>
</template>
<script>
import StatusIcon from '@/components/StatusIcon.vue';
import { schoolClassCode } from '@/utils/school.js';
export default {
  components: {
    StatusIcon,
  },
  props: {
    dense: { type: Boolean, default: false },
    schoolClass: { type: Object, default: null },
    selecting: { type: Boolean, default: false },
    subject: { type: Object, default: null },
    showTitle: { type: Boolean, default: false },
    value: { type: Object, default: null },
  },
  data() {
    return {
      display: '',
      modelValue: this.value,
      open1: true,
      open2: true,
    };
  },
  created() {
    this.init();
  },
  computed: {
    chipClasses() {
      let result = 'course-chip align-center justify-center ';
      result += this.dense ? 'course-chip-small' : 'course-chip-wide';
      return result;
    },
    color() {
      if (!this.modelValue) return 'grey lighten-2';
      if (this.modelValue.cancelled) return 'black';
      if (this.open1 || this.open2) return 'red';
      if (this.modelValue.schoolClasses.length > 1) return 'blue';
      return 'green';
    },
    checkboxIcon() {
      return this.selected
        ? 'mdi-checkbox-outline'
        : 'mdi-checkbox-blank-outline';
    },
    comments() {
      return this.modelValue ? this.modelValue.comments : null;
    },
    hasComments() {
      return this.modelValue && this.modelValue.comments != null;
    },
    schoolClassCode() {
      return schoolClassCode(this.modelValue.schoolClasses);
    },
    selected() {
      return this.modelValue && this.modelValue.selected;
    },
    shortTitle() {
      if (!this.modelValue) return null;
      return `${this.modelValue.subject.code} ${this.schoolClassCode}`;
    },
    teachers() {
      if (!this.modelValue) return null;
      return this.modelValue.teachers1
        .map((teacher) => teacher.code)
        .join(', ');
    },
  },
  methods: {
    init() {
      this.display = '';
      const course = this.modelValue;
      if (!course) return;
      if (course.cancelled) {
        this.display = '—';
        return;
      }

      this.open1 = course.open1 > 0;
      this.open2 = course.open2 > 0;

      const schoolClasses = this.modelValue.schoolClasses;
      if (
        schoolClasses.length > 1 &&
        this.schoolClass.id !== schoolClasses[0].id
      ) {
        this.display = schoolClasses[0].code;
        return;
      }

      let display1 = '';
      if (course.teachers1.length > 0) {
        display1 = course.teachers1.map((teacher) => teacher.code).join(', ');
      } else {
        display1 = course.lessons1 > 0 ? course.lessons1 : '—';
      }
      let display2 = '';
      if (course.teachers2.length > 0) {
        display2 = course.teachers2.map((teacher) => teacher.code).join(', ');
      } else {
        display2 = course.lessons2 > 0 ? course.lessons2 : '—';
      }
      this.display =
        display1 === display2 ? display1 : `${display1} / ${display2}`;
    },
    onClick() {
      if (this.selecting) {
        this.modelValue.selected = !this.modelValue.selected;
        this.$emit('select', this.modelValue);
      } else if (!this.modelValue) {
        this.$emit('add', this.schoolClass, this.subject);
      } else {
        this.$emit('edit', this.modelValue);
      }
    },
  },
};
</script>
<style>
.course-chip {
  padding: 0 1px !important;
}
.course-chip-small {
  width: 70px;
}
.course-chip-wide {
  width: 140px;
}
</style>
