<template>
  <span v-if="value">{{ formated }}</span>
  <span v-else>{{ placeholder }}</span>
</template>
<script>
import { formatDate } from '@/utils/date.js';
export default {
  props: {
    value: { type: String },
    placeholder: { type: String, default: '—' },
  },
  computed: {
    formated() {
      return formatDate(this.value);
    },
  },
};
</script>
