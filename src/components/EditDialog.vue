<template>
  <v-dialog
    v-bind="$attrs"
    persistent
    scrollable
    :value="visible"
    @keydown.esc="close"
  >
    <v-card
      ><v-card-title class="pa-0"
        ><v-toolbar flat dark color="primary">
          <v-btn icon>
            <v-icon>{{ icon }}</v-icon>
          </v-btn>
          <v-toolbar-title><slot name="title"></slot></v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="close" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <template v-if="tabs" v-slot:extension>
            <slot name="tabs"></slot>
          </template>
        </v-toolbar>
      </v-card-title>
      <v-card-text
        ><v-form v-model="valid"><slot></slot></v-form
      ></v-card-text>
      <v-card-text v-if="error">
        <v-alert type="error" title="Fehler">{{ errorMessage }}</v-alert>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions
        ><slot name="actions"></slot>
        <v-spacer></v-spacer>
        <v-btn
          text
          @click="save"
          color="success"
          :disabled="!valid || !saveAllowed"
          ><v-icon left>mdi-check</v-icon> Speichern</v-btn
        >
        <v-btn text @click="close"
          ><v-icon left>mdi-close</v-icon> Abbrechen</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    error: { type: Response, default: null },
    icon: { type: String, default: 'mdi-help-circle-outline' },
    saveAllowed: { type: Boolean, default: false },
    tabs: { type: Boolean, default: false },
  },
  data() {
    return {
      errorMessage: null,
      valid: false,
      visible: true,
    };
  },
  watch: {
    async error() {
      if (this.error) this.errorMessage = await this.error.text();
    },
  },
  methods: {
    close() {
      this.$router.back();
    },
    save() {
      this.$emit('save');
    },
  },
};
</script>
