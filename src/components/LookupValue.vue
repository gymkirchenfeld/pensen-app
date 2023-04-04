<template>
  <TextValue :value="display" :tooltip="tooltip" />
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
        if (this.short) {
          return this.value.code;
        } else {
          return this.value.description;
        }
      } else {
        return null;
      }
    },
    tooltip() {
      if (this.value && this.short) {
        return this.value.description;
      } else {
        return null;
      }
    },
  },
};
</script>
