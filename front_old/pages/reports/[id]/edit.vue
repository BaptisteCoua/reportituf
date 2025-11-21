<template>
  <EditReport
    :report="report"
    v-model:fields="fields"
    v-model:subjects="subjects"
  />
</template>

<script setup lang="ts">
import auth from "~/middlewares/auth";

const { report } = await usePageReport();

definePageMeta({
  middleware: auth,
});

useHead({
  title: `Rapport #${report.id} - Édition`,
});

if (report.status?.slug !== "draft") {
  throw createError({
    statusCode: 403,
    statusMessage: "Le rapport est publié et ne peut plus être modifié.",
  });
}

const fields = ref<Record<string, any>>({
  title: report.title,
  team: report.team.id,
  shared: report.users.map((user: any) => user.id),
});

const allDaysBetween = (startDate: string, endDate: string) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    dates.push(toIsoStringWithTimezone(currentDate).split("T")[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

const subjects = ref<Record<string, any>[]>(
  report.subjects.map((subject: any) => ({
    id: subject.id,
    label: subject.label,
    priority: subject.priority.id,
    stakeholder: subject.stakeholder,
    description: subject.description,
    start_at: subject.start_at,
    end_at: subject.end_at,
    dates:
      subject.start_at && subject.end_at
        ? allDaysBetween(subject.start_at, subject.end_at)
        : subject.start_at
        ? [toIsoStringWithTimezone(new Date(subject.start_at)).split("T")[0]]
        : [],
  }))
);
</script>
