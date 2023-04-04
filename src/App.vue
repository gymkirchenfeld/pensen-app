<template>
  <v-app>
    <v-navigation-drawer permanent app dark>
      <v-list>
        <v-list-item two-line>
          <v-list-item-content>
            <v-list-item-title class="text-h5">Pensenmanager</v-list-item-title>
            <v-list-item-subtitle>{{ versionInfo }}</v-list-item-subtitle>
            <v-list-item-subtitle>{{ accountName }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <AppMenu :menu="menu" :features="features"></AppMenu>
      </v-list>
    </v-navigation-drawer>
    <router-view v-if="authenticated"></router-view>
    <ForbiddenDialog ref="forbidden" />
    <NoConnectionDialog ref="noconnection" />
    <ConfirmDialog ref="confirm" />
    <Notifications ref="notifications" />
  </v-app>
</template>

<script>
import menu from '@/menu.js';
import AppMenu from '@/components/AppMenu.vue';
import ForbiddenDialog from '@/components/ForbiddenDialog.vue';
import NoConnectionDialog from '@/components/NoConnectionDialog.vue';
import ConfirmDialog from '@/components/global/ConfirmDialog.vue';
import Notifications from '@/components/global/Notifications.vue';
import { VERSION } from '@/version.js';

export default {
  name: 'App',
  components: {
    AppMenu,
    ConfirmDialog,
    ForbiddenDialog,
    NoConnectionDialog,
    Notifications,
    //    SchoolYearSelect,
  },
  data() {
    return {
      accountName: null,
      authenticated: false,
      features: [],
      menu: [],
      versionInfo: null,
    };
  },
  watch: {
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
    handleProfileError(response) {
      if (response.status === 403) {
        this.$refs.forbidden.show();
      }
    },
    async setAccount(account) {
      this.authenticated = true;
      this.accountName = account.username;
      const profile = await this.apiList({
        onError: this.handleProfileError,
        resource: 'profile',
      });
      this.features = profile.features || [];
      this.menu = menu;
    },
    setConfiguration(config) {
      this.versionInfo = `Client: v${VERSION} Server: v${config.version}`;
      this.$root.percentDecimals = config.percentDecimals;
    },
  },
  mounted() {
    this.$root.confirm = this.$refs.confirm.open;
    this.$root.noConnection = this.$refs.noconnection.show;
    this.$root.showError = this.$refs.notifications.showError;
    const callback = {
      configurated: this.setConfiguration,
      loggedIn: this.setAccount,
      noConnection: this.$refs.noconnection.show,
    };
    this.$auth.initialize(callback);
  },
};
</script>
