<script lang="ts">
export default {
  inheritAttrs: false,
  name: "ActionButton"
}   
</script>

<script setup lang="ts">
import BaseButton from '@/ui/controls/BaseButton.vue';
import { IBaseButtonProps } from "@/ui/types";

// Component Props Setup
const props = withDefaults(defineProps<IBaseButtonProps>(), {
  elementClassName: "action-button",
  innerClassName: "pxlr-16 pxtb-10",
  bodyClassName: "relative",
  accessoryIconClassName: "relative",
});

// Emission Event Setup
const emit = defineEmits<{
  (e: 'triggered', event: Event): void
}>()

function onTriggered(e:Event) {
  console.log("Action.onTriggered");

  emit('triggered', e);
}

</script>

<template>
  <BaseButton class="action-button variant-red" v-bind="props" @triggered="onTriggered">
    <template v-slot:accessorySlot v-if="accessoryIcon">
      <component v-if="typeof(accessoryIcon) === 'object'" :is="accessoryIcon"></component>
    </template>
  </BaseButton>
</template>

<style scoped lang="scss">
// .action-button {}
</style>