<template>
  <v-card
    class="logincard pa-15 d-flex flex-column align-center border-sm rounded-lg mb-5"
  >
    <v-img src="/images/xefi.svg" class="xefi-logo" />
    <div class="gradient-line my-5 h-1 rounded-sm"></div>

    <v-btn
      class="login-button d-flex align-center justify-center font-weight-bold min-width-280px ga-4 grey-lighten-1 pointer ps-3 border-sm"
      elevation="2"
      variant="outlined"
      :href="AuthRedirect"
      :loading="isLoading"
      :disabled="isLoading"
    >
      <v-img src="/images/microsoft.svg" class="ms-logo mr-4" />
      Se connecter avec Microsoft
    </v-btn>

    <p v-if="errorMsg" class="text-error mt-4">{{ errorMsg }}</p>
  </v-card>
</template>

<script setup lang="ts">
import { useCurrentUser } from "~/store/useCurrentUser";
import { useAuthStore } from "~/store/useAuthStore";

type PublicRuntime = {
  public: { AuthRedirect?: string; apiUrl?: string };
};

const config = useRuntimeConfig() as PublicRuntime;
const { home } = useRuntimeConfig().public;

const authStore = useAuthStore();
const currentUser = useCurrentUser();
const route = useRoute();

const isLoading = ref<boolean>(false);
const errorMsg = ref<string>("");

const AuthRedirect = computed(() => config.public.AuthRedirect ?? "");
function extractErrorMessage(err: unknown): string {
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const e = err as { message?: string; data?: { message?: string } };
    return (
      e.data?.message ??
      e.message ??
      "Échec de la connexion. Veuillez réessayer."
    );
  }
  return "Échec de la connexion. Veuillez réessayer.";
}

onMounted(async () => {
  const code = route.query.code as string | undefined;
  if (!code || isLoading.value) return;

  isLoading.value = true;
  errorMsg.value = "";

  try {
    await authStore.login(code);
    await currentUser.initUser();
    await navigateTo(home, { replace: true });
  } catch (err: unknown) {
    errorMsg.value = extractErrorMessage(err);
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped>
.logincard {
  width: 563px;
  height: auto;
}
.xefi-logo {
  width: 241px;
  height: auto;
}
.gradient-line {
  width: 80%;
  background: linear-gradient(to right, #f97316, #22c55e, #3b82f6, #facc15);
}
.login-button {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.login-button:hover {
  background-color: #f3f4f6;
}
.ms-logo {
  width: 24px;
  height: 24px;
}
.text-error {
  color: #ef4444;
}
</style>
