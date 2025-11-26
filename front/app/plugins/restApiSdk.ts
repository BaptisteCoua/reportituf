import { useAuthStore } from "~/store/useAuthStore";
export default defineNuxtPlugin(() => {
  const restApiSdk = useNuxtApp().$restApiSdk;
  const { apiUrl } = useRuntimeConfig().public;
  restApiSdk.setGlobalFetchOptions({
    baseURL: apiUrl + "/api",
    onRequest: async ({ options }) => {
      const { tryRefreshToken } = useAuthStore();
      options.headers.append(
        "Authorization",
        `Bearer ${await tryRefreshToken()}`
      );
    },
  });
});
