<script lang="ts">
export default {
  inheritAttrs: true,
  name: "ScreenView"
}   
</script>

<script setup lang="ts">
import { IBaseScreenSlotProps } from '@/ui/types';
import { ref } from 'vue';

// Component Props Setup
const props = withDefaults(defineProps<IBaseScreenSlotProps>(), {}) 

// Reference Setup
const element = ref<InstanceType<typeof HTMLElement>>()

// Expose Definitions
defineExpose({
  elRef: () => element.value
}); 
</script>

<template>
  <div ref="element" class="screen-view grid grid-single gapx-20 width-100 height-inherit overflow-hidden" :class="props?.class" :style="props?.styles">
    <div class="inner-screen height-inherit">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
// .screen-view {}
</style>