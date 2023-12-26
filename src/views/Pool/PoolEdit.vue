<template>
  <EditDialog
    :error="error"
    @save="save"
    :saveAllowed="saveAllowed"
    :width="512"
    icon="mdi-format-list-bulleted-type"
  >
    <template v-slot:title>
      <span v-if="add"> Neuer Eintrag </span>
      <span v-else>Eintrag bearbeiten </span>
    </template>
    <template>
      <v-list>
        <v-list-item>
          <TeacherInput
            v-model="item.teacher"
            :employed="true"
            :schoolYear="item.schoolYear"
          ></TeacherInput>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="item.description"
            counter
            label="Beschreibung"
            maxlength="255"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <LookupInput
            v-model="item.type"
            label="Typ"
            resource="pooltype"
          ></LookupInput>
        </v-list-item>
        <v-list-item>
          <v-row>
            <v-col>
              <v-text-field
                v-model="item.percent1"
                label="Prozent 1. Semester"
                lang="de-CH"
                :rules="rules.nonNegativeNumber"
                type="number"
              ></v-text-field> </v-col
            ><v-col>
              <v-text-field
                v-model="item.percent2"
                label="Prozent 2. Semester"
                lang="de-CH"
                :rules="rules.nonNegativeNumber"
                type="number"
              ></v-text-field> </v-col
          ></v-row>
        </v-list-item>
      </v-list>
    </template>
    <v-list-item v-if="item.schoolYear && item.schoolYear.ageReliefIncluded">
      <v-alert color="red lighten-4">
        <b>Achtung:</b> Die Prozentangaben verstehen sich inklusive
        Altersentlastung.
      </v-alert>
    </v-list-item>
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
import Rules from '@/utils/rules.js';
import TeacherInput from '@/components/TeacherInput.vue';
export default {
  props: {
    id: { type: Number, default: -1 },
    schoolYear: Object,
  },
  components: { EditDialog, LookupInput, TeacherInput },
  data() {
    return {
      add: false,
      error: null,
      item: {
        schoolYear: this.schoolYear,
      },
      loading: false,
      rules: Rules,
      saving: false,
    };
  },
  computed: {
    saveAllowed() {
      return Boolean(
        this.item.schoolYear && !this.item.schoolYear.archived && !this.saving,
      );
    },
  },
  async created() {
    this.loading = true;
    this.add = this.id < 0;
    if (!this.add) {
      this.item = await this.apiGet({ resource: 'poolentry', id: this.id });
    }
    this.loading = false;
  },
  methods: {
    abort() {
      this.$router.back();
    },
    async remove() {
      let result = await this.$root.confirm(
        `Soll dieser Pool-Eintrag von ${this.item.teacher.code} gelöscht werden?`,
        'error',
        'mdi-trash-can',
      );
      if (result) {
        await this.apiDelete({ resource: 'poolentry', id: this.item.id });
        this.$emit('dataChanged');
        this.$router.push({ name: 'Pool' });
      }
    },
    async save() {
      this.saving = true;
      await this.apiSave({
        resource: 'poolentry',
        add: this.add,
        data: this.item,
        onError: (error) => (this.error = error),
      });
      this.saving = false;
      if (!this.error) {
        this.$emit('dataChanged');
        this.$router.push({ name: 'Pool' });
      }
    },
  },
};
</script>
