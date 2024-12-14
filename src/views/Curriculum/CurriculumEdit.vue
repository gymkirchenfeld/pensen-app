<template>
  <EditDialog
    :error="error"
    @save="save"
    :saveAllowed="saveAllowed"
    :width="640"
    icon="mdi-school"
  >
    <template v-slot:title>
      <span v-if="add && !copy"> Neuer Lehrgang </span>
      <span v-if="add && copy"> Lehrgang {{ orig.code }} kopieren</span>
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
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <v-text-field
            v-model="item.description"
            counter
            label="Beschreibung"
            maxlength="100"
          ></v-text-field>
        </v-list-item>
        <v-list-item>
          <v-checkbox v-model="item.archived" label="archiviert"></v-checkbox>
        </v-list-item>
        <v-list-item
          ><v-data-table
            dense
            :headers="headers"
            hide-default-footer
            :items="item.grades"
            :items-per-page="-1"
          >
            <template v-slot:item.code="props">
              <v-edit-dialog
                :return-value.sync="props.item.code"
                large
                cancel-text="abbrechen"
                save-text="ok"
              >
                {{ props.item.code }}
                <template v-slot:input>
                  <v-text-field
                    v-model="props.item.code"
                    label="Edit"
                    single-line
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>

            <template v-slot:item.description="props">
              <v-edit-dialog
                :return-value.sync="props.item.description"
                large
                cancel-text="abbrechen"
                save-text="ok"
              >
                {{ props.item.description }}
                <template v-slot:input>
                  <v-text-field
                    v-model="props.item.description"
                    label="Edit"
                    single-line
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </template>

            <template v-slot:item.payrollType="props">
              <v-edit-dialog
                :return-value.sync="props.item.payrollType"
                large
                cancel-text="abbrechen"
                save-text="ok"
              >
                {{ props.item.payrollType.description }}
                <template v-slot:input>
                  <LookupInput
                    v-model="props.item.payrollType"
                    label="Anstellungsart"
                    resource="payrolltype"
                  ></LookupInput>
                </template>
              </v-edit-dialog>
            </template>
          </v-data-table>
        </v-list-item>
        <v-list-item v-if="add">
          <v-btn @click="addGrade()" outlined class="my-4" text block
            >Stufe hinzufügen</v-btn
          >
        </v-list-item>
      </v-list>
    </template>
    <template v-slot:actions>
      <v-btn text @click="save(true)" color="warning" :disabled="!saveAllowed"
        ><v-icon>mdi-content-copy</v-icon> Kopie speichern</v-btn
      >
    </template>
  </EditDialog>
</template>
<script>
import EditDialog from '@/components/EditDialog.vue';
import LookupInput from '@/components/LookupInput.vue';
export default {
  props: {
    id: { type: Number, default: -1 },
  },
  components: { EditDialog, LookupInput },
  data() {
    return {
      add: false,
      copy: false,
      error: null,
      headers: [
        { text: 'Kürzel', value: 'code' },
        { text: 'Bezeichnung', value: 'description' },
        { text: 'Anstellungsart', value: 'payrollType' },
      ],
      item: { grades: [] },
      orig: {},
      loading: false,
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
      this.item = await this.apiGet({ resource: 'curriculum', id: this.id });
    }
    this.loading = false;
  },
  methods: {
    abort() {
      this.$router.back();
    },
    addGrade() {
      if (!this.add) {
        return;
      }
      this.item.grades.push({
        code: '–',
        description: '–',
        weeklyLessons: 0,
      });
    },
    async save(saveCopy) {
      this.error = null;
      this.saving = true;
      await this.apiSave({
        resource: 'curriculum',
        add: this.add || saveCopy,
        data: this.item,
        onError: (error) => (this.error = error),
      });
      this.saving = false;
      if (!this.error) {
        this.$emit('dataChanged');
        this.$router.push({ name: 'Curriculum' });
      }
    },
  },
};
</script>
