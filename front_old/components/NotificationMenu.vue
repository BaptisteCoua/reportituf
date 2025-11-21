<template>
  <v-menu
    v-model="isOpen"
    transition="slide-y-transition"
    :close-on-content-click="false"
  >
    <template #activator="{ props }">
      <v-badge
        v-if="notifications.length !== 0"
        :content="notifications.length"
        color="xefi-red"
        offset-x="6"
        offset-y="6"
        class="cursor-pointer"
        @click="isOpen = !isOpen"
        v-bind="props"
      >
        <v-icon color="grey-darken-1" size="25"> mdi-bell </v-icon>
      </v-badge>
    </template>
    <div class="bg-white pa-4 elevation-2 rounded-lg">
      <template
        v-for="(notification, i) in notifications"
        :key="notification.id"
      >
        <NotificationCard
          :notification="notification"
          @notification-read="removeNotification"
        />
        <v-divider v-if="i < notifications.length - 1" class="my-2" />
      </template>
    </div>
  </v-menu>
</template>

<script setup lang="ts">
import notificationService from "~/services/notificationService";
import type { INotification } from "~/shared/types/INotification";

const isOpen = ref<boolean>(false);

const notifications = ref<INotification[]>(
  (await notificationService().getUnread()) as INotification[]
);
const removeNotification = (id: number) => {
  notifications.value = notifications.value.filter(
    (notification) => notification.id !== id
  );
  if (notifications.value.length === 0) {
    isOpen.value = false;
  }
};
</script>
