<template>
  <EditDialog
    @save="save"
    :saveAllowed="!saving"
    :width="512"
    icon="mdi-calendar-month"
  >
    <template v-slot:title>
      <span v-if="add"> Neues Schuljahr </span>
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
            label="Bezeichnung"
            maxlength="100"
            :rules="rules.requiredText"
          ></v-text-field>
        </v-list-item>
        <v-list-item v-if="add">
          <v-text-field
            v-model.number="item.graduationYear"
            label="Maturjahr"
            lang="de-CH"
            :rules="rules.year"
            type="number"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model.number="item.weeks"
            label="Anzahl Schulwochen für Einzellektionen"
            lang="de-CH"
            :rules="rules.week"
            type="number"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <LookupInput
            v-model="item.calculationMode"
            label="Berechnungsmodus"
            resource="calculationmode"
          ></LookupInput>
        </v-list-item>
        <v-list-item>
          <v-checkbox
            v-if="!add"
            v-model="item.finalised"
            label="Planung abgeschlossen"
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
  components: {
    EditDialog,
    LookupInput,
  },
  data() {
    return {
      add: false,
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
      this.item = await this.apiGet({ resource: 'schoolyear', id: this.id });
    }
    this.loading = false;
  },
  methods: {
    async save() {
      this.saving = true;
      if (this.add) {
        await this.apiPost({ resource: 'schoolyear', data: this.item });
      } else {
        await this.apiPut({ resource: 'schoolyear', data: this.item });
      }
      this.$emit('dataChanged');
      this.$router.push({ name: 'SchoolYear' });
      this.saving = false;
    },
  },
};
</script>
