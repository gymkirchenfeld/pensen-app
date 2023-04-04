<template>
  <span v-if="value">
    <v-tooltip top v-if="tooltip">
      <template v-slot:activator="{ on }">
        <span v-on="on">
          {{ value }}
        </span>
      </template>
      {{ tooltip }}
    </v-tooltip>
    <span v-else>{{ value }}</span>
  </span>
  <span v-else>{{ placeholder }}</span>
</template>
<script>
export default {
  props: {
    placeholder: { type: String, default: '' },
    tooltip: { type: String, default: null },
    value: { default: null },
  },
};
</script>
