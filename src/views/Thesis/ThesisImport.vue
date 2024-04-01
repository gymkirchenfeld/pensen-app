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
          Daten einfügen
        </v-stepper-step>
        <v-divider></v-divider>
        <v-stepper-step :complete="step > 2" step="2">
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
            Bitte die zu importierenden Datensätze einfügen. Jede Zeile muss
            folgende Spalten in dieser Reihenfolge enthalten:
            <ol>
              <li>Kürzel der Lehrperson</li>
              <li v-for="thesisType in thesisTypes" :key="thesisType.id">
                Anzahl {{ thesisType.description }}
              </li>
            </ol>
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
            rows="10"
          ></v-textarea>
        </v-stepper-content>

        <v-stepper-content step="2">
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
      thesisTypes: [],
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
      this.loadData();
    },
  },
  async created() {
    this.thesisTypes = await this.apiList({ resource: 'thesistype' });
    this.thesisTypes.forEach((thesisType) => {
      this.headers.push({ text: thesisType.description, value: thesisType.id });
    });
    this.headers.push({ text: '', value: 'status' });
  },
  methods: {
    async loadData() {
      const items = await this.apiList({
        resource: 'thesis',
        query: `schoolYear=${this.schoolYear.id}`,
      });
      const itemMap = {};
      items.forEach((item) => {
        item.status = 'ready';
        item.oldThesisCounts = {};
        this.thesisTypes.forEach((thesisType) => {
          const key = thesisType.id;
          item.oldThesisCounts[key] = item.thesisCounts[key];
          item.thesisCounts[key] = 0;
        });
        itemMap[item.teacher.code] = item;
      });
      this.items = items;
      this.itemMap = itemMap;
    },
    stepParse() {
      const columnCount = this.thesisTypes.length + 1;
      const lines = this.rawInput.split('\n');
      let i = 1;
      lines.forEach((line) => {
        const columns = this.parseLine(line, i);
        if (!columns || columns.length !== columnCount) {
          console.log(`Zeile ${i} enthält zu wenig Spalten.`);
        } else {
          const code = columns[0];
          const item = this.itemMap[code];
          if (!item) {
            console.log(`Unbekanntes Kürzel ${code} auf Zeile ${i}.`);
          } else {
            this.thesisTypes.forEach((thesisType) => {
              const key = thesisType.id;
              const count =
                columns[key] === '' ? 0 : Number.parseFloat(columns[key]);
              if (isNaN(count)) {
                console.log(
                  `Ungültige Zahl <${columns[thesisType.id]}> auf Zeile ${i}.`,
                );
              } else {
                item.thesisCounts[key] = count;
              }
            });
          }
        }
        i += 1;
      });
      this.step += 1;
    },
    parseLine(line, i) {
      if (line.indexOf('\t') > -1) {
        return line.split('\t');
      } else if (line.indexOf(',') > -1) {
        return line.split(',');
      } else {
        console.log(
          `Zeile ${i} enthält kein gültiges Spaltentrennzeichen und wird ignoriert.`,
        );
      }
    },
    stepImport() {
      this.importing = true;
      this.items.forEach(async (item) => {
        item.status = 'importing';
        await this.apiPut({ resource: 'thesis', data: item });
        item.status = 'imported';
      });
    },
    prev() {
      this.step -= 1;
    },
  },
};
</script>
