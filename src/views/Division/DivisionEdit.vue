<template>
  <EditDialog
    :error="error"
    @save="save"
    :saveAllowed="saveAllowed"
    :width="640"
    icon="mdi-school"
  >
    <template v-slot:title>
      <span v-if="add"> Neue Organisationseinheit</span>
      <span v-else>{{ item.description }} </span>
    </template>
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
        <v-list-item>
          <v-text-field
            v-model="item.description"
            counter
            label="Beschreibung"
            maxlength="100"
            :rules="rules.requiredText"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="item.grouping"
            counter
            label="Gruppierung (Export nach Fachgebiet)"
            maxlength="100"
            :rules="rules.requiredText"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="item.headName"
            counter
            label="Name Leitung"
            maxlength="255"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="item.headTitle"
            counter
            label="Funktionsbezeichnung Leitung"
            maxlength="255"
          ></v-text-field>
        </v-list-item>
        <ImageEdit
          :image="item.headSignature"
          label="Unterschrift Leitung"
        ></ImageEdit>
        <ImageEdit :image="item.logo" label="Logo"></ImageEdit>
      </v-list>
    </template>
    <template v-slot:actions>
      <v-spacer></v-spacer>
    </template>
  </EditDialog>
</template>
<script>
import EditDialog from '@/components/EditDialog.vue';
import ImageEdit from '@/components/ImageEdit.vue';
import Rules from '@/utils/rules.js';
export default {
  props: {
    id: { type: Number, default: -1 },
  },
  components: { EditDialog, ImageEdit },
  data() {
    return {
      add: false,
      error: null,
      item: { grades: [] },
      loading: false,
      rules: Rules,
      saving: false,
    };
  },
  computed: {
    saveAllowed() {
      return Boolean(!this.saving && this.item.code && this.item.description);
    },
  },
  async created() {
    this.loading = true;
    this.add = this.id < 0;
    if (!this.add) {
      this.item = await this.apiGet({ resource: 'division', id: this.id });
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
        resource: 'division',
        add: this.add,
        data: this.item,
        onError: (error) => (this.error = error),
      });
      this.saving = false;
      if (!this.error) {
        this.$emit('dataChanged');
        this.$router.push({ name: 'Division' });
      }
    },
  },
};
</script>
