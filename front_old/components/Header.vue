<template>
  <header
    class="navbar d-flex justify-space-between align-center elevation-2 bg-white py-0 px-5"
  >
    <div class="navbar-left">
      <div class="logo">
        <NuxtLink :to="home">
          <Version />
          <img src="/images/reportitup.svg" alt="logo" class="logo" />
        </NuxtLink>
      </div>
    </div>

    <div class="d-flex align-center ga-5">
      <v-btn variant="flat" color="xefi-red" class="mt-1" to="/reports/new">
        Créer un rapport
      </v-btn>
      <NotificationMenu />

      <v-icon
        color="grey-darken-1"
        size="25"
        class="cursor-pointer"
        @click="logout"
      >
        mdi-logout
      </v-icon>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from "~/store/useAuthStore";
import { useCurrentUser } from "~/store/useCurrentUser";

const AuthStore = useAuthStore();
const { initUser } = useCurrentUser();
const { home } = useRuntimeConfig().public;
await initUser();

const logout = async () => {
  await AuthStore.logout();
  return navigateTo("/login");
};
</script>

<style scoped>
.navbar {
  height: 80px;
}

.logo {
  height: 30px;
}
</style>
