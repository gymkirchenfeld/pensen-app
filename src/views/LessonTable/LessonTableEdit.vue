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
    <v-list dense v-if="item">
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <LookupValue
              v-model="item.curriculum"
              label="Lehrgang"
              readonly
              filled
              resource="curriculum"
            ></LookupValue>
          </v-list-item-title>
          <v-list-item-subtitle>Lehrgang</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            <LookupValue
              v-if="!item.subject.crossClass"
              v-model="item.division"
              label="Organisationseinheit"
              readonly
              filled
              resource="division"
            ></LookupValue>
          </v-list-item-title>
          <v-list-item-subtitle>Abteilung</v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-for="entry in item.details" v-bind:key="entry.grade.id">
        <v-list-item-content>
          <v-list-item-title>{{ entry.grade.description }}</v-list-item-title>
          <v-row>
            <v-col>
              <LookupInput
                v-model="entry.type"
                resource="lessontype"
                label="Art"
              ></LookupInput>
            </v-col>
            <v-col>
              <v-text-field
                v-if="entry.type.code !== 'X'"
                v-model="entry.lessons1"
                label="Lektionen 1. Semester"
                lang="de-CH"
                :rules="rules.nonNegativeNumber"
                type="number"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                v-if="entry.type.code !== 'X'"
                v-model="entry.lessons2"
                label="Lektionen 2. Semester"
                lang="de-CH"
                :rules="rules.nonNegativeNumber"
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </EditDialog>
</template>
<script>
import EditDialog from '@/components/EditDialog.vue';
import LookupInput from '@/components/LookupInput.vue';
import LookupValue from '@/components/LookupValue.vue';
import Rules from '@/utils/rules.js';
export default {
  components: {
    EditDialog,
    LookupInput,
    LookupValue,
  },
  props: {
    id: { type: String, default: null },
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
      rules: Rules,
      saving: false,
    };
  },
  async created() {
    this.loading = true;
    this.item = await this.apiGet({ resource: 'lessontable', id: this.id });
    this.loading = false;
  },
  methods: {
    async save() {
      this.saving = true;
      await this.apiPut({
        resource: 'lessontable',
        data: this.item,
        onError: (error) => (this.error = error),
      });
      this.saving = false;
      if (!this.error) {
        this.$emit('dataChanged');
        this.$router.push({ name: 'LessonTable' });
      }
    },
  },
};
</script>
