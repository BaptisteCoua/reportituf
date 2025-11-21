<template>
  <v-form @submit.prevent="handleSubmit" v-model="isValid" class="mt-12">
    <div class="d-flex mb-8">
      <ReportFieldsGlobal v-model="fields" />
      <div class="d-flex align-end ga-3">
        <v-btn
          type="submit"
          @click="draft = true"
          variant="outlined"
          color="warning"
        >
          Enregistrer
        </v-btn>
        <v-btn
          variant="tonal"
          @click="draft = false"
          type="submit"
          color="blue"
        >
          Publier
        </v-btn>
      </div>
    </div>
    <div class="d-flex flex-column mb-2 ga-6">
      <FieldsSubjects
        v-for="(_, index) in subjects"
        :key="index"
        @remove="handleRemove(index)"
        v-model="subjects[index]"
      />
    </div>
    <v-btn variant="plain" @click="subjects.push({})" class="mt-1">
      <template #prepend>
        <v-icon color="xefi-red"> mdi-plus </v-icon>
      </template>
      Ajouter un sujet
    </v-btn>
  </v-form>
</template>

<script setup lang="ts">
import toast from "vue3-hot-toast";
import { useReportsService } from "~/services/reportsService";
import useSubjectService from "~/services/useSubjectService";
import type { IReport } from "~/shared/types/IReport";

const props = defineProps({
  report: {
    type: Object as PropType<IReport>,
    default: null,
  },
});
const isValid = ref<boolean>(false);

const fields = defineModel<Record<string, any>>("fields");
const subjects = defineModel<Record<string, any>[]>("subjects");

const draft = ref<boolean>(false);
const isEdit = ref<boolean>(!!props.report);
const emits = defineEmits(["saved"]);

const handleSubmit = async () => {
  if (!isValid.value || !fields.value || !subjects.value) return;
  const reportRes = await useReportsService().updateOrCreate(
    isEdit.value,
    fields.value.title,
    fields.value.team,
    props?.report,
    draft.value,
    fields.value.sharedDiff
  );
  const subjectRes = await useSubjectService().updateOrCreate(
    isEdit.value,
    reportRes.created?.[0] || props.report.id,
    subjects.value
  );

  const allIds = [...(subjectRes.updated || []), ...(subjectRes.created || [])];

  allIds.forEach((id, i) => {
    if (subjects.value?.[i]) subjects.value[i].id = id;
  });

  toast.success(
    `Le rapport a été ${fields.value.title} ${
      isEdit.value ? "mis à jour" : "créé"
    } ${draft.value ? "en brouillon" : "et publié"} avec succès !`
  );

  if (!draft.value)
    await navigateTo("/reports/" + (reportRes.created?.[0] || props.report.id));
  else
    await navigateTo(
      `/reports/${reportRes.created?.[0] || props.report.id}/edit`
    );

  window.dispatchEvent(new CustomEvent("sharedUsers-resetDirty"));
};

const handleRemove = async (index: number) => {
  if (!subjects.value?.[index]) return;
  if (subjects.value[index]?.id) {
    const res = await useSubjects().remove([subjects.value[index].id]);
    toast.error("Sujet supprimé avec succès.");
    if (res.data?.[0]) {
      subjects.value = subjects.value.filter((_, i) => i !== index);
    }
  } else {
    subjects.value = subjects.value.filter((_, i) => i !== index);
  }
};
</script>
