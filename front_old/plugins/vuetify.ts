import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import { VDateInput } from "vuetify/labs/VDateInput";
import "@mdi/font/css/materialdesignicons.css";
import { createRulesPlugin } from "vuetify/labs/rules";
import { fr, en } from "vuetify/locale";
export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components: { ...components, VDateInput },
    icons: {
      defaultSet: "mdi",
      aliases,
      sets: { mdi },
    },
    ssr: true,
    theme: {
      defaultTheme: "light",
      themes: {
        light: {
          colors: {
            "xefi-red": "#e10600",
          },
        },
      },
    },
    locale: {
      locale: "fr",
      fallback: "en",
      messages: { fr, en },
    },
  });

  nuxtApp.vueApp.use(vuetify);
  nuxtApp.vueApp.use(createRulesPlugin({}, vuetify.locale));
});
