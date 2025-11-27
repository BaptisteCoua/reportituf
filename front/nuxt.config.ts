import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  experimental: {
    sharedPrerenderData: true,
    viewTransition: true,
  },

  devtools: { enabled: true },

  ssr: true,

  css: ["~/assets/css/global.css", "@mdi/font/css/materialdesignicons.css"],

  devServer: {
    host: "0.0.0.0",
    port: 3000,
  },

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    plugins: [vuetify({ autoImport: true })],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    server: {
      watch: {
        usePolling: true,
      },
      hmr: {
        protocol: "ws",
        host: "localhost",
        port: 24680,
      },
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
    shim: false,
  },

  modules: ["@pinia/nuxt"],

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:8000/api",
    },
  },

  compatibilityDate: "2025-01-15",
});
