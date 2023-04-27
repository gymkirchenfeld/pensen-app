<template>
  <v-autocomplete
    class="flex-grow-0 mr-5"
    dense
    :disabled="items.length < 1"
    hide-details
    :items="items"
    item-text="code"
    label="Lehrperson"
    outlined
    return-object
    :value="modelValue"
    @input="select"
  >
    <template v-slot:selection="data"
      >{{ data.item.code }} — {{ data.item.firstName }}
      {{ data.item.lastName }}
    </template>
    <template v-slot:item="data">
      <v-list-item-content>
        <v-list-item-title
          >{{ data.item.code }} — {{ data.item.firstName }}
          {{ data.item.lastName }}
        </v-list-item-title>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>
<script>
export default {
  props: {
    schoolYear: { type: Object, default: null },
    value: { type: Object, default: null },
  },
  data() {
    return {
      items: [],
      modelValue: null,
    };
  },
  watch: {
    modelValue() {
      this.$emit('input', this.modelValue);
      if (this.modelValue) {
        localStorage.setItem('selectedTeacher', this.modelValue.id);
      }
    },
    schoolYear() {
      this.fetchData();
    },
    value(newValue) {
      this.modelValue = newValue;
    },
  },
  async created() {
    this.fetchData();
  },
  methods: {
    async fetchData() {
      if (!this.schoolYear) return;
      const query = `schoolYear=${this.schoolYear.id}&employed=true`;
      let items = await this.apiList({ resource: 'teacher', query: query });
      const id = Number.parseInt(localStorage.getItem('selectedTeacher')) || -1;
      this.modelValue = null;
      items.forEach((item) => {
        if (item.id === id) this.modelValue = item;
      });

      const collator = new Intl.Collator();
      items.sort((a, b) => collator.compare(a.code, b.code));
      this.items = items;
    },
    select($event) {
      this.$emit('input', $event);
    },
  },
};
</script>
