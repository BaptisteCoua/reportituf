import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  extends: [
    "./layers/users",
    "./layers/products",
    "./layers/user-poo",
    "./layers/user-define"
  ],
  css: ["~/assets/css/global.css"],
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "form-xefi",
    "~/modules/dateTimePicker/module.ts",
    "~/modules/datatable/module.ts"
  ],
  vite: {
    plugins: [
      // @ts-expect-error
      vuetify({ autoImport: true }),
    ],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
});
