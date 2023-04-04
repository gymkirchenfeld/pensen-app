<template>
  <EditDialog
    @save="save"
    :saveAllowed="!saving"
    :width="512"
    icon="mdi-account-group"
  >
    <template v-slot:title>{{ title }} </template>
    <template>
      <v-list>
        <v-list-item>
          <v-text-field
            v-model="item.code"
            counter
            label="Kürzel"
            maxlength="10"
            :rules="rules.requiredText"
          ></v-text-field>
        </v-list-item>
        <v-list-item v-if="add">
          <v-text-field
            v-model="item.graduationYear"
            label="Abschlussjahr"
            maxlength="4"
            lang="de-CH"
            type="number"
            :rules="rules.year"
          ></v-text-field>
        </v-list-item>
        <v-list-item v-if="add">
          <LookupInput
            v-model="item.curriculum"
            label="Lehrgang"
            resource="curriculum"
          ></LookupInput>
        </v-list-item>
        <v-list-item>
          <LookupInput
            v-model="item.division"
            label="Abteilung"
            resource="division"
          ></LookupInput>
        </v-list-item>
        <v-list-item>
          <v-checkbox v-model="item.archived" label="archiviert"></v-checkbox>
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
import Rules from '@/utils/rules.js';
export default {
  props: {
    id: { type: Number, default: -1 },
  },
  components: { EditDialog, LookupInput },
  data() {
    return {
      add: false,
      item: {},
      loading: false,
      rules: Rules,
      saving: false,
    };
  },
  computed: {
    title() {
      if (this.add) return 'Neue Klasse';
      if (this.item) return this.item.code;
      return '';
    },
  },
  async created() {
    this.loading = true;
    this.add = this.id < 0;
    if (!this.add) {
      this.item = await this.apiGet({ resource: 'schoolclass', id: this.id });
    }
    this.loading = false;
  },
  methods: {
    abort() {
      this.$router.back();
    },
    async remove() {
      let result = await this.$root.confirm(
        'Soll die Klasse «' + this.title + '» wirklich gelöscht werden?',
        'error',
        'mdi-trash-can',
      );
      if (result) {
        await this.apiDelete({ resource: 'schoolclass', id: this.item.id });
        this.$emit('dataChanged');
        this.$router.push({ name: 'SchoolClass' });
      }
    },
    async save() {
      this.saving = true;
      if (this.add) {
        await this.apiPost({ resource: 'schoolclass', data: this.item });
      } else {
        await this.apiPut({ resource: 'schoolclass', data: this.item });
      }
      this.$emit('dataChanged');
      this.$router.push({ name: 'SchoolClass' });
      this.saving = false;
    },
  },
};
</script>
