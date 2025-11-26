<template>
  <div class="d-flex flex-column ga-2">
    <div class="d-flex ga-4">
      <strong>{{ comment?.user.name }}</strong>
      <span>{{ new Date(comment.created_at).toLocaleString("fr") }}</span>
    </div>
    <p class="border rounded pa-2">{{ comment?.content }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  comment: {
    type: Object as PropType<IComment>,
    required: true,
  },
});
</script>
