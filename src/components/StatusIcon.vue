<template>
  <v-tooltip right v-if="value">
    <template v-slot:activator="{ on }">
      <v-icon small class="mr-2" v-bind="$attrs" v-on="on">{{ icon }}</v-icon>
    </template>
    {{ label }}
  </v-tooltip>
</template>
<script>
export default {
  props: {
    icon: { type: String, default: 'mdi-help-circle' },
    label: { type: String, default: null },
    value: { type: Boolean, default: true },
  },
};
</script>
