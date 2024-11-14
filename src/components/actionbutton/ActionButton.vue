<script lang="ts">
export default {
  inheritAttrs: false,
  name: "ActionButton"
}   
</script>

<script setup lang="ts">
import classnames from 'classnames';
import BaseButton from '@/ui/controls/BaseButton.vue';
import { IBaseButtonProps } from "@/ui/types";

// Component Props Setup
const props = withDefaults(defineProps<IBaseButtonProps & { outlined?: boolean }>(), {
  class: "",
  outlined: false,
  usePressedState: true,
  elementClassName: "action-button",
  innerClassName: "pxlr-13 pxtb-9 justify-between",
  bodyClassName: "relative",
  accessoryIconClassName: "relative",
});

// Emission Event Setup
const emit = defineEmits<{
  (e: 'triggered', event: Event): void
}>()

function onTriggered(e:Event) {
  emit('triggered', e);
}

</script>

<template>
  <BaseButton 
    :class="classnames(
      `action-button variant-red small`, 
      elementClassName,
      { [`outlined`]: outlined }
    )"
    v-bind="props" 
    @triggered="onTriggered"
  >
    <template v-slot:accessorySlot v-if="accessoryIcon">
      <component v-if="typeof(accessoryIcon) === 'object'" :is="accessoryIcon"></component>
    </template>
  </BaseButton>
</template>

<style scoped lang="scss">
// .action-button {}
</style>