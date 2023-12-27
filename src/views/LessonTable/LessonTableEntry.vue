<template>
  <span
    ><v-icon :color="color" small left>{{ icon }}</v-icon>
    <SemesterValue
      v-if="available"
      :decimals="0"
      :first="modelValue.lessons1"
      :second="modelValue.lessons2"
      type="lesson"
    ></SemesterValue
  ></span>
</template>
<script>
import SemesterValue from '@/components/SemesterValue.vue';

export default {
  components: {
    SemesterValue,
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
    available() {
      return this.modelValue.type.code !== 'X';
    },
    color() {
      switch (this.modelValue.type.code) {
        case 'A':
          return 'blue darken';
        case 'AO':
          return 'orange darken';
        case 'W':
          return 'grey darken-2';
        case 'X':
          return 'grey lighten-2';
        default:
          return 'grey lighten-2';
      }
    },
    icon() {
      switch (this.modelValue.type.code) {
        case 'A':
          return 'mdi-arrow-expand-right';
        case 'AO':
          return 'mdi-arrow-expand-right';
        case 'W':
          return 'mdi-arrow-right';
        case 'X':
          return 'mdi-cancel';
        default:
          return '???';
      }
    },
  },
};
</script>
<style>
.slot-cell-chip {
  padding: 0 1px !important;
  width: 160px;
}
</style>
