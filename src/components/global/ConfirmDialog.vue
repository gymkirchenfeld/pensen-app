<template>
  <v-dialog
    v-model="EditDialog"
    persistent
    max-width="560"
    style="z-index: 290"
    @keydown.esc="cancel"
  >
    <v-alert
      colored-border
      border="left"
      prominent
      :color="color"
      :icon="icon"
      class="mb-0"
    >
      <v-row align="center">
        <v-col class="grow">
          {{ message }}
        </v-col>
        <v-col class="shrink">
          <v-btn
            block
            text
            outlined
            :color="color"
            class="mb-2"
            @click.native="agree"
            >ja</v-btn
          >
          <v-btn block @click.native="cancel" outlined text plain>nein</v-btn>
        </v-col>
      </v-row>
    </v-alert>
  </v-dialog>
</template>

<script>
/**
 * Vuetify Confirm EditDialog component
 * https://gist.github.com/eolant/ba0f8a5c9135d1a146e1db575276177d
 *
 * Insert component where you want to use it:
 * <confirm ref="confirm"></confirm>
 *
 * Call it:
 * this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' }).then((confirm) => {})
 * Or use await:
 * if (await this.$refs.confirm.open('Delete', 'Are you sure?', { color: 'red' })) {
 *   // yes
 * }
 * else {
 *   // cancel
 * }
 *
 * Alternatively you can place it in main App component and access it globally via this.$root.$confirm
 * <template>
 *   <v-app>
 *     ...
 *     <confirm ref="confirm"></confirm>
 *   </v-app>
 * </template>
 *
 * mounted() {
 *   this.$root.$confirm = this.$refs.confirm.open
 * }
 */
export default {
  data: () => ({
    EditDialog: false,
    resolve: null,
    reject: null,
    message: null,
    color: 'primary',
    icon: 'mdi-information',
  }),
  methods: {
    open(message, color, icon) {
      this.EditDialog = true;
      this.message = message;
      if (color) {
        this.color = color;
      }
      if (icon) {
        this.icon = icon;
      }

      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },

    agree() {
      this.resolve(true);
      this.EditDialog = false;
    },
    cancel() {
      this.resolve(false);
      this.EditDialog = false;
    },
  },
};
</script>
