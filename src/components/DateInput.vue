<template>
  <v-text-field
    :value="formated"
    :label="label"
    @click:clear="currentValue = null"
    @input="parseDate"
    placeholder="dd.mm.yyyy"
    :rules="[rules.date, rules.required]"
    v-bind="$attrs"
  >
    <template v-slot:append>
      <v-dialog
        v-model="datepicker"
        :close-on-content-click="false"
        width="auto"
      >
        <template v-slot:activator="{ on }">
          <v-icon v-on="on"> mdi-calendar </v-icon>
        </template>
        <v-date-picker
          v-model="currentValue"
          @input="datepicker = false"
          :first-day-of-week="1"
          color="primary"
          v-bind="$attrs"
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
      </v-dialog>
    </template>
  </v-text-field>
</template>
<script>
import { defineComponent } from "vue";
import { formatDate } from "@/utils/date.js";
export default defineComponent({
  name: "DateInput",
  props: { label: String, value: String, required: Boolean },
  data() {
    return {
      currentValue: this.value,
      datepicker: false,
      rules: {
        required: (value) => !!value || !this.required || "wird benötigt.",
        date: (value) => {
          if (value.includes(",")) {
            [, value] = value.split(", ");
          }
          const [day, month, year] = value.split(".");
          if (day != null && month != null && year != null) {
            if (day.length > 0 && month.length > 0 && year.length == 4) {
              const d_str = `${year}-${month.padStart(2, "0")}-${day.padStart(
                2,
                "0"
              )}`;
              const d = new Date(d_str);
              return !isNaN(new Date(d)) || "kein gültiges Datum!";
            }
          }
          return "kein gültiges Datum!";
        },
      },
    };
  },
  watch: {
    value() {
      this.currentValue = this.value;
    },
    currentValue() {
      this.$emit("input", this.currentValue);
    },
  },
  methods: {
    today() {
      let today = new Date(),
        month = "" + (today.getMonth() + 1),
        day = "" + today.getDate(),
        year = today.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      this.currentValue = [year, month, day].join("-");
      this.datepicker = false;
    },
    ok() {
      this.datepicker = false;
    },
    addDays(days) {
      let date = new Date(this.currentValue);
      date.setDate(date.getDate() + days);
      let month = "" + (date.getMonth() + 1);
      let day = "" + date.getDate();
      let year = date.getFullYear();

      if (month.length < 2) month = "0" + month;
      if (day.length < 2) day = "0" + day;

      this.currentValue = [year, month, day].join("-");
    },
    parseDate(date) {
      if (!date) return;
      if (date.includes(",")) {
        [, date] = date.split(", ");
      }
      const [day, month, year] = date.split(".");
      if (day != null && month != null && year != null) {
        if (day.length > 0 && month.length > 0 && year.length == 4) {
          this.currentValue = `${year}-${month.padStart(2, "0")}-${day.padStart(
            2,
            "0"
          )}`;
        }
      }
    },
  },
  computed: {
    formated() {
      return formatDate(this.value, true);
    },
  },
});
</script>
