<template>
  <EditDialog
    @save="save"
    :saveAllowed="saveAllowed"
    :width="640"
    icon="mdi-account-check"
    @keydown.esc="abort"
    tabs
  >
    <template v-slot:title>
      <span v-if="add"> Neue Anstellung</span>
      <span v-else
        ><span v-if="item.teacher"
          >{{ item.teacher.firstName }} {{ item.teacher.lastName }}
          {{ item.schoolYear.description }}</span
        >
      </span>
    </template>
    <template v-slot:tabs>
      <v-tabs v-model="tab">
        <v-tab>Anstellung</v-tab>
        <v-tab v-if="!add"
          ><v-badge
            v-if="notes.length > 0"
            :content="notes.length"
            color="error"
            >Notizen</v-badge
          >
          <span v-else>Notizen</span>
        </v-tab>
      </v-tabs>
    </template>
    <template>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <EmploymentTab
            v-model="item"
            :selectTeacher="add"
            :schoolYear="schoolYear"
          ></EmploymentTab>
        </v-tab-item>
        <v-tab-item>
          <NoteTab v-model="notes" :teacher="item.teacher"></NoteTab>
        </v-tab-item>
      </v-tabs-items>
    </template>
    <template v-slot:actions>
      <v-btn v-if="!add" text @click="remove" color="error">
        <v-icon left>mdi-delete</v-icon> Anstellung Löschen
      </v-btn>
    </template>
  </EditDialog>
</template>
<script>
import EditDialog from '@/components/EditDialog.vue';
import EmploymentTab from './EmploymentTab.vue';
import NoteTab from './NoteTab.vue';
export default {
  props: {
    schoolYear: { type: Object, default: null },
    id: { default: -1 },
  },
  components: { EditDialog, EmploymentTab, NoteTab },
  data() {
    return {
      add: false,
      item: {
        schoolYear: this.schoolYear,
        thesisCounts: {},
      },
      loading: false,
      notes: [],
      saving: false,
      tab: 0,
      thesisTypes: [],
    };
  },
  computed: {
    saveAllowed() {
      return Boolean(
        this.item.schoolYear && !this.item.schoolYear.archived && !this.saving,
      );
    },
    teacherId() {
      return this.item && this.item.teacher ? this.item.teacher.id : -1;
    },
  },
  async created() {
    this.loading = true;
    this.add = this.id < 0;
    if (!this.add) {
      this.item = await this.apiGet({ resource: 'employment', id: this.id });
      this.notes = await this.apiList({
        resource: 'note',
        query: `teacher=${this.teacherId}`,
      });
    }
    this.thesisTypes = await this.apiList({ resource: 'thesistype' });
    this.loading = false;
  },
  methods: {
    abort() {
      this.$router.back();
    },
    async remove() {
      let result = await this.$root.confirm(
        `Soll die Anstellung für ${this.item.teacher.code} wirklich gelöscht werden? Sämtliche Pensen dieser Lehrperson im Schuljahr werden gelöscht.`,
        'error',
        'mdi-trash-can',
      );
      if (result) {
        await this.apiDelete({ resource: 'employment', id: this.item.id });
        this.$emit('dataChanged');
        this.$router.push({ name: 'Employment' });
      }
    },
    async save() {
      this.saving = true;
      if (this.add) {
        await this.apiPost({ resource: 'employment', data: this.item });
      } else {
        await this.apiPut({ resource: 'employment', data: this.item });
      }
      this.$emit('dataChanged');
      this.$router.push({ name: 'Employment' });
      this.saving = false;
    },
  },
};
</script>
