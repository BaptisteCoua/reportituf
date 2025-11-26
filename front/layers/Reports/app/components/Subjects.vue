<template>
  <div class="d-flex flex-column">
    <v-row v-for="subject in subjects" :id="subject.id" :key="subject.id">
      <v-col cols="auto">
        <v-chip :color="colorByPrioritySlug(subject.priority.id)">
          {{ subject?.priority.id }}
        </v-chip>
      </v-col>
      <v-col cols="1">
        <div>
          {{ subject.label }}
        </div>
      </v-col>
      <v-col cols="3">
        <div class="ml-5">
          {{ formatDate(subject.start_at) }}
          <template v-if="subject?.end_at">
            - {{ formatDate(subject.end_at) }}
          </template>
        </div>
      </v-col>
      <v-col>
        <div class="d-flex flex-column ml-2">
          <p>
            <EditorReadonly :content="subject.description" />
          </p>
          <CommentsContainer
            v-if="reportStatusSlug !== 'draft'"
            :commentsInit="subject.comments"
            :subjectId="subject.id"
          />
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
defineProps({
  subjects: Array as PropType<ISubject[]>,
  reportId: Number,
  reportStatusSlug: String,
});

const colorByPrioritySlug = (priorityId: number) => {
  switch (priorityId) {
    case 1:
      return "red";
    case 2:
      return "orange";
    case 3:
      return "green";
    default:
      return "grey";
  }
};
</script>
