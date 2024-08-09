<template>
  <span>{{ displayValue }}</span>
</template>
<script>
function toFixed(value, decimalPlaces) {
  if (value === 0) return "—";
  if (typeof value === "number") return value.toFixed(decimalPlaces);
  return "—";
}

export default {
  props: {
    decimals: { type: Number, default: -1 },
    type: { type: String, default: "percent" },
    first: { type: Number, default: null },
    second: { type: Number, default: null },
    value: { type: Number, default: 0 },
  },
  computed: {
    decimalPlaces() {
      return this.decimals > -1
        ? this.decimals
        : this.type === "percent"
        ? this.$root.percentDecimals
        : 2;
    },
    suffix() {
      return this.type === "percent" ? "%" : " L";
    },
    displayValue() {
      const first = toFixed(this.first || this.value, this.decimalPlaces);
      const second = toFixed(this.second || this.value, this.decimalPlaces);
      if (first !== second) {
        return `${first} / ${second}${this.suffix}`;
      } else if (first === "—") {
        return "—";
      } else {
        return `${first}${this.suffix}`;
      }
    },
  },
};
</script>
