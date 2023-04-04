<template>
  <v-btn :disabled="running" @click="start" :class="classes" v-bind="$attrs">
    <v-progress-circular
      class="mr-2"
      :rotate="360"
      :size="25"
      :width="5"
      :value="progress"
      v-if="running"
    ></v-progress-circular>
    <v-icon left v-else>{{ icon }}</v-icon>
    <slot></slot>
  </v-btn>
</template>
<script>
export default {
  props: {
    confirm: { type: String, default: null },
    icon: { type: String, default: 'mdi-download' },
    parameters: { type: Object, default: () => {} },
    prepare: { type: Function, default: null },
    title: { type: String },
  },
  data() {
    return {
      progress: 0,
      running: false,
      timeoutId: 0,
    };
  },
  computed: {
    classes() {
      const result = ['btn', 'btn-default'];
      if (this.generating) result.push('disabled');
      return result;
    },
  },
  destroyed() {
    clearTimeout(this.timeoutId);
  },
  methods: {
    async start() {
      if (this.confirm) {
        let result = await this.$root.confirm(this.confirm, 'info');
        if (!result) return;
      }
      if (this.running) return;
      this.progress = 0;
      const parameters = this.prepare();
      this.running = true;
      const result = await this.apiPost({
        resource: 'job',
        data: parameters,
      });
      if (result.id) {
        this.timeoutId = setTimeout(this._waitForResult, 100, result.id);
      }
    },
    async _waitForResult(id) {
      const result = await this.apiGet({
        resource: 'job',
        id: id,
      });
      if (result.running) {
        this.progress = result.progress;
        this.timeoutId = setTimeout(this._waitForResult, 100, id);
      } else {
        if (result.error) {
          this.$root.showError(`Fehler bei ${result.title}: ${result.error}`);
        } else {
          if (result.product) {
            const dataURL = `data:${result.product.mimeType};base64,${result.product.data}`;
            const res = await fetch(dataURL);
            const blob = await res.blob();
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = window.URL.createObjectURL(blob);
            link.download = result.product.fileName;
            link.click();
          }
        }
        this.running = false;
        this.$emit('done');
      }
    },
  },
};
</script>
