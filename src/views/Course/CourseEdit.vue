<template>
  <EditDialog
    @save="save"
    :saveAllowed="saveAllowed"
    :width="640"
    icon="mdi-card-account-details"
  >
    <template v-slot:title>{{ title }} </template>
    <template>
      <v-list>
        <v-list-item>
          <v-row>
            <v-col>
              <TeacherMultiInput
                multiple
                label="Lehrpersonen 1. Semester"
                v-model="item.teachers1"
                @input="teachers1Changed"
              />
            </v-col>
            <v-col>
              <TeacherMultiInput
                multiple
                label="Lehrpersonen 2. Semester"
                v-model="item.teachers2"
              />
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
              ></v-text-field> </v-col
          ></v-row>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="item.comments"
            counter
            label="Kommentar"
            maxlength="100"
          ></v-text-field>
        </v-list-item>
        <v-list-item v-if="!add">
          <v-checkbox
            v-model="item.cancelled"
            label="findet nicht statt"
          ></v-checkbox>
        </v-list-item>
      </v-list>
    </template>
    <template v-slot:actions>
      <v-btn
        v-if="!add"
        text
        @click="split"
        color="warning"
        :disabled="!splitAllowed"
        ><v-icon>mdi-arrow-split-vertical</v-icon> Aufteilen</v-btn
      >
      <v-btn v-if="!add" text @click="remove" color="error"
        ><v-icon left>mdi-delete</v-icon> Löschen</v-btn
      >
    </template>
  </EditDialog>
</template>
<script>
import EditDialog from '@/components/EditDialog.vue';
import TeacherMultiInput from '@/components/TeacherMultiInput.vue';
import { schoolClassCode } from '@/utils/school.js';
export default {
  props: {
    id: { type: Number, default: -1 },
    schoolClass: Object,
    schoolYear: Object,
    subject: Object,
  },
  components: {
    EditDialog,
    TeacherMultiInput,
  },
  data() {
    return {
      add: false,
      curriculum: { grades: [] },
      curriculums: [],
      item: {
        crossClass: false,
        subject: null,
        lessons1: 0,
        lessons2: 0,
        schoolClasses: [],
        schoolYear: null,
        teachers1: [],
        teachers2: [],
      },
      loading: false,
      saving: false,
      teachers: [],
    };
  },
  computed: {
    saveAllowed() {
      return Boolean(
        this.item.schoolYear && !this.item.schoolYear.archived && !this.saving,
      );
    },
    splitAllowed() {
      return (
        !this.saving &&
        this.item.schoolClasses &&
        this.item.schoolClasses.length > 1
      );
    },
    title() {
      if (this.item && this.item.subject) {
        return `${this.item.subject.description} ${schoolClassCode(
          this.item.schoolClasses,
        )}`;
      }
      return '';
    },
  },
  async created() {
    this.loading = true;
    this.curriculums = await this.apiList({ resource: 'curriculum' });
    this.add = this.id < 0;
    this.item.schoolYear = this.schoolYear;
    if (this.add) {
      this.item.schoolClasses.push(this.schoolClass);
      this.item.schoolYear = this.schoolYear;
      this.item.subject = this.subject;
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
        this.$router.push({ name: 'Course' });
      }
    },
    async save() {
      this.saving = true;
      if (this.add) {
        await this.apiPost({ resource: 'course', data: this.item });
      } else {
        await this.apiPut({ resource: 'course', data: this.item });
      }
      this.$emit('dataChanged');
      this.$router.push({ name: 'Course' });
      this.saving = false;
    },
    async split() {
      this.saving = true;
      await this.apiPost({
        resource: 'course',
        data: { split: this.item.id },
      });
      this.$emit('dataChanged');
      this.$router.push({ name: 'Course' });
      this.saving = false;
    },
    teachers1Changed() {
      if (this.item.teachers2.length === 0) {
        for (let i = 0; i < this.item.teachers1.length; ++i) {
          this.item.teachers2.push(this.item.teachers1[i]);
        }
      }
    },
  },
};
</script>
