<template>
  <v-form
    v-model="isValid"
    @submit.prevent="handleSubmit"
  >
    <v-card flat border class="pa-6 mb-4">
      <v-card-title class="text-h5 mb-4">
        {{ isEdit ? 'Modifier le rapport' : 'Nouveau rapport' }}
      </v-card-title>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="formData.title"
            label="Titre du rapport *"
            :rules="[rules.required]"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="formData.team"
            label="Équipe *"
            :items="teamOptions"
            item-title="name"
            item-value="id"
            :rules="[rules.required]"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12">
          <v-select
            v-model="formData.shared"
            label="Partager avec"
            :items="userOptions"
            item-title="name"
            item-value="id"
            multiple
            chips
            variant="outlined"
          />
        </v-col>
      </v-row>
    </v-card>

    <v-card
      v-for="(subject, index) in formData.subjects"
      :key="index"
      flat
      border
      class="pa-6 mb-4"
    >
      <div class="d-flex justify-space-between align-center mb-4">
        <v-card-title class="text-h6">
          Sujet {{ index + 1 }}
        </v-card-title>
        <v-btn
          v-if="formData.subjects.length > 1"
          @click="removeSubject(index)"
          icon
          variant="text"
          color="error"
          size="small"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="subject.label"
            label="Libellé *"
            :rules="[rules.required]"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="subject.priority"
            label="Priorité *"
            :items="priorityOptions"
            item-title="name"
            item-value="id"
            :rules="[rules.required]"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="subject.start_at"
            label="Date de début *"
            type="date"
            :rules="[rules.required]"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="subject.end_at"
            label="Date de fin *"
            type="date"
            :rules="[rules.required]"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="subject.stakeholder"
            label="Intervenant"
            variant="outlined"
          />
        </v-col>

        <v-col cols="12">
          <v-textarea
            v-model="subject.description"
            label="Description *"
            :rules="[rules.required]"
            rows="3"
            variant="outlined"
          />
        </v-col>
      </v-row>
    </v-card>

    <v-btn
      @click="addSubject"
      variant="text"
      color="primary"
      class="mb-4"
    >
      <v-icon start>mdi-plus</v-icon>
      Ajouter un sujet
    </v-btn>

    <v-card flat border class="pa-4">
      <div class="d-flex justify-end ga-3">
        <v-btn
          @click="handleCancel"
          variant="outlined"
        >
          Annuler
        </v-btn>
        <v-btn
          type="submit"
          @click="isDraft = true"
          variant="outlined"
          color="warning"
        >
          Enregistrer en brouillon
        </v-btn>
        <v-btn
          type="submit"
          @click="isDraft = false"
          variant="flat"
          color="primary"
        >
          Publier
        </v-btn>
      </div>
    </v-card>
  </v-form>
</template>

<script setup lang="ts">
import type { ReportFormData, SubjectFormData } from '../../types'

const props = defineProps<{
  initialData?: Partial<ReportFormData>
  reportId?: number
}>()

const emit = defineEmits<{
  submit: [data: ReportFormData, isDraft: boolean]
  cancel: []
}>()

const isValid = ref(false)
const isDraft = ref(false)
const isEdit = computed(() => !!props.reportId)

const formData = ref<ReportFormData>({
  title: props.initialData?.title || '',
  team: props.initialData?.team || 0,
  shared: props.initialData?.shared || [],
  subjects: props.initialData?.subjects || [createEmptySubject()],
})

const teamOptions = ref([
  { id: 1, name: 'Équipe A' },
  { id: 2, name: 'Équipe B' },
])

const userOptions = ref([
  { id: 1, name: 'User 1' },
  { id: 2, name: 'User 2' },
])

const priorityOptions = ref([
  { id: 1, name: 'Basse' },
  { id: 2, name: 'Moyenne' },
  { id: 3, name: 'Haute' },
])

const rules = {
  required: (v: any) => !!v || 'Ce champ est requis',
}

function createEmptySubject(): SubjectFormData {
  return {
    label: '',
    priority: 0,
    stakeholder: '',
    description: '',
    start_at: '',
    end_at: '',
  }
}

function addSubject() {
  formData.value.subjects.push(createEmptySubject())
}

function removeSubject(index: number) {
  formData.value.subjects.splice(index, 1)
}

function handleSubmit() {
  if (!isValid.value)
    return

  emit('submit', formData.value, isDraft.value)
}

function handleCancel() {
  emit('cancel')
}
</script>
