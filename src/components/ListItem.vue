<template>
  <v-list-item>
    <v-list-item-icon v-if="icon">
      <v-icon>{{ icon }}</v-icon>
    </v-list-item-icon>
    <v-list-item-content>
      <v-list-item-title><slot name="title"></slot> </v-list-item-title>
      <v-list-item-subtitle
        ><slot name="subtitle"></slot
      ></v-list-item-subtitle> </v-list-item-content
  ></v-list-item>
</template>
<script>
export default {
  props: {
    icon: { type: String, default: null },
  },
};
</script>
