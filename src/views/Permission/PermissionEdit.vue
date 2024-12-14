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
          <v-text-field
            v-model="item.accountName"
            :disabled="!add"
            counter
            label="Kontoname"
            maxlength="255"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <v-checkbox
            v-model="item.editAllowed"
            label="kann bearbeiten"
          ></v-checkbox>
        </v-list-item>
        <v-list-item>
          <v-checkbox
            v-model="item.grantAllowed"
            label="kann Berechtigungen vergeben"
          ></v-checkbox>
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
import Rules from '@/utils/rules.js';
export default {
  props: {
    id: { type: Number, default: -1 },
  },
  components: { EditDialog },
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
  computed: {
    saveAllowed() {
      return Boolean(true);
    },
  },
  async created() {
    this.loading = true;
    this.add = this.id < 0;
    console.log(this.add);
    if (!this.add) {
      this.item = await this.apiGet({ resource: 'authorisation', id: this.id });
    }
    this.loading = false;
  },
  methods: {
    abort() {
      this.$router.back();
    },
    async remove() {
      let result = await this.$root.confirm(
        `Soll die Berechtigung von ${this.item.accountName} gelöscht werden?`,
        'error',
        'mdi-trash-can',
      );
      if (result) {
        await this.apiDelete({ resource: 'authorisation', id: this.item.id });
        this.$emit('dataChanged');
        this.$router.push({ name: 'Permission' });
      }
    },
    async save() {
      this.error = null;
      this.saving = true;
      await this.apiSave({
        resource: 'authorisation',
        add: this.add,
        data: this.item,
        onError: (error) => (this.error = error),
      });
      this.saving = false;
      if (!this.error) {
        this.$emit('dataChanged');
        this.$router.push({ name: 'Permission' });
      }
    },
  },
};
</script>
