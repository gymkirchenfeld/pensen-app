<template>
  <span>{{ displayValue }}</span>
</template>
<script>
export default {
  props: {
    value: { default: null },
  },
  computed: {
    displayValue() {
      return this.value < 0 ? '—' : `${this.value} L`;
    },
  },
};
</script>
