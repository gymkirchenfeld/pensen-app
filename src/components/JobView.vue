<template>
  <div>
    <v-progress-linear
      v-if="modelValue.running"
      :value="modelValue.progress"
    ></v-progress-linear>
    <slot v-else> </slot>
    <v-expansion-panels flat class="mt-4">
      <v-expansion-panel>
        <v-expansion-panel-header
          ><b>Detailinformationen</b>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-list dense>
            <v-list-item v-for="message in modelValue.log" :key="message.id">{{
              message.message
            }}</v-list-item>
          </v-list>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>
<script>
export default {
  props: {
    value: { type: Object },
  },
  data() {
    return {
      modelValue: this.value,
    };
  },
  watch: {
    value() {
      this.modelValue = this.value;
    },
  },
};
</script>
