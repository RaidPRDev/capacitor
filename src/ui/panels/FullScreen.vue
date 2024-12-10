<script lang="ts">
export default {
  inheritAttrs: false,
  name: "FullScreen"
}   
</script>

<script setup lang="ts">
import { computed, onMounted, useSlots } from 'vue';
import type { IBaseScreenProps } from '@/ui/types';
import { useDevice } from '@/plugins/Device';

// Component Props Setup
const props = withDefaults(defineProps<IBaseScreenProps>(), {}) 

// Attributes and Slots Setup
const slots = useSlots();

// Device Tools
const device = useDevice();

onMounted(() => {});

const innerStyles = computed(() => {
  if (!device?.isMobile()) {
    
    // non mobile devices
    return { 
      // for use for phone template
      borderRadius: `47px`,
    }
  }

  const res = device?.state.resolution
  return { width: `${res.width}px`, height: `${res.height}px` }
});

</script>

<template>
<div 
  :class="[
    'base-screen full-screen relative flex align-center justify-center size-inherit', 
    props?.className
  ]"
>
  <div 
    :class="[
      'inner-screen relative size-inherit flex flex-column justify-between align-center', 
      props?.innerClassName
    ]"
    :style="[innerStyles]"  
  >
    <div 
      v-if="slots?.headerSlot" 
      :class="[
        'screen-header width-100', 
        props?.headerSlotProps?.class
      ]"
      :style="[props?.headerSlotProps?.styles]"
    >
      <slot name="headerSlot"></slot>
    </div>

    <div 
      v-if="slots?.bodySlot" 
      :class="[
        'screen-body width-inherit height-inherit px-0', 
        props?.bodySlotProps?.class
      ]"
      :style="[props?.bodySlotProps?.styles]"
    >
      <slot name="bodySlot" v-bind="{ styles: innerStyles }"></slot>
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
.base-screen {
  transition: transform 0.65s ease, opacity 0.65s ease;
}

</style>