<template>
  <editor-content class="editor" :editor="editor" />
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
  content: {
    type: Object,
    default: null,
  },
});

const editor = ref<TiptapEditor | null>(null);

onMounted(() => {
  editor.value = new Editor({
    content: props.content ? JSON.parse(b64decode(props.content)) : null,
    extensions: [StarterKit, Highlight],
    editable: false,
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
