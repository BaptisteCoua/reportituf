<template>
  <div class="border-bottom pb-1">
    <div class="d-flex justify-space-between align-end">
      <div class="d-flex align-center">
        <v-avatar
          class="d-flex align-center justify-center rounded-circle font-weight-bold text-subtitle-1 mb-2"
          :color="avatarColor"
        >
          {{ initials }}
        </v-avatar>
        <div>
          <div class="font-weight-bold ml-2">
            {{ notification.data.user_name }}
          </div>
          <div class="text-grey-lighten-1 font-weight-regular ml-2">
            {{ formatDate(notification.created_at) }}
          </div>
        </div>
      </div>
      <div>
        <v-btn
          icon
          variant="text"
          size="small"
          class="bg-transparent rounded-circle"
          @click="navigateToLink"
        >
          <v-icon color="grey">mdi-eye</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="text"
          size="small"
          class="bg-transparent rounded-circle"
          @click="markAsRead"
        >
          <v-icon color="grey">mdi-check</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="text-body-2 font-weight-medium mt-1 justify-space-between">
      <span>{{ notification.data.text }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import notificationService from "~/services/notificationService";

const props = defineProps({
  notification: {
    type: Object as PropType<INotification>,
    required: true,
  },
});
const emits = defineEmits(["notificationRead"]);

const initials = computed(() =>
  props.notification.data.user_name
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
);

const avatarColor = computed(() =>
  numberToColor(props.notification.data.user_id)
);

const markAsRead = async () => {
  await notificationService().markAsRead(props.notification.id);
  emits("notificationRead", props.notification.id);
};

const link = computed(() => {
  if (props.notification.data.model_type.endsWith("App\\Models\\Report")) {
    return `/reports/${props.notification.data.report_id}`;
  }
  if (props.notification.data.model_type.endsWith("App\\Models\\Comment")) {
    return `/reports/${props.notification.data.report_id}#${props.notification.data.comment_id}`;
  }
});

const navigateToLink = async () => {
  await markAsRead();
  return navigateTo(link.value);
};
</script>
