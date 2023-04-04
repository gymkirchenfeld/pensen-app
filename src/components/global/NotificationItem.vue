<template>
  <v-expand-transition>
    <v-alert
      :color="color"
      :icon="icon"
      :dark="color == 'primary'"
      dismissible
      elevation="5"
    >
      {{ message }}
    </v-alert>
  </v-expand-transition>
</template>

<script>
export default {
  props: ['message', 'icon', 'color'],
  computed: {
    dark() {
      return this.options.color == 'primary';
    },
  },
  methods: {},
};
</script>
