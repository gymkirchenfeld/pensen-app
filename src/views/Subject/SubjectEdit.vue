<template>
  <EditDialog
    :error="error"
    @save="save"
    :saveAllowed="!saving"
    :width="512"
    icon="mdi-book-open-variant"
  >
    <template v-slot:title>
      <span v-if="add"> Neues Fach </span>
      <span v-else>{{ item.description }} </span>
    </template>
    <template>
      <v-list>
        <v-list-item>
          <LookupInput v-model="item.type" label="Typ" resource="subjecttype">
          </LookupInput>
        </v-list-item>
        <v-list-item>
          <LookupInput
            v-model="item.category"
            label="Fachgebiet"
            resource="subjectcategory"
          ></LookupInput>
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
          <v-text-field
            v-model="item.description"
            counter
            label="Bezeichnung"
            maxlength="100"
            :rules="rules.requiredText"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <v-checkbox
            v-model="item.crossClass"
            label="gesamtschulisch"
          ></v-checkbox>
        </v-list-item>
        <v-list-item>
          <v-checkbox
            v-if="!add"
            v-model="item.archived"
            label="archiviert"
          ></v-checkbox>
        </v-list-item>
      </v-list>
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
      this.item = await this.apiGet({ resource: 'subject', id: this.id });
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
        resource: 'subject',
        add: this.add,
        data: this.item,
        onError: (error) => (this.error = error),
      });
      this.saving = false;
      if (!this.error) {
        this.$emit('dataChanged');
        this.$router.push({ name: 'Subject' });
      }
    },
  },
};
</script>
