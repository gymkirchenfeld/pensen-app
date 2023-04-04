<template>
  <v-dialog
    v-bind="$attrs"
    persistent
    scrollable
    :width="640"
    @keydown.esc="close"
    v-model="visible"
  >
    <v-card
      ><v-card-title class="pa-0"
        ><v-toolbar flat dark color="primary">
          <v-btn icon>
            <v-icon>mdi-email-send-outline</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn @click="close" icon>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item>
            <v-text-field
              v-model="recipient"
              label="Empfänger"
              lang="de-CH"
              readonly
              filled
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model="settings.mailFrom"
              label="Absender"
              lang="de-CH"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-text-field
              v-model="settings.mailSubject"
              label="Betreff"
              lang="de-CH"
            ></v-text-field>
          </v-list-item>
          <v-list-item>
            <v-textarea
              v-model="settings.mailBody"
              counter
              label="Inhalt"
              rows="8"
            ></v-textarea>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <JobButton
          @done="close"
          color="success"
          text
          icon="mdi-email-send-outline"
          :prepare="prepareJob"
          >Senden</JobButton
        >
        <v-btn text @click="close"
          ><v-icon left>mdi-close</v-icon> Abbrechen</v-btn
        >
      </v-card-actions>
    </v-card>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" v-on="on" outlined color="success" class="mr-5"
        ><v-icon left>mdi-email-send-outline</v-icon><slot></slot
      ></v-btn>
    </template>
  </v-dialog>
</template>
<script>
import JobButton from '@/components/JobButton.vue';
export default {
  components: {
    JobButton,
  },
  props: {
    division: { type: Object, default: null },
    schoolYear: { type: Object, default: null },
    teacher: { type: Object, default: null },
  },
  data() {
    return {
      settings: {},
      visible: false,
    };
  },
  async created() {
    this.settings = await this.apiList({ resource: 'settings' });
  },
  computed: {
    recipient() {
      if (this.teacher) {
        return this.teacher.firstName + ' ' + this.teacher.lastName;
      }
      if (this.division) {
        if (this.division.id === -1) {
          return 'alle Lehrpersonen';
        }
        return 'alle Lehrpersonen der Abteilung ' + this.division.code;
      }
      return '';
    },
    title() {
      let result = 'Versand';
      if (this.teacher) {
        result += ' Pensenblatt ';
      } else {
        result += ' Pensenblätter ';
      }
      if (this.schoolYear) {
        result += this.schoolYear.code;
      }
      return result;
    },
  },
  methods: {
    async close() {
      await this.apiPost({ resource: 'settings', data: this.settings });
      this.visible = false;
    },
    prepareJob() {
      return {
        division: this.division,
        mailBody: this.settings.mailBody,
        mailFrom: this.settings.mailFrom,
        mailSubject: this.settings.mailSubject,
        name: 'WorkloadMail',
        schoolYear: this.schoolYear,
        teacher: this.teacher,
      };
    },
  },
};
</script>
