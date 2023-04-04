<template>
  <Page
    icon="mdi-card-account-details"
    title="Planung nach Klassen"
    v-model="schoolYear"
    schoolYearVisible
  >
    <template v-slot:toolbar>
      <Select
        v-if="!selecting"
        v-model="division"
        class="flex-grow-0 mr-2"
        label="Organisationseinheit"
        outlined
        resource="division"
        showAll
        showWhenNeeded
        storeSelection="selectedDivision"
      ></Select>
      <Select
        v-if="!selecting"
        v-model="grade"
        class="flex-grow-0 mr-2"
        label="Stufe"
        outlined
        resource="grade"
        showAll
        showWhenNeeded
        storeSelection="selectedGrade"
      ></Select>
      <Select
        v-if="!selecting"
        v-model="subjectCategory"
        class="flex-grow-0 mr-2"
        label="Fachgebiet"
        outlined
        resource="subjectcategory"
        showAll
        showWhenNeeded
        storeSelection="selectedSubjectCategory"
      ></Select>
      <v-spacer></v-spacer>
      <JobButton
        v-if="!selecting"
        class="mr-5"
        outlined
        color="success"
        :prepare="prepareDownload"
        >Liste</JobButton
      >
      <v-btn
        outlined
        v-if="!selecting && schoolYear && !schoolYear.archived"
        color="success"
        @click="toggleSelecting"
        class="ma-1"
        ><v-icon left>mdi-checkbox-outline</v-icon> Auswählen
      </v-btn>
      <v-btn outlined v-if="selecting" color="info" @click="merge" class="ma-1"
        ><v-icon left>mdi-vector-combine</v-icon> Zusammenfassen
      </v-btn>
      <v-btn
        outlined
        v-if="selecting"
        color="error"
        @click="cancel"
        class="ma-1"
        ><v-icon left>mdi-cancel</v-icon> Absagen
      </v-btn>
      <v-btn outlined v-if="selecting" @click="toggleSelecting" class="ma-1"
        ><v-icon left>mdi-close</v-icon> Abbrechen
      </v-btn>
    </template>
    <v-data-table
      dense
      v-if="!loading"
      disable-pagination
      fixed-header
      :headers="headers"
      hide-default-footer
      :items="items"
      :items-per-page="-1"
      id="courseTable"
    >
      <template v-slot:item="params">
        <tr>
          <td :class="col.class" :key="i" v-for="(col, i) in params.headers">
            <LookupValue
              v-if="col.value === 'subject'"
              short
              :value="params.item[col.value]"
            ></LookupValue>
            <template v-else>
              <Course
                dense
                v-model="params.item[col.text]"
                :schoolClass="col.value"
                :subject="params.item['subject']"
                :selecting="selecting"
                @add="add"
                @edit="edit"
                @select="select"
              ></Course>
            </template>
          </td>
        </tr>
      </template>
    </v-data-table>
    <router-view
      :schoolClass="schoolClass"
      :schoolYear="schoolYear"
      :subject="subject"
      @dataChanged="fetchData"
    ></router-view>
  </Page>
</template>
<script>
import Course from '@/components/Course.vue';
import JobButton from '@/components/JobButton.vue';
import LookupValue from '@/components/LookupValue.vue';
import Page from '@/components/Page.vue';
import Select from '@/components/Select.vue';

