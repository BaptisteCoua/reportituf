<template>
  <div class="d-flex flex-column ga-3 pa-2 border">
    <div class="d-flex ga-3">
      <v-btn-toggle
        :model-value="activeformatButtonsIndexes"
        variant="outlined"
        divided
        multiple
      >
        <v-btn
          v-for="button in formatButtons"
          :key="button.icon"
          @click="chainFocus(button.command)"
          density="compact"
          color="primary"
          :disabled="isDisabled(button.command)"
        >
          <v-icon :icon="button.icon" />
        </v-btn>
      </v-btn-toggle>

      <v-btn-toggle
        :model-value="activelistButtonsIndexes"
        variant="outlined"
        divided
      >
        <v-btn
          v-for="button in listButtons"
          :key="button.icon"
          @click="chainFocus(button.command)"
          density="compact"
          color="primary"
          :disabled="isDisabled(button.command)"
        >
          <v-icon :icon="button.icon" />
        </v-btn>
      </v-btn-toggle>
    </div>
    <editor-content class="editor border" :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { Editor, EditorContent } from "@tiptap/vue-3";
import Highlight from "@tiptap/extension-highlight";
import { StarterKit } from "@tiptap/starter-kit";
import type { Editor as TiptapEditor } from "@tiptap/core";

const props = defineProps({
  placeholder: {
    type: String,
    default: "Écrire ici...",
  },
});

const editor = ref<TiptapEditor | null>(null);

const chainFocus = computed(() => (command: string, arg?: any) => {
  if (!editor.value) return;
  (editor.value.chain().focus() as any)[command](arg).run();
});

const isDisabled = computed(() => (command: string) => {
  if (!editor.value) return true;
  return !(editor.value.can().chain().focus() as any)[command]().run();
});

const isActive = computed(() => (command: string) => {
  if (!editor.value) return false;
  return editor.value.isActive(command);
});

const formatButtons = computed(() => {
  return [
    {
      icon: "mdi-format-bold",
      command: "toggleBold",
      isActive: isActive.value("bold"),
    },
    {
      icon: "mdi-format-italic",
      command: "toggleItalic",
      isActive: isActive.value("italic"),
    },
    {
      icon: "mdi-format-underline",
      command: "toggleUnderline",
      isActive: isActive.value("underline"),
    },
    {
      icon: "mdi-marker",
      command: "toggleHighlight",
      isActive: isActive.value("highlight"),
    },
  ];
});

const listButtons = computed(() => {
  return [
    {
      icon: "mdi-format-list-numbered",
      command: "toggleOrderedList",
      isActive: isActive.value("orderedList"),
    },
    {
      icon: "mdi-format-list-bulleted",
      command: "toggleBulletList",
      isActive: isActive.value("bulletList"),
    },
  ];
});

const activeformatButtonsIndexes = computed(() => {
  return formatButtons.value.flatMap(({ isActive }, index) =>
    isActive ? index : []
  );
});

const activelistButtonsIndexes = computed(() => {
  return listButtons.value.flatMap(({ isActive }, index) =>
    isActive ? index : []
  );
});

const modelValue = defineModel<string | null>({
  default: () => b64encode(JSON.stringify("")),
});

onMounted(() => {
  editor.value = new Editor({
    content: JSON.parse(b64decode(modelValue.value ?? "")),
    extensions: [StarterKit, Highlight],
    onUpdate: () => {
      modelValue.value =
        b64encode(JSON.stringify(editor.value?.getJSON())) || null;
    },
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>

<style scoped>
.editor {
  &:deep(.tiptap) {
    padding: 12px;

    :first-child {
      margin-top: 0;
    }

    ul,
    ol {
      padding: 0 1rem;
      margin: 1.25rem 1rem 1.25rem 0.4rem;

      li p {
        margin-top: 0.25em;
        margin-bottom: 0.25em;
      }
    }
  }
}
</style>
