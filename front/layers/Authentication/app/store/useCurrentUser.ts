import { defineStore } from "pinia";
import { useAuthStore } from "~/store/useAuthStore";

export const useCurrentUser = defineStore("user", () => {
  const config = useRuntimeConfig();
  const user = ref<IUser | null>(null);

  const initUser = async () => {
    const token = await useAuthStore().tryRefreshToken();

    const res = await $fetch<any>(config.public.apiUrl + "/api/me", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    }).catch((err) => {
      console.error("Error fetching current user:", err);
    });
    user.value = res;
    return res;
  };

  return {
    user,
    initUser,
  };
});
