<script lang="ts">
export default {
  inheritAttrs: false
}   
</script>

<script setup lang="ts">
import { IBaseScreenSlotProps } from "@/ui/types";
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import SetupIcon from '@/assets/icons/setup-icon.svg';

// Component Props Setup
const props = withDefaults(defineProps<IBaseScreenSlotProps>(), {}) 

</script>

<template>
  <div 
    class="grid grid-single gapx-20 pxl-20 pxr-20 width-100"
    :style="{ width: props?.styles?.width }"
  >
    <BaseHeader class="screen-heading">
      <template v-slot:headerLeft>
        <h1>My Circuit</h1>    
      </template>
      <template v-slot:headerRight>
        <span class="flex"><SetupIcon /></span>
      </template>
    </BaseHeader>

    <div class="content">
      <div>Lorem ipsum dolor sit amet consectetur.</div>
    </div>

  </div>  
</template>

<style scoped lang="scss"></style>