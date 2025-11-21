<template>
  <div class="d-flex flex-column ga-5 mt-2">
    <div class="d-flex flex-column ga-3">
      <Comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      />
    </div>
    <NewComment :subjectId="props.subjectId" @commentAdded="addComment" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  commentsInit: { type: Array as PropType<IComment[]>, required: true },
  subjectId: Number,
});
const comments = ref<IComment[]>(props.commentsInit);

const addComment = (comment: IComment) => {
  comments.value = [...comments.value, comment];
};
</script>
