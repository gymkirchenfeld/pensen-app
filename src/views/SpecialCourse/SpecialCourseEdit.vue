<template>
  <EditDialog
    :error="error"
    @save="save"
    :saveAllowed="saveAllowed"
    :width="640"
    icon="mdi-card-account-details-star-outline"
  >
    <template v-slot:title>{{ title }} </template>
    <template>
      <v-list>
        <v-list-item v-if="add">
          <LookupInput
            v-model="item.curriculum"
            label="Lehrgang"
            resource="curriculum"
          ></LookupInput>
        </v-list-item>
        <v-list-item v-if="add">
          <v-select
            v-model="item.grade"
            label="Stufe"
            item-text="description"
            :items="item.curriculum.grades"
            return-object
          ></v-select>
        </v-list-item>
        <v-list-item v-if="add">
          <v-select
            v-model="item.subject"
            label="Fach"
            item-text="description"
            :items="subjects"
            return-object
          ></v-select>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col>
              <TeacherMultiInput
                v-model="item.teachers1"
                multiple
                label="Lehrpersonen 1. Semester"
              ></TeacherMultiInput>
            </v-col>
            <v-col>
              <TeacherMultiInput
                v-model="item.teachers2"
                multiple
                label="Lehrpersonen 2. Semester"
              ></TeacherMultiInput>
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col>
              <v-text-field
                v-model="item.lessons1"
                label="Lektionen 1. Semester"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-model="item.lessons2"
                label="Lektionen 2. Semester"
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="item.comments"
            counter
            label="Kommentar"
            maxlength="100"
          ></v-text-field>
        </v-list-item>
      </v-list>
    </template>
    <template v-slot:actions>
      <v-btn v-if="!add" text @click="remove" color="error"
        ><v-icon left>mdi-delete</v-icon> Löschen</v-btn
      >
    </template>
  </EditDialog>
</template>
<script>
import EditDialog from '@/components/EditDialog.vue';
import LookupInput from '@/components/LookupInput.vue';
import TeacherMultiInput from '@/components/TeacherMultiInput.vue';
export default {
  props: {
    id: { type: Number, default: -1 },
    schoolYear: { type: Object },
  },
  components: { EditDialog, LookupInput, TeacherMultiInput },
  data() {
    return {
      add: false,
      item: {
        crossClass: true,
        curriculum: { grades: [] },
        error: null,
        grade: null,
        schoolYear: this.schoolYear,
        subject: null,
        lessons1: 0,
        lessons2: 0,
        teachers1: [],
        teachers2: [],
      },
      loading: false,
      saving: false,
      subjects: [],
      teachers: [],
    };
  },
  computed: {
    saveAllowed() {
      return Boolean(
        this.item.schoolYear &&
          !this.item.schoolYear.archived &&
          !this.saving &&
          this.item.grade &&
          this.item.subject,
      );
    },
    title() {
      if (this.add) return 'Neuer klassenübergreifender Kurs';
      if (this.item && this.item.subject && this.item.grade) {
        return `${this.item.subject.description} ${this.item.grade.code}`;
      }
      return '';
    },
  },
  async created() {
    this.loading = true;
    this.add = this.id < 0;
    if (this.add) {
      this.subjects = await this.apiList({
        resource: 'subject/?crossClass=true',
      });
    } else {
      this.item = await this.apiGet({ resource: 'course', id: this.id });
    }
    this.loading = false;
  },
  methods: {
    abort() {
      this.$router.back();
    },
    async remove() {
      let result = await this.$root.confirm(
        'Soll der Kurs «' + this.title + '» wirklich gelöscht werden?',
        'error',
        'mdi-trash-can',
      );
      if (result) {
        await this.apiDelete({ resource: 'course', id: this.item.id });
        this.$emit('dataChanged');
        this.$router.push({ name: 'SpecialCourse' });
      }
    },
    async save() {
      this.saving = true;
      await this.apiSave({
        resource: 'course',
        add: this.add,
        data: this.item,
        onError: (error) => (this.error = error),
      });
      this.saving = false;
      if (!this.error) {
        this.$emit('dataChanged');
        this.$router.push({ name: 'SpecialCourse' });
      }
    },
  },
};
</script>
