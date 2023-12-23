<template>
  <EditDialog
    :error="error"
    @save="save"
    :saveAllowed="!saving"
    :width="800"
    icon="mdi-calendar-month"
  >
    <template v-slot:title>
      <span v-if="add"> Neues Schuljahr </span>
      <span v-else>{{ item.description }} </span>
    </template>
    <template>
      <v-row>
        <v-col>
          <v-list>
            <v-subheader>ALLGEMEINE ANGABEN</v-subheader>
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
        </v-col>
        <v-col>
          <v-list>
            <v-subheader>ANHANG 3A LAV ART. 42</v-subheader>
            <v-list-item>
              <v-text-field
                v-model.number="item.weeks"
                label="Anzahl Schulwochen pro Jahr"
                lang="de-CH"
                :rules="rules.week"
                type="number"
              ></v-text-field>
            </v-list-item>
            <v-list-item
              v-for="payrollType in payrollTypes"
              :key="payrollType.id"
            >
              <v-text-field
                v-model="item.weeklyLessons[payrollType.id]"
                :label="payrollType.description + ' (L pro Woche)'"
                lang="de-CH"
                type="number"
              ></v-text-field>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
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
      error: null,
      item: {},
      loading: false,
      payrollTypes: [],
      rules: Rules,
      saving: false,
    };
  },
  async created() {
    this.loading = true;
    this.add = this.id < 0;
    this.payrollTypes = await this.apiList({ resource: 'payrolltype' });
    if (!this.add) {
      this.item = await this.apiGet({ resource: 'schoolyear', id: this.id });
    }
    this.loading = false;
  },
  methods: {
    async save() {
      this.saving = true;
      await this.apiSave({
        resource: 'schoolyear',
        add: this.add,
        data: this.item,
        onError: (error) => (this.error = error),
      });
      this.saving = false;
      if (!this.error) {
        this.$emit('dataChanged');
        this.$router.push({ name: 'SchoolYear' });
      }
    },
  },
};
</script>
