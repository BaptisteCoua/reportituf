// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { createRulesPlugin } from "vuetify/labs/rules";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({});

  app.vueApp.use(vuetify);
  app.vueApp.use(
    createRulesPlugin(
      {
        /* options */
      },
      vuetify.locale
    )
  );
});
