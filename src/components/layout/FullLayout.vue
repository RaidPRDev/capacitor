<script lang="ts">
export default {
  inheritAttrs: false,
  name: "FullLayout"
}   
</script>

<script setup lang="ts">
import { useSlots } from 'vue';
import type { IFullLayoutProps } from './layoutTypes';

// Component Props Setup
const props = withDefaults(defineProps<IFullLayoutProps>(), {}) 

// Attributes and Slots Setup
const slots = useSlots();

</script>

<template>
<div class="full-layout height-100" :class="props?.className">
  <div class="inner-layout height-inherit flex flex-column justify-between align-center">
    <div v-if="slots?.headerSlot" class="layout-header width-100">
      <slot name="headerSlot"></slot>
    </div>

    <div v-if="slots?.bodySlot" class="layout-body absolute tx-50 lx-0 width-100">
      <slot name="bodySlot"></slot>
    </div>
    
    <div v-if="slots?.footerSlot" class="layout-footer width-100 mxb-1 absolute lx-0 bx-0">
      <slot name="footerSlot"></slot>
    </div>
  </div>
</div>
</template>

<style scoped lang="scss">
.full-layout {
  background-color: white; 
}
.layout-header {
  height: $header-height;
}
.layout-body {
  height: calc(100% - ($header-height + $footer-height));
}
.layout-footer {
  height: $footer-height;
}
</style>