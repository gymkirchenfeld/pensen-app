<template>
  <TextValue :value="display" />
</template>
<script>
import TextValue from '@/components/TextValue.vue';
export default {
  components: { TextValue },
  props: {
    short: { type: Boolean, default: false },
    value: { type: Object, default: null },
  },
  computed: {
    display() {
      if (this.value) {
        return `${this.value.code} — ${this.value.lastName} ${this.value.firstName}`;
      } else {
        return null;
      }
    },
  },
};
</script>