export default {
  components: {
    Course,
    JobButton,
    LookupValue,
    Page,
    Select,
  },
  data() {
    return {
      division: null,
      grade: null,
      headers: [],
      items: [],
      loading: false,
      fetchScheduled: null,
      schoolClass: null,
      schoolClasses: [],
      schoolYear: null,
      selectedItems: {},
      selecting: false,
      subject: null,
      subjectCategory: null,
      subjects: [],
    };
  },
  watch: {
    division() {
      this.scheduleFetch();
    },
    grade() {
      this.scheduleFetch();
    },
    schoolYear() {
      this.scheduleFetch();
    },
    subjectCategory() {
      this.scheduleFetch();
    },
  },
  methods: {
    async add(schoolClass, subject) {
      this.schoolClass = schoolClass;
      this.subject = subject;
      this.$router.push({ name: 'CourseEdit', params: { id: -1 } });
    },
    async cancel() {
      const ids = Object.keys(this.selectedItems);
      for (let i = 0; i < ids.length; ++i) {
        const course = this.selectedItems[ids[i]];
        course.cancelled = true;
        await this.apiPut({ resource: 'course', data: course });
      }
      this.selecting = false;
      this.fetchData();
    },
    lookupCourse(item) {
      if (!item) return;
      return this.courses[item.id];
    },
    select(item) {
      if (item.selected) {
        this.selectedItems[item.id] = item;
      } else {
        delete this.selectedItems[item.id];
      }
    },
    edit(item) {
      this.$router.push({ name: 'CourseEdit', params: { id: item.id } });
    },
    async fetchData() {
      if (this.fetchScheduled) clearTimeout(this.fetchScheduled);
      if (!this.schoolYear) return;
      if (this.loading) return;
      this.loading = true;
      let query = `schoolYear=${this.schoolYear.id}`;
      if (this.division && this.division.id != -1)
        query += `&division=${this.division.id}`;
      if (this.grade && this.grade.id != -1) query += `&grade=${this.grade.id}`;
      if (this.subjectCategory && this.subjectCategory.id != -1)
        query += `&subjectCategory=${this.subjectCategory.id}`;
      const data = await this.apiList({
        resource: 'coursetable',
        query: query,
      });
      this.schoolClasses = data.schoolClasses;
      this.courses = data.courses;
      data.items.forEach((item) => {
        data.schoolClasses.forEach((schoolClass) => {
          const code = schoolClass.code;
          const entry = item[code];
          if (entry) {
            item[code] = data.courses[entry.id];
            item[code].selected = false;
          }
        });
      });
      this.updateColumns();
      this.items = data.items;
      this.loading = false;
    },
    async merge() {
      const ids = Object.keys(this.selectedItems);
      let firstCourse;
      for (let i = 0; i < ids.length; ++i) {
        const item = this.selectedItems[ids[i]];
        if (!firstCourse) {
          firstCourse = item;
        } else {
          if (firstCourse.subject.id !== item.subject.id) {
            this.$root.showError(
              'Unterschiedliche Fächer können nicht zusammengefasst werden.',
            );
            return;
          }
          if (firstCourse.grade.id !== item.grade.id) {
            this.$root.showError(
              'Unterschiedliche Schulstufen können nicht zusammengefasst werden.',
            );
            return;
          }
        }
      }
      await this.apiPost({ resource: 'course', data: { merge: ids } });
      this.fetchData();
    },
    prepareDownload() {
      return {
        division: this.division,
        grade: this.grade,
        name: 'CourseTableCSVDownload',
        schoolYear: this.schoolYear,
        subjectCategory: this.subjectCategory,
      };
    },
    scheduleFetch() {
      if (this.fetchScheduled) clearTimeout(this.fetchScheduled);
      this.fetchScheduled = setTimeout(this.fetchData, 100);
    },
    toggleSelecting() {
      this.selecting = !this.selecting;
      if (this.selecting) this.selectedItems = {};
    },
    updateColumns() {
      this.headers = [
        {
          value: 'subject',
          sortable: false,
          text: 'Fach',
          class: 'course-td-left',
        },
      ];
      this.schoolClasses.forEach((schoolClass) => {
        this.headers.push({
          sortable: false,
          align: 'center',
          text: schoolClass.code,
          value: schoolClass,
          class: 'course-td',
        });
      });
      this.headers.push({
        align: 'right',
        value: 'subject',
        class: 'course-td-right',
        sortable: false,
        text: 'Fach',
      });
    },
  },
};
</script>
<style>
.course-td {
  padding: 0 0 !important;
}
.course-td-left {
  min-width: 80px;
  text-align: left;
  padding-right: 10px;
}
.course-td-right {
  min-width: 80px;
  text-align: right;
  padding-right: 10px;
}

#courseTable .v-data-table__wrapper {
  height: calc(100vh - 160px) !important;
  padding-bottom: 20px;
}
</style>
