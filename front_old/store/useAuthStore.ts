import { useCurrentUser } from "./useCurrentUser";

export const useAuthStore = defineStore("auth", () => {
  const { apiUrl } = useRuntimeConfig().public;
  const isRefreshing = ref<boolean>(false);
  const refreshPromise = ref<Promise<any> | null>(null);
  const token = useCookie("access_token", {
    maxAge: 60 * 60 * 24 * 30,
  });

  const TIME_OFFSET_MS = 40 * 1000;

  const expires_at = useCookie("expires_at", {
    maxAge: 60 * 60 * 24 * 30,
  });

  const isAuthenticated = () => !!token.value;

  const setToken = (newToken: string, expires_in: number) => {
    token.value = newToken;
    expires_at.value = `${new Date(
      Date.now() + expires_in * 1000 - TIME_OFFSET_MS
    ).getTime()}`;
  };

  const clearAuth = () => {
    token.value = null;
    expires_at.value = null;
  };

  const logout = async () => {
    try {
      if (isAuthenticated()) {
        await $fetch(apiUrl + "/api/logout", {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${await tryRefreshToken()}`,
          },
        });
        clearAuth();
        window.location.href = "/";
      }
    } catch (error) {
      clearAuth();
    }
  };

  const login = async (code: string) => {
    const res = await $fetch<{
      access_token: string;
      expires_in: number;
    }>(`${apiUrl}/api/azure/auth/login?code=${code}`);

    setToken(res.access_token, res.expires_in);

    const url = new URL(window.location.href);

    url.searchParams.delete("code");
    url.searchParams.delete("session_state");
    window.history.replaceState({}, "", url.toString());

    const userStore = useCurrentUser();
    await userStore.initUser();
  };

  const tryRefreshToken = async () => {
    if (expires_at.value && parseInt(expires_at.value) < Date.now()) {
      if (!isRefreshing.value) {
        isRefreshing.value = true;
        refreshPromise.value = $fetch<{
          access_token: string;
          expires_in: number;
        }>(apiUrl + "/api/auth/refresh", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token.value}`,
            Accept: "application/json",
          },
        })
          .then((response: { access_token: string; expires_in: number }) => {
            setToken(response.access_token, response.expires_in);
            isRefreshing.value = false;
            return response.access_token;
          })
          .catch((error) => {
            isRefreshing.value = false;
            logout();
            throw error;
          });
      }
      if (refreshPromise.value) return await refreshPromise.value;
      throw new Error("Token refresh in progress");
    }
    return token.value;
  };

  return {
    token,
    expires_at,
    login,
    tryRefreshToken,
    isAuthenticated,
    setToken,
    logout,
    clearAuth,
  };
});
