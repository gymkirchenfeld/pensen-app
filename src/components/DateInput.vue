<template>
  <v-menu
    v-model="datepicker"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        v-model="formated"
        :label="label"
        append-icon="mdi-calendar"
        readonly
        v-bind="$attrs"
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker
      v-model="currentValue"
      @input="datepicker = false"
      :first-day-of-week="1"
      color="primary"
    >
      <v-btn-toggle borderless>
        <v-btn small icon @click="addDays(-7)"
          ><v-icon>mdi-chevron-double-left</v-icon></v-btn
        >
        <v-btn small icon @click="addDays(-1)"
          ><v-icon>mdi-chevron-left</v-icon></v-btn
        >
        <v-btn small text @click="ok">OK</v-btn>
        <v-btn small icon @click="addDays(1)">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-btn-toggle>
      <v-btn small icon @click="addDays(7)"
        ><v-icon>mdi-chevron-double-right</v-icon></v-btn
      >
      <v-spacer /><v-btn text @click="today()">heute</v-btn>
    </v-date-picker>
  </v-menu>
</template>
<script>
import { formatDate } from '@/utils/date.js';
export default {
  props: ['label', 'value'],
  data() {
    return {
      currentValue: this.value,
      datepicker: false,
    };
  },
  watch: {
    value() {
      this.currentValue = this.value;
    },
    currentValue() {
      this.$emit('input', this.currentValue);
    },
  },
  methods: {
    today() {
      let today = new Date(),
        month = '' + (today.getMonth() + 1),
        day = '' + today.getDate(),
        year = today.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      this.currentValue = [year, month, day].join('-');
      this.datepicker = false;
    },
    ok() {
      this.datepicker = false;
    },
    addDays(days) {
      let date = new Date(this.currentValue);
      date.setDate(date.getDate() + days);
      let month = '' + (date.getMonth() + 1);
      let day = '' + date.getDate();
      let year = date.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;

      this.currentValue = [year, month, day].join('-');
    },
  },
  computed: {
    formated() {
      return formatDate(this.value, '+');
    },
  },
};
</script>
