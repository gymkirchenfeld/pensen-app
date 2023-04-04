<template>
  <v-select
    :disabled="items.length < 1"
    :items="items"
    item-text="code"
    label="Lehrperson"
    return-object
    :value="modelValue"
    @change="select"
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
  </v-select>
</template>
<script>
export default {
  props: {
    employed: { type: Boolean, default: null },
    value: { type: Object, default: null },
  },
  data() {
    return {
      items: [],
      modelValue: null,
    };
  },
  watch: {
    value(newValue) {
      this.modelValue = newValue;
    },
  },
  async created() {
    let query = '';
    if (this.employed !== null) {
      const id =
        Number.parseInt(localStorage.getItem('selectedSchoolYear')) || -1;
      query = `schoolYear=${id}&employed=${this.employed}`;
    }
    let items = await this.apiList({ resource: 'teacher', query: query });
    const archived = localStorage.getItem('showArchived') === 'true';
    if (!archived) {
      items = items.filter((teacher) => !teacher.archived);
    }

    const collator = new Intl.Collator();
    items.sort((a, b) => collator.compare(a.code, b.code));
    this.items = items;
  },
  methods: {
    select($event) {
      this.$emit('input', $event);
    },
  },
};
</script>
