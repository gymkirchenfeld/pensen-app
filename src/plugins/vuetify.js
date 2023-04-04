import '@mdi/font/css/materialdesignicons.css';
import '@fontsource/roboto/100.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/roboto/900.css';

import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import colors from 'vuetify/lib/util/colors';
import de from 'vuetify/lib/locale/de';

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    current: 'de',
    locales: { de },
  },
  theme: {
    themes: {
      light: {
        primary: colors.indigo.darken2,
        secondary: colors.indigo.base,
      },
    },
  },
});
