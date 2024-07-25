<script lang="ts">
export default {
  inheritAttrs: false,
  name: "ButtonGroup"
}   
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import type { IButtonGroupProps, IButtonGroupSelected } from '@/ui/types';
import BaseButton from '@/ui/controls/BaseButton.vue';

// Component Props Setup
const props = withDefaults(defineProps<IButtonGroupProps>(), {
  buttonComponent: () => BaseButton
});

// Emission Event Setup
const emit = defineEmits<{
  (e: 'triggered', selected: IButtonGroupSelected): void
}>()

// Reference Setup
const element = ref<InstanceType<typeof HTMLElement>>()

// Attributes and Slots Setup
const attrs = useAttrs();

// Expose Definitions
defineExpose({
  buttonGroupRef: () => element.value
}); 

function onTriggered(index:number) {
  if (props?.disabled) return;
  emit('triggered', { index, data: props.dataProvider[index] });
}

</script>

<template>

<div 
  ref="element"
  class="button-group relative"
  :class="props?.elementClassName" 
  v-bind="{ ...attrs }"
>
  <div class="inner-button-group flex align-center justify-center" :class="props?.innerClassName" >
    <template v-for="(button, index) in dataProvider">
      <component 
        :is="buttonComponent"
        :v-bind:key="`home-menu-nav-${index}`"
        v-bind="{...props?.defaultButtonProps, class: selectedIndex === index ? `active` : ``, ...button}"
        @triggered="() => onTriggered(index)"
      ></component>
      
      <!-- <BaseButton 
        :v-bind:key="`home-menu-nav-${index}`"
        v-bind="{...props?.defaultButtonProps, ...button, class: selectedIndex === index ? `active` : ``}"
        @triggered="() => onTriggered(index)"
      /> -->
    </template>
  </div>
</div>

</template>

<style scoped lang="scss">
.button-group {
  &.disabled {
    cursor: not-allowed;
    pointer-events: none;
  }  
}
</style>