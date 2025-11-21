<template>
  <EditReport v-model:fields="fields" v-model:subjects="subjects" />
</template>

<script setup lang="ts">
import auth from "~/middlewares/auth";

definePageMeta({
  middleware: auth,
});

useHead({
  title: "Nouveau rapport",
});

const fields = ref<Record<string, any>>({});

const subjects = ref<Record<string, any>[]>([{}]);
</script>
