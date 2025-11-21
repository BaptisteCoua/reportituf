<template>
  <v-text-field
    v-if="isEditing"
    v-model="text"
    density="compact"
    variant="outlined"
    placeholder="Add a comment"
    hide-details
    @keyup.enter.prevent="createComment"
  >
    <template #append-inner>
      <v-icon
        :color="isSendHovered ? 'success' : 'grey'"
        @mouseover="isSendHovered = true"
        @mouseleave="isSendHovered = false"
        class="cursor-pointer"
        @click="createComment"
      >
        {{ isSendHovered ? "mdi-send-variant" : "mdi-send-variant-outline" }}
      </v-icon>
    </template>
    <template #append>
      <v-icon color="error" @click="isEditing = false">mdi-cancel</v-icon>
    </template>
  </v-text-field>
  <div v-else>
    <v-btn variant="plain" @click="isEditing = true" class="mt-1">
      <template #prepend>
        <v-icon color="xefi-red"> mdi-plus </v-icon>
      </template>
      Ajouter un commentaire
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import commentService from "~/services/commentService";
import { useCurrentUser } from "~/store/useCurrentUser";

const { user } = useCurrentUser();

const props = defineProps({
  subjectId: { type: Number, required: true },
});

const isEditing = ref<boolean>(false);
const isSendHovered = ref<boolean>(false);
const text = ref<string>("");

const emits = defineEmits(["commentAdded"]);

const createComment = async () => {
  if (!user) throw new Error("User not logged in");
  const created = await commentService().create(
    text.value,
    props.subjectId,
    user.id
  );
  if (!created) throw new Error("Failed to create comment");
  text.value = "";
  isEditing.value = false;
  const commentsResource = await commentService().searchById(created);
  emits("commentAdded", commentsResource);
};
</script>
