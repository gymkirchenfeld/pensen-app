<template>
  <v-autocomplete
    @change="select"
    @input="searchInput = null"
    auto-select-first
    :chips="true"
    :deletable-chips="true"
    :disabled="items.length < 1"
    :filter="customFilter"
    item-text="code"
    item-value="id"
    :items="items"
    :label="label"
    return-object
    :search-input.sync="searchInput"
    v-bind="$attrs"
    :value="modelValue"
  >
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
    employed: { type: Boolean, default: true },
    label: { type: String, default: 'Lehrperson' },
    schoolYear: { type: Object, default: null },
    value: null,
  },
  data() {
    return {
      items: [],
      modelValue: this.value,
      searchInput: null,
    };
  },
  watch: {
    value(newValue) {
      this.modelValue = newValue;
    },
  },
  async created() {
    let query = '';
    if (this.schoolYear) {
      query = `schoolYear=${this.schoolYear.id}&employed=${this.employed}`;
    }
    let result = await this.apiList({ resource: 'teacher', query: query });
    const archived = localStorage.getItem('showArchived') === 'true';
    if (!archived) {
      result = result.filter((teacher) => !teacher.archived);
    }
    if (this.modeValue) {
      result.forEach((teacher) => {
        if (this.modelValue.id === teacher.id) this.modelValue = teacher;
        this.$emit('input', this.modelValue);
      });
    }
    this.items = result;
  },
  methods: {
    customFilter(item, queryText) {
      const textOne = item.code.toLowerCase();
      const textTwo =
        item.firstName.toLowerCase() + ' ' + item.lastName.toLowerCase();
      const textThree =
        item.lastName.toLowerCase() + ' ' + item.firstName.toLowerCase();
      const searchText = queryText.toLowerCase();

      return (
        textOne.indexOf(searchText) > -1 ||
        textTwo.indexOf(searchText) > -1 ||
        textThree.indexOf(searchText) > -1
      );
    },
    select(event) {
      this.$emit('input', event);
    },
  },
};
</script>
