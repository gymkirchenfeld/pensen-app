<template>
  <span>
    <v-list nav dense v-for="group in menugroups" :key="group.title">
      <v-list-group v-model="group.visible" :color="group.color">
        <template v-slot:activator>
          <v-list-item-title
            ><span :class="group.color + '--text'">{{
              group.title
            }}</span></v-list-item-title
          >
        </template>

        <v-list-item
          v-for="item in filteredItems(group)"
          :key="item.link"
          link
          :to="{ name: item.link }"
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action v-if="item.dev">
            <v-icon small>mdi-bug</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list-group>
    </v-list>
  </span>
</template>
<script>
export default {
  props: {
    features: {
      type: Array,
    },
    menu: { type: Array },
  },
  data() {
    return {
      menugroups: [],
    };
  },
  watch: {
    menu() {
      this.menugroups = this.menu;
      this.menugroups.forEach((group) => {
        group.visible = localStorage.getItem('menuGroup' + group.title);
      });
    },
    menugroups: {
      deep: true,
      handler() {
        this.menugroups.forEach((group) => {
          if (group.visible) {
            localStorage.setItem('menuGroup' + group.title, 'true');
          } else {
            localStorage.removeItem('menuGroup' + group.title);
          }
        });
      },
    },
  },
  methods: {
    filteredItems(group) {
      return group.items.filter((item) => {
        return !item.feature || this.features.indexOf(item.feature) !== -1;
      });
    },
  },
};
</script>
