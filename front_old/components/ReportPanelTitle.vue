<template>
  <v-row class="d-flex align-center">
    <v-col cols="1">
      <h4>{{ report.team?.name }}</h4>
    </v-col>
    <v-col cols="2">
      <h4>{{ report.title }}</h4>
    </v-col>
    <v-col cols="4">
      <p>
        Créé le
        {{ new Date(report.created_at).toLocaleDateString("fr") }} par
        {{ report.creator?.name }}
      </p>
    </v-col>
    <v-col cols="2" class="d-flex flex-column ga-2">
      <p v-if="report.users && usersWhoNotRead.length > 0">
        Partagé à:
        <ItemsLimit
          :limit="1"
          :items="usersWhoNotRead"
          item-title="name"
          location="top"
          min-width="200"
        >
          <template #default="{ props, item }">
            <v-chip
              :color="numberToColor(item.id)"
              v-bind="props"
              :text="item.name"
              density="compact"
            />
          </template>
          <template #remaining-item="{ props, item }">
            <div class="bg-white rounded-pill w-fit-content">
              <v-chip
                :color="numberToColor(item.id)"
                v-bind="props"
                :text="item.name"
              />
            </div>
          </template>
        </ItemsLimit>
      </p>
      <div cols="1" v-if="usersWhoRead.length > 0">
        Lu par:
        <ItemsLimit
          :limit="1"
          :items="usersWhoRead"
          item-title="name"
          location="top"
          min-width="200"
        />
      </div>
    </v-col>
    <v-col cols="2" v-if="report.status.name" class="d-flex justify-center">
      <ReportStatus :report="report" />
    </v-col>
    <v-col cols="1" v-if="!isReportPage">
      <v-btn
        v-if="report.status.slug === 'draft'"
        density="compact"
        variant="plain"
        icon="mdi-file-document-edit-outline"
        :to="`/reports/${report.id}/edit`"
        @click.stop
      />
      <v-btn
        v-else
        density="compact"
        variant="plain"
        icon="mdi-file-document-outline"
        :to="`/reports/${report.id}`"
        @click.stop
      />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import ReportStatus from "./ReportStatus.vue";
import ItemsLimit from "./ItemsLimit.vue";
const isReportPage = !!useRoute().params?.id;

const props = defineProps({
  report: { type: Object as PropType<IReport>, required: true },
});

const usersWhoRead = computed(() => {
  if (!props.report.users) return [];
  return props.report.users.filter((user) => user.pivot.is_opened);
});

const usersWhoNotRead = computed(() => {
  if (!props.report.users) return [];
  return props.report.users.filter((user) => !user.pivot.is_opened);
});
</script>
