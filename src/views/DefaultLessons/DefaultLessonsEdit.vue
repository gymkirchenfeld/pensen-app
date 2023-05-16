<template>
  <EditDialog
    :error="error"
    @save="save"
    :saveAllowed="saveAllowed"
    :width="640"
    icon="mdi-table-large"
  >
    <template v-slot:title>
      <span v-if="item">Lektionentafel: {{ item.subject.description }} </span>
    </template>
    <v-list v-if="item">
      <v-list-item>
        <LookupInput
          v-model="item.curriculum"
          label="Lehrgang"
          readonly
          filled
          resource="curriculum"
        ></LookupInput>
      </v-list-item>
      <v-list-item>
        <LookupInput
          v-if="!item.subject.crossClass"
          v-model="item.division"
          label="Organisationseinheit"
          readonly
          filled
          resource="division"
        ></LookupInput>
      </v-list-item>
      <v-list-item
        ><v-row
          ><v-col><strong>1. Semester</strong></v-col
          ><v-col><strong>2. Semester</strong></v-col></v-row
        ></v-list-item
      >
      <v-list-item v-for="grade in grades" v-bind:key="grade.id">
        <v-row>
          <v-col>
            <v-text-field
              v-model="item.lessons1[grade.id]"
              :label="'Lektionen ' + grade.description"
              lang="de-CH"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="item.lessons2[grade.id]"
              :label="'Lektionen ' + grade.description"
              lang="de-CH"
              type="number"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-alert color="blue lighten-4">
          <h3 class="mb-4">Spezielle Bedeutung für die Schuljahreröffnung</h3>
          <ul>
            <li>
              <b>Null Lektionen:</b> Es werden Kurse erzeugt, jedoch mit Null
              Lektionen (z.B. Immersionsfächer, KL-Stellvertretung)
            </li>
            <li>
              <b>Negative Lektionenzahl:</b> Es werden keine Kurse erzeugt.
              Diese können jedoch manuell hinzugefügt werden.
            </li>
          </ul>
        </v-alert>
      </v-list-item>
    </v-list>
  </EditDialog>
</template>
<script>
import EditDialog from '@/components/EditDialog.vue';
import LookupInput from '@/components/LookupInput.vue';
export default {
  components: {
    EditDialog,
    LookupInput,
  },
  props: {
    id: { type: Number, default: -1 },
  },
  computed: {
    saveAllowed() {
      return Boolean(!this.saving);
    },
  },
  data() {
    return {
      error: null,
      grades: [],
      item: null,
      loading: false,
      saving: false,
    };
  },
  async created() {
    this.loading = true;
    this.item = await this.apiGet({ resource: 'defaultlessons', id: this.id });
    const curriculum = await this.apiGet({
      resource: 'curriculum',
      id: this.item.curriculum.id,
    });
    this.grades = curriculum.grades;
    this.loading = false;
  },
  methods: {
    async save() {
      this.saving = true;
      await this.apiPut({
        resource: 'defaultlessons',
        data: this.item,
        onError: (error) => (this.error = error),
      });
      this.saving = false;
      if (!this.error) {
        this.$emit('dataChanged');
        this.$router.push({ name: 'DefaultLessons' });
      }
    },
  },
};
</script>
