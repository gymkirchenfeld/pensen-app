<template>
  <span>{{ displayValue }}</span>
</template>
<script>
function toFixed(value, decimalPlaces) {
  if (typeof value === 'number') return value.toFixed(decimalPlaces);
  return '?';
}

export default {
  props: {
    max: { type: Number, default: 0 },
    min: { type: Number, default: 0 },
  },
  computed: {
    decimalPlaces() {
      return this.$root.percentDecimals;
    },
    displayValue() {
      if (this.max === 0) return '—';
      let result = toFixed(this.min, this.decimalPlaces);
      if (this.min !== this.max) {
        result += ' — ' + toFixed(this.max, this.decimalPlaces);
      }
      result += '%';
      return result;
    },
  },
};
</script>
