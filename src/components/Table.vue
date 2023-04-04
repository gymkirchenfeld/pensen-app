<template>
  <v-data-table
    dense
    disable-pagination
    fixed-header
    hide-default-footer
    :items-per-page="-1"
    :loading="loading"
    :headers="headers"
    :items="items"
    :sortBy="sortBy"
    id="fixedTable"
  >
    <template v-slot:item.info="{ item }">
      <StatusIcon
        icon="mdi-archive"
        label="archiviert"
        v-model="item.archived"
      ></StatusIcon>
    </template>
    <template v-slot:item="params">
      <tr @click="onClick(params.item)" :class="getRowClass(params)">
        <td
          :key="i"
          v-for="(col, i) in params.headers"
          :class="alignClass(col.align)"
        >
          <template v-if="col.type === 'comment'">
            <StatusIcon
              v-if="getValue(params, col)"
              icon="mdi-comment-outline"
              :label="getValue(params, col)"
            ></StatusIcon>
          </template>
          <DateValue
            v-else-if="col.type === 'date'"
            :value="getValue(params, col)"
          ></DateValue>
          <StatusIcon
            v-else-if="col.type === 'icon'"
            :icon="col.icon"
            :label="col.iconTooltip"
            :value="getValue(params, col)"
          ></StatusIcon>
          <LessonValue
            v-else-if="col.type === 'lesson'"
            :value="getValue(params, col)"
          ></LessonValue>
          <LookupValue
            v-else-if="col.type === 'lookup'"
            :short="col.short"
            :value="getValue(params, col)"
          ></LookupValue>
          <SemesterValue
            v-else-if="col.type === 'percent'"
            type="percent"
            :value="getValue(params, col)"
          />
          <TeacherValue
            v-else-if="col.type === 'teacher'"
            :value="getValue(params, col)"
          />
          <span v-else>{{ getValue(params, col) }}</span>
        </td>
      </tr>
    </template>
  </v-data-table>
</template>
<script>
import DateValue from '@/components/DateValue.vue';
import LessonValue from '@/components/LessonValue.vue';
import LookupValue from '@/components/LookupValue.vue';
import SemesterValue from '@/components/SemesterValue.vue';
import StatusIcon from '@/components/StatusIcon.vue';
import TeacherValue from '@/components/TeacherValue.vue';

export default {
  components: {
    DateValue,
    LessonValue,
    LookupValue,
    SemesterValue,
    StatusIcon,
    TeacherValue,
  },
  props: {
    headers: { type: Array },
    items: { type: Array },
    loading: { type: Boolean, default: false },
    rowClass: { type: Function },
    sortBy: {},
  },
  methods: {
    alignClass(align) {
      if (align === 'right') {
        return 'text-right';
      }
    },
    getRowClass(params) {
      return this.rowClass ? this.rowClass(params.item) : '';
    },
    getValue(params, col) {
      let value = params.item;
      const names = col.value.split('.');
      for (let i = 0; i < names.length; ++i) {
        value = value[names[i]];
      }
      return value;
    },
    onClick(item) {
      this.$emit('click', item);
    },
  },
};
</script>
<style>
#fixedTable .v-data-table__wrapper {
  height: calc(100vh - 160px) !important;
}
</style>
