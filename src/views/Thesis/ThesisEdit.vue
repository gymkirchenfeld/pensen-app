<template>
  <EditDialog
    @save="save"
    :saveAllowed="saveAllowed"
    :width="640"
    icon="mdi-school"
  >
    <template v-slot:title>
      {{ title }}
    </template>
    <template>
      <v-list>
        <v-list-item v-for="thesisType in thesisTypes" :key="thesisType.id">
          <v-text-field
            v-if="item.thesisCounts"
            v-model="item.thesisCounts[thesisType.id]"
            counter
            :label="thesisType.description"
            maxlength="255"
          ></v-text-field>
        </v-list-item>
      </v-list>
    </template>
  </EditDialog>
</template>
<script>
import EditDialog from '@/components/EditDialog.vue';
export default {
  props: {
    id: { type: String, default: '' },
    schoolYear: Object,
  },
  components: { EditDialog },
  data() {
    return {
      add: false,
      item: {
        schoolYear: this.schoolYear,
      },
      loading: false,
      saving: false,
      thesisTypes: [],
    };
  },
  computed: {
    saveAllowed() {
      return Boolean(
        this.item.schoolYear && !this.item.schoolYear.archived && !this.saving,
      );
    },
    title() {
      if (this.item.teacher) {
        return `Abschlussarbeiten von ${this.item.teacher.firstName} ${this.item.teacher.lastName}`;
      } else {
        return '';
      }
    },
  },
  async created() {
    this.loading = true;
    this.thesisTypes = await this.apiList({ resource: 'thesistype' });
    this.item = await this.apiGet({ resource: 'thesis', id: this.id });
    this.loading = false;
  },
  methods: {
    abort() {
      this.$router.back();
    },
    async save() {
      this.saving = true;
      await this.apiPut({ resource: 'thesis', data: this.item });
      this.$emit('dataChanged');
      this.$router.push({ name: 'Thesis' });
      this.saving = false;
    },
  },
};
</script>
