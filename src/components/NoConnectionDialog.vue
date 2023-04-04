<template>
  <v-dialog v-model="visible" persistent max-width="560"
    ><v-alert prominent type="error" class="mb-0">
      <h3>Keine Verbindung zum Server</h3>
      <v-divider class="my-4 secondary"></v-divider>
      Die Anwendung kann keine Verbindung zum Server herstellen.
      <v-divider class="my-4 secondary"></v-divider>
      <v-btn @click="retry" color="secondary">Nochmals Versuchen</v-btn>
    </v-alert>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    retry() {
      const currentLocation = window.location;
      window.location = currentLocation;
    },
    show() {
      this.visible = true;
    },
  },
};
</script>
