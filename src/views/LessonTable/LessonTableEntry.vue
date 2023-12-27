<template>
  <span
    ><v-icon small left>{{ icon }}</v-icon>
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
      if (!this.available) return 'red';
      switch (this.modelValue.type.code) {
        case 'A':
          return 'blue';
        case 'W':
          return 'green';
        default:
          return 'grey lighten-2';
      }
    },
    icon() {
      if (!this.available) return 'mdi-cancel';
      switch (this.modelValue.type.code) {
        case 'A':
          return 'mdi-arrow-expand-right';
        case 'W':
          return 'mdi-arrow-right';
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
