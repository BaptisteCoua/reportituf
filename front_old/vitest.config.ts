// vitest.config.ts
import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    testTimeout: 10000,
    environment: "nuxt",
    testTimeout: 10000,
    environmentOptions: {
      nuxt: {
        domEnvironment: "happy-dom",
        overrides: {
          runtimeConfig: {
            public: {
              apiUrl: process.env.NUXT_PUBLIC_API_URL || "http://localhost",
            },
          },
        },
      },
    },
  },
});
