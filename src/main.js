import App from '@/App.vue';
import Vue from 'vue';
import router from '@/router/';
import vuetify from '@/plugins/vuetify.js';
import vueauth from '@/plugins/vueauth.js';
import vueapi from '@/plugins/vueapi.js';

Vue.config.productionTip = false;

Vue.use(vueapi);
Vue.use(vueauth);

export const app = new Vue({
  vuetify,
  router,
  render(h) {
    return h(App);
  },
});
app.$mount('#app');
