<template>
  <v-infinite-scroll
    ref="infiniteScroll"
    height="calc(100vh - 200px)"
    class="mt-4 px-1 darker"
    @load="loadMore"
    mode="manual"
    loadMoreText="Voir plus"
    emptyText="Aucun rapport supplémentaire"
  >
    <v-expansion-panels variant="accordion" @update:modelValue="delayedGoTo">
      <v-expansion-panel
        v-for="(report, i) in reportsData ?? []"
        :key="report.id"
      >
        <template #title>
          <ReportPanelTitle :report="report" :id="'report-' + i" />
        </template>
        <template #text>
          <Subjects
            :subjects="report?.subjects"
            :reportId="report.id"
            :reportStatusSlug="report.status.slug"
          />
        </template>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-infinite-scroll>
</template>

<script setup lang="ts">
import type {
  ISearchQuery,
  ISearchResponse,
} from "laravel-rest-api-nuxt-sdk/types/search";
import ReportPanelTitle from "../components/ReportPanelTitle.vue";
import Subjects from "./Subjects.vue";
import { useReportsService } from "~/services/reportsService";
import { useGoTo } from "vuetify";
import { debounce } from "vuetify/lib/util/helpers.mjs";

const reportsService = useReportsService();
const infiniteScroll = ref();
const isEnd = ref<boolean>(false);
const currentPage = ref<number>(0);
const reportsRes = ref<ISearchResponse<IReport> | null>(null);
const reportsData = ref<IReport[]>([]);

const goTo = useGoTo();

const props = defineProps({
  additionalSearchParams: {
    type: Object as PropType<Partial<ISearchQuery<IReport>>>,
    default: {},
  },
});

const loadReports = async (append = false) => {
  if (!append) {
    infiniteScroll.value?.reset();
    currentPage.value = 0;
    reportsData.value = [];
  }
  reportsRes.value = await reportsService.search({
    ...props.additionalSearchParams,
    page: currentPage.value + 1,
  });

  reportsData.value = [
    ...(reportsData.value ?? []),
    ...(reportsRes.value?.data ?? []),
  ];

  isEnd.value = reportsRes.value?.last_page <= reportsRes.value?.current_page;
  currentPage.value = reportsRes.value?.current_page ?? 0;
};

const loadMore = async ({
  done,
}: {
  done: (status: "error" | "loading" | "empty" | "ok") => void;
}) => {
  done("loading");
  try {
    await loadReports(true);
    if (isEnd.value) {
      done("empty");
    } else {
      done("ok");
    }
  } catch (error) {
    done("error");
  }
};
await loadReports();

watch(
  () => props.additionalSearchParams,
  async () => {
    await loadReports(false);
  },
  { deep: true }
);

const delayedGoTo = debounce((id: string) => {
  goTo(`#report-${id}`, { container: ".darker", offset: -5 });
}, 300);
</script>

<style scoped>
:deep(.v-expansion-panel-title__overlay) {
  opacity: 0 !important;
}
:deep(.v-expansion-panel) {
  opacity: 1;
  transition: all 0.3s ease;
  &::after {
    display: block;
    content: "";
    position: absolute;
    pointer-events: none;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgb(1, 29, 71) !important ;
    opacity: 0 !important;
    transition: all 0.3s ease;
    z-index: 10 !important;
    backdrop-filter: blur(40px) !important;
  }
}

:deep(.v-expansion-panels):has(.v-expansion-panel--active)
  .v-expansion-panel:not(.v-expansion-panel--active):not(:hover) {
  opacity: 0.3;
  &::after {
    opacity: 0.15 !important;
  }
}
:deep(.list-move) {
  transition: all 0.3s ease;
}
</style>
