<script lang="ts">
export default {
  inheritAttrs: false,
  name: "BasePanel"
}   
</script>

<script setup lang="ts">
import { IBasePanelProps } from '@/ui/types';
import { ref } from 'vue';

// Component Props Setup
const props = withDefaults(defineProps<IBasePanelProps>(), {}) 

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
    :class="props?.class" 
    :style="props?.styles"
  >
    <div class="inner-panel height-inherit">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
// .base-panel {}
</style>