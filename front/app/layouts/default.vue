<script setup lang="ts">
const navItems = [
  { title: 'Home', to: '/', icon: 'mdi-home' },
  { title: 'Users', to: '/users', icon: 'mdi-account-group' },
  { title: 'Products', to: '/products', icon: 'mdi-package-variant-closed' }
]
</script>

<template>
  <v-app-bar color="primary" density="compact">
    <v-app-bar-title>DDD Demo</v-app-bar-title>
    <template #append>
      <v-btn
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :prepend-icon="item.icon"
        variant="text"
      >
        {{ item.title }}
      </v-btn>
    </template>
  </v-app-bar>
  <v-main>
    <slot />
  </v-main>
</template>
