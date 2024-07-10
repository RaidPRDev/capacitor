<script lang="ts">
export default {
  inheritAttrs: false
}   
</script>

<script setup lang="ts">
import { IBaseScreenSlotProps } from "@/ui/types";
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import Input from '@/components/Input.vue';
import ActionButton from '@/components/ActionButton.vue';
import SetupIcon from '@/assets/icons/setup-icon.svg';

// Component Props Setup
const props = withDefaults(defineProps<IBaseScreenSlotProps>(), {}) 

</script>

<template>
  <div 
    class="grid grid-single gapx-20 pxl-20 pxr-20"
    :style="{ width: props?.styles?.width }"
  >
    <BaseHeader class="screen-heading">
      <template v-slot:headerLeft>
        <h1>Setup</h1>    
      </template>
      <template v-slot:headerRight>
        <span class="flex"><SetupIcon /></span>
      </template>
    </BaseHeader>

    <div>Lorem ipsum dolor sit amet consectetur.</div>
    <div><Input id="gender" name="gender" :label="`Gender:`" /></div>
    <div><Input id="age" name="age" :label="`Age:`" /></div>
    <div><Input id="weight" name="weight" :label="`Weight (kg):`" /></div>
    <div>If your patient settings are okay, please select SAVE to continue.</div>
    <div><ActionButton :label="`Save`" /></div>

  </div>  
</template>

<style scoped lang="scss"></style>