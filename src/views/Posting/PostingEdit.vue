<template>
  <EditDialog
    :error="error"
    @save="save"
    :saveAllowed="saveAllowed"
    :width="512"
    icon="mdi-plus-minus-variant"
  >
    <template v-slot:title>
      <span v-if="add"> Neue Einzellektionen erfassen</span>
      <span v-else>Einzellektionen bearbeiten</span>
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
          <DateInput label="von" v-model="item.startDate"></DateInput>
        </v-list-item>
        <v-list-item>
          <DateInput label="bis" v-model="item.endDate"></DateInput>
        </v-list-item>
        <v-list-item v-for="postingType in postingTypes" :key="postingType.id">
          <v-text-field
            v-model="item.details[postingType.id]"
            :label="postingType.description"
            lang="de-CH"
            type="number"
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
import DateInput from '@/components/DateInput.vue';
import EditDialog from '@/components/EditDialog.vue';
import TeacherInput from '@/components/TeacherInput.vue';
export default {
  props: {
    id: { type: Number, default: -1 },
    schoolYear: Object,
  },
  components: {
    DateInput,
    EditDialog,
    TeacherInput,
  },
  data() {
    return {
      add: false,
      error: null,
      item: {
        details: {},
        schoolYear: this.schoolYear,
      },
      loading: false,
      postingTypes: [],
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
    this.postingTypes = await this.apiList({ resource: 'postingtype' });
    if (!this.add) {
      this.item = await this.apiGet({ resource: 'posting', id: this.id });
    }
    this.loading = false;
  },
  methods: {
    abort() {
      this.$router.back();
    },
    async remove() {
      let result = await this.$root.confirm(
        `Soll diese Einzelbuchung für ${this.item.teacher.code} gelöscht werden?`,
        'error',
        'mdi-trash-can',
      );
      if (result) {
        await this.apiDelete({ resource: 'posting', id: this.item.id });
        this.$emit('dataChanged');
        this.$router.push({ name: 'Posting' });
      }
    },
    async save() {
      this.error = null;
      this.saving = true;
      await this.apiSave({
        resource: 'posting',
        add: this.add,
        data: this.item,
        onError: (error) => (this.error = error),
      });
      this.saving = false;
      if (!this.error) {
        this.$emit('dataChanged');
        this.$router.push({ name: 'Posting' });
      }
    },
  },
};
</script>
