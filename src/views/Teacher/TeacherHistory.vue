<template>
  <EditDialog :width="512" icon="mdi-clock-outline">
    <template v-slot:title>
      {{ teacher.firstName }} {{ teacher.lastName }}
    </template>
    <template>
      <v-timeline align-top dense v-if="teacher.history">
        <v-timeline-item
          v-for="year in teacher.history"
          :key="year.schoolYear.id"
        >
          <v-card>
            <v-card-title>{{ year.schoolYear.description }}</v-card-title>
            <v-card-text>
              <v-list>
                <ListItem icon="mdi-cash-multiple">
                  <template v-slot:title>
                    <PercentValue :value="year.payment1"></PercentValue> /
                    <PercentValue :value="year.payment2"></PercentValue>
                  </template>
                  <template v-slot:subtitle>
                    Auszahlung 1. / 2. Semester</template
                  >
                </ListItem>
                <ListItem icon="mdi-sigma">
                  <template v-slot:title>
                    <PercentValue :value="year.ipbEnd"></PercentValue>
                  </template>
                  <template v-slot:subtitle>IPB-Schlusssaldo</template>
                </ListItem>
              </v-list>
            </v-card-text>
          </v-card>
        </v-timeline-item>
      </v-timeline>
    </template>
    <template v-slot:actions>
      <v-spacer></v-spacer
      ><v-btn text @click="close"><v-icon>mdi-close</v-icon> Schliessen</v-btn>
    </template>
  </EditDialog>
</template>
<script>
import EditDialog from '@/components/EditDialog.vue';
import ListItem from '@/components/ListItem.vue';
import PercentValue from '@/components/PercentValue.vue';
export default {
  props: {
    id: { type: Number, default: -1 },
  },
  components: {
    EditDialog,
    ListItem,
    PercentValue,
  },
  data() {
    return {
      loading: false,
      teacher: {},
    };
  },
  async mounted() {
    this.loading = true;
    this.teacher = await this.apiGet({
      resource: 'teacher',
      id: this.id,
      query: 'detail=history',
    });
    this.loading = false;
  },
  methods: {
    close() {
      this.$router.back();
    },
  },
};
</script>
