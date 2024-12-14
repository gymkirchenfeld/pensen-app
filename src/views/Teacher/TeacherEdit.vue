<template>
  <EditDialog
    :error="error"
    @save="save"
    :saveAllowed="!saving"
    :width="512"
    icon="mdi-account"
  >
    <template v-slot:title>
      <span v-if="add"> Neue Lehrperson </span>
      <span v-else>{{ item.firstName }} {{ item.lastName }} </span>
    </template>
    <template>
      <v-list>
        <v-list-item>
          <LookupInput
            v-model="item.gender"
            label="Geschlecht"
            resource="gender"
          ></LookupInput>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="item.title"
            counter
            label="Titel"
            maxlength="50"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="item.firstName"
            counter
            label="Vorname"
            maxlength="50"
            :rules="rules.requiredText"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="item.lastName"
            counter
            label="Nachname"
            maxlength="50"
            :rules="rules.requiredText"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="item.code"
            counter
            label="Kürzel"
            maxlength="10"
            :rules="rules.requiredText"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <DepartmentsInput v-model="item.departments"></DepartmentsInput>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="item.email"
            counter
            label="E-Mail-Adresse"
            maxlength="255"
            :rules="rules.emailAddress"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="item.employeeNumber"
            counter
            label="Personalnummer"
            maxlength="10"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <DateInput
            v-model="item.birthday"
            label="Geburtsdatum"
          ></DateInput> </v-list-item
      ></v-list>
      <v-list-item>
        <v-checkbox
          v-if="!add"
          v-model="item.archived"
          label="archiviert"
        ></v-checkbox>
      </v-list-item>
    </template>
  </EditDialog>
</template>
<script>
import DateInput from '@/components/DateInput.vue';
import DepartmentsInput from '@/components/DepartmentsInput.vue';
import EditDialog from '@/components/EditDialog.vue';
import LookupInput from '@/components/LookupInput.vue';
import Rules from '@/utils/rules.js';
export default {
  props: {
    id: { type: Number, default: -1 },
  },
  components: {
    DateInput,
    DepartmentsInput,
    EditDialog,
    LookupInput,
  },
  data() {
    return {
      add: false,
      error: null,
      item: {},
      loading: false,
      rules: Rules,
      saving: false,
    };
  },

  async created() {
    this.loading = true;
    this.add = this.id < 0;
    if (!this.add) {
      this.item = await this.apiGet({ resource: 'teacher', id: this.id });
    }
    this.loading = false;
  },
  methods: {
    abort() {
      this.$router.back();
    },
    async save() {
      this.error = null;
      this.saving = true;
      await this.apiSave({
        resource: 'teacher',
        add: this.add,
        data: this.item,
        onError: (error) => (this.error = error),
      });
      this.saving = false;
      if (!this.error) {
        this.$emit('dataChanged');
        this.$router.push({ name: 'Teacher' });
      }
    },
  },
};
</script>
