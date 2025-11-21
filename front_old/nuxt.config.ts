import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import pkg from "./package.json";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  future: { compatibilityVersion: 4 },
  devtools: { enabled: true },
  css: [
    "vuetify/styles",
    "@mdi/font/css/materialdesignicons.css",
    "~/assets/css/main.css",
  ],
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@pinia/nuxt",
    "@nuxt/test-utils/module",
    "laravel-rest-api-nuxt-sdk",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],
  vite: {
    plugins: [
      vuetify({
        autoImport: true,
      }),
    ],
    vue: {
      template: { transformAssetUrls },
    },
  },
  devServer: { https: true },
  imports: {
    dirs: ["utils/**"],
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost",
      AuthRedirect:
        process.env.NUXT_PUBLIC_AUTH_REDIRECT ||
        "http://localhost/api/azure/auth/redirect",
      home: "/reports",
      version: pkg.version,
    },
  },
  routeRules: {
    "/": {
      redirect: "/reports",
    },
  },
});
