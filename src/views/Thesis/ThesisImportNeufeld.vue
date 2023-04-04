<template>
  <Page
    icon="mdi-import"
    title="Import Arbeiten"
    v-model="schoolYear"
    schoolYearVisible
  >
    <template v-slot:toolbar> </template>
    <v-stepper v-model="step" height="100%">
      <v-stepper-header>
        <v-stepper-step :complete="step > 1" step="1">
          Importart wählen
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">
          Daten einfügen
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 3" step="3">
          Überprüfen
        </v-stepper-step>
        <v-divider></v-divider>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1">
          <v-banner>
            <v-avatar slot="icon" color="accent" size="40">
              <v-icon color="white"> mdi-content-paste </v-icon>
            </v-avatar>
            Bitte die Art der zu importierenden Datensätze wählen.
            <template v-slot:actions>
              <v-btn text @click="stepInput" color="info">
                weiter<v-icon right>mdi-chevron-right</v-icon>
              </v-btn>
            </template>
          </v-banner>
          <v-radio-group v-model="type">
            <v-radio :value="1" label="Maturaarbeiten" />
            <v-radio :value="2" label="Abschlussarbeiten FMS" />
          </v-radio-group>
        </v-stepper-content>
        <v-stepper-content step="2">
          <v-banner>
            <v-avatar slot="icon" color="accent" size="40">
              <v-icon color="white"> mdi-content-paste </v-icon>
            </v-avatar>
            Bitte die zu importierenden Datensätze einfügen. Jede Zeile darf nur
            das Kürzel einer oder zwei Lehrpersonen enthalten.
            <template v-slot:actions>
              <v-btn text @click="prev" color="info">
                <v-icon left>mdi-chevron-left</v-icon> zurück
              </v-btn>
              <v-btn text @click="stepParse" color="info">
                weiter<v-icon right>mdi-chevron-right</v-icon>
              </v-btn>
            </template>
          </v-banner>
          <v-textarea
            outlined
            label="Eingabe"
            v-model="rawInput"
            rows="20"
          ></v-textarea>
        </v-stepper-content>

        <v-stepper-content step="3">
          <v-banner>
            <v-avatar slot="icon" color="accent" size="40">
              <v-icon color="white"> mdi-table </v-icon>
            </v-avatar>
            Bitte die neu zu setzende Anzahl Arbeiten überprüfen. Die Werte in
            Klammern geben die Veränderung zur bisher gespeicherten Anzahl
            Arbeiten an.
            <template v-slot:actions>
              <v-btn text @click="prev" color="info">
                <v-icon left>mdi-chevron-left</v-icon> zurück
              </v-btn>
              <v-btn
                text
                :disabled="importing"
                @click="stepImport"
                color="success"
              >
                Importieren<v-icon right>mdi-import</v-icon>
              </v-btn>
            </template>
          </v-banner>
          <v-data-table
            dense
            disable-pagination
            :headers="headers"
            hide-default-footer
            :items="items"
            sort-by="teacher.code"
          >
            <template v-slot:item="params">
              <tr>
                <td :key="i" v-for="(col, i) in params.headers">
                  <TeacherValue
                    v-if="col.value === 'teacher'"
                    :value="params.item[col.value]"
                  />
                  <ProgressStatus
                    v-else-if="col.value === 'status'"
                    v-model="params.item.status"
                  />
                  <template v-else>
                    <ChangeValue
                      :oldValue="params.item.oldThesisCounts[col.value]"
                      :newValue="params.item.thesisCounts[col.value]"
                    />
                  </template>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </Page>
</template>
<script>
import ChangeValue from '@/components/ChangeValue.vue';
import Page from '@/components/Page.vue';
import ProgressStatus from '@/components/ProgressStatus.vue';
import TeacherValue from '@/components/TeacherValue.vue';
const MA = 1;

export default {
  components: {
    ChangeValue,
    Page,
    ProgressStatus,
    TeacherValue,
  },
  data() {
    return {
      headers: [{ text: 'Lehrperson', value: 'teacher' }],
      importing: false,
      itemMap: {},
      items: [],
      rawInput: '',
      step: 1,
      schoolYear: null,
      type: MA,
    };
  },
  computed: {
    typeLabel() {
      return this.type ? 'Maturaarbeiten' : 'Abschlussarbeiten FMS';
    },
  },
  watch: {
    schoolYear() {
      this.step = 1;
    },
  },
  async created() {
    const thesisTypes = await this.apiList({ resource: 'thesistype' });
    thesisTypes.forEach((thesisType) => {
      this.headers.push({ text: thesisType.description, value: thesisType.id });
    });
    this.headers.push({ text: '', value: 'status' });
  },
  methods: {
    async stepInput() {
      const items = await this.apiList({
        resource: 'employment',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      const itemMap = {};
      items.forEach((employment) => {
        employment.status = 'ready';
        employment.oldThesisCounts = {};
        for (const key in employment.thesisCounts) {
          employment.oldThesisCounts[key] = employment.thesisCounts[key];
          if (this.type === MA) {
            employment.thesisCounts[1] = 0;
            employment.thesisCounts[2] = 0;
          } else {
            employment.thesisCounts[3] = 0;
          }
        }
        itemMap[employment.teacher.code] = employment;
      });
      this.items = items;
      this.itemMap = itemMap;
      this.step += 1;
    },
    stepParse() {
      const lines = this.rawInput.split('\n');
      let i = 1;
      lines.forEach((line) => {
        const codes = line.split(/(\s+)/).filter((e) => e.trim().length > 0);
        if (this.type === MA) {
          // Maturaarbeiten
          if (codes.length > 0) {
            const item = this.itemMap[codes[0]];
            if (item) {
              item.thesisCounts[1] += 1;
            } else {
              console.log(`Unbekanntes Kürzel ${codes[0]} auf Zeile ${i}.`);
            }
          }
          if (codes.length > 1) {
            const item = this.itemMap[codes[1]];
            if (item) {
              item.thesisCounts[2] += 1;
            } else {
              console.log(`Unbekanntes Kürzel ${codes[1]} auf Zeile ${i}.`);
            }
          }
        } else {
          // Abschlussarbeiten FMS
          if (codes.length > 0) {
            const item = this.itemMap[codes[0]];
            if (item) {
              item.thesisCounts[3] += 1;
            } else {
              console.log(`Unbekanntes Kürzel ${codes[0]} auf Zeile ${i}.`);
            }
          }
        }
        i += 1;
      });
      this.step += 1;
    },
    stepImport() {
      this.importing = true;
      this.items.forEach(async (employment) => {
        employment.status = 'importing';
        await this.apiPut({ resource: 'employment', data: employment });
        employment.status = 'imported';
      });
    },
    prev() {
      this.step -= 1;
    },
  },
};
</script>
