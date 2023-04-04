<template>
  <v-list>
    <v-list-item>
      <v-text-field
        v-model="newNote"
        counter
        rows="2"
        label="neue Notiz"
      ></v-text-field>
    </v-list-item>
    <v-list-item>
      <v-spacer></v-spacer>
      <v-btn color="success" outlined @click="addNote">
        <v-icon left>mdi-plus</v-icon>Notiz hinzufügen
      </v-btn>
    </v-list-item>
    <v-list-item v-for="note in modelValue" :key="note.id">
      <v-list-item-content>
        <v-list-item-title>{{ note.text }}</v-list-item-title>
        <v-list-item-subtitle>
          <DateValue v-model="note.creationDate"></DateValue> &mdash;
          {{ note.createdBy }}
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
import DateValue from '@/components/DateValue.vue';
export default {
  components: { DateValue },
  props: {
    teacher: { type: Object, default: null },
    value: { type: Array, default: () => [] },
  },
  data() {
    return {
      newNote: '',
      modelValue: this.value,
    };
  },
  methods: {
    async addNote() {
      await this.apiPost({
        resource: 'note',
        data: {
          teacher: {
            id: this.teacher.id,
          },
          text: this.newNote,
        },
      });
      this.modelValue = await this.apiList({
        resource: 'note',
        query: `teacher=${this.teacher.id}`,
      });
      this.$emit('input', this.modelValue);
    },
  },
};
</script>
