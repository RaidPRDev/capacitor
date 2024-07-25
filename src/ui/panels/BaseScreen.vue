<script lang="ts">
export default {
  inheritAttrs: false,
  name: "BaseScreen"
}   
</script>

<script setup lang="ts">
import { onMounted, useSlots } from 'vue';
import type { IBaseScreenProps } from '@/ui/types';
// import { useDevice } from '@/plugins/Device';

// Component Props Setup
const props = withDefaults(defineProps<IBaseScreenProps>(), {}) 

// Attributes and Slots Setup
const slots = useSlots();

// Device Tools
// const device = useDevice();

onMounted(() => {});

</script>

<template>
<div 
  class="base-screen relative flex align-center justify-center size-inherit" 
  :class="props?.className" 
>
  <div 
    class="inner-screen relative size-100 flex flex-column justify-between align-center" 
  >
    <div 
      v-if="slots?.headerSlot" 
      :class="['screen-header width-100', props?.headerSlotProps?.class]"
      :style="[props?.headerSlotProps?.styles]"
    >
      <slot name="headerSlot"></slot>
    </div>

    <div 
      v-if="slots?.bodySlot" 
      :class="[
        'screen-body absolute lx-0 width-100 pxl-0 pxr-0 pxt-40 pxb-20', 
        props?.bodySlotProps?.class
      ]"
      :style="[props?.bodySlotProps?.styles]"
    >
      <slot name="bodySlot"></slot>
    </div>
    
    <div 
      v-if="slots?.footerSlot" 
      :class="[
        'screen-footer width-100 mxb-1 absolute lx-0 bx-0', 
        props?.footerSlotProps?.class
      ]"
      :style="[props?.footerSlotProps?.styles]"
    >
      <slot name="footerSlot"></slot>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
$headersHeight: ($header-height + $footer-height);

.base-screen {
  transition: transform 0.65s ease, opacity 0.65s ease;
}
.screen-header {
  height: #{$header-height}px;
}
.screen-body {
  top: #{$header-height}px;
  height: calc(100% - (#{$headersHeight}px));
}
.screen-footer {
  height: #{$footer-height}px;
}
</style>