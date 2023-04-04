<template>
  <span
    >{{ newValue }}
    <span v-if="change !== 0">
      (<span v-if="change > 0">+</span>{{ change }})
    </span>
  </span>
</template>
<script>
export default {
  props: {
    oldValue: { type: Number, default: 0 },
    newValue: { type: Number, default: 1 },
  },
  computed: {
    change() {
      return this.newValue - this.oldValue;
    },
  },
};
</script>
