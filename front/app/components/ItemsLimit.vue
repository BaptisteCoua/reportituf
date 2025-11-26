<template>
  <slot
    v-for="(item, i) in itemsInLimit"
    :key="i"
    :item="item"
    :isEnd="i === itemsInLimit.length - 1"
  >
    <strong>{{ itemTitle ? item[itemTitle] : item }}</strong>
    <slot name="separator" v-if="i < itemsInLimit.length - 1">, </slot>
  </slot>
  <v-tooltip v-if="remainingItems.length > 0" v-bind="$attrs" class="pa-2">
    <template v-slot:activator="{ props }">
      <span class="position-relative opacity-70" v-bind="props">
        + {{ remainingItems.length }}
      </span>
    </template>
    <template #default>
      <div class="d-flex flex-column ga-1">
        <span v-for="(item, i) in remainingItems" :key="i">
          <slot
            name="remaining-item"
            :item="item"
            :isEnd="i === remainingItems.length - 1"
          >
            {{ itemTitle ? item[itemTitle] : item }}
            <slot
              name="remaining-item-separator"
              v-if="i < remainingItems.length - 1"
            >
              ,
            </slot>
          </slot>
        </span>
      </div>
    </template>
  </v-tooltip>
</template>

<script setup lang="ts">
import { makeVTooltipProps } from "vuetify/lib/components/VTooltip/VTooltip.mjs";

const props = defineProps({
  items: { type: Array, required: true },
  itemTitle: { type: String },
  limit: { type: Number, default: 2 },
  ...makeVTooltipProps(),
});

const itemsInLimit = computed<any[]>(() => {
  return props.items.slice(0, props.limit);
});

const remainingItems = computed<any[]>(() => {
  return props.items.slice(props.limit);
});
</script>
