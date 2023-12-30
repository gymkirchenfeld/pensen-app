<template>
  <span
    ><v-icon :color="color" small left>{{ icon }}</v-icon>
    {{ text }}
  </span>
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
  computed: {
    available() {
      return this.modelValue.type.code !== 'X';
    },
    text() {
      const l1 = this.modelValue.lessons1;
      const l2 = this.modelValue.lessons2;
      return this.available ? (l1 === l2 ? `${l1} L` : `${l1} / ${l2} L`) : '';
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
