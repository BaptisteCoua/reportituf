import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  extends: [
    "./layers/users",
    "./layers/products",
    "./layers/user-poo",
    "./layers/user-define",
    "./layers/events"
  ],
  css: ["~/assets/css/global.css"],
  build: {
    transpile: ["vuetify"],
  },
  modules: [
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
