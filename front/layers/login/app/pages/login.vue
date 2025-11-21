<template>
  <v-form>
    <v-text-field
      label="Email"
      v-model="fields.email.value"
      :error-messages="fields.email.error"
    ></v-text-field>
    <v-text-field
      label="Password"
      v-model="fields.password.value"
      type="password"
    ></v-text-field>
    <v-btn @click="submit">Login</v-btn>
  </v-form>
</template>
<script setup lang="ts">
import useLoginForm from "../composables/forms/useLoginForm";

const { fields, submit } = useLoginForm();
</script>
