<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BasePanel"
}   
</script>

<script setup lang="ts">
import { ref, useSlots } from 'vue';
import { IBasePanelProps } from '@/ui/types';

// Component Props Setup
const props = withDefaults(defineProps<IBasePanelProps>(), {}) 

// Attributes and Slots Setup
const slots = useSlots();

// Reference Setup
const element = ref<InstanceType<typeof HTMLElement>>()

// Expose Definitions
defineExpose({
  elRef: () => element.value
}); 
</script>

<template>
  <div 
    ref="element" 
    class="base-panel grid grid-single gapx-20 width-100 height-inherit" 
    :style="props?.styles"
  >
    <div class="inner-panel height-inherit relative" :class="props?.innerClass">
      <div 
        v-if="slots?.headerSlot" 
        :class="['panel-header width-100', props?.headerSlotProps?.class]"
        :style="[props?.headerSlotProps?.styles]"
      >
        <slot name="headerSlot"></slot>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.base-panel {
  z-index: 1;
  pointer-events: all;
}
</style>