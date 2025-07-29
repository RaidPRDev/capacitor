<script lang="ts">
export default {
  inheritAttrs: false,
  name: "BaseHeader"
}   
</script>

<script setup lang="ts">
import { computed, ref, useAttrs, useSlots } from 'vue';
import { IBaseHeaderProps } from '@/ui/types';

// Component Props Setup
const props = withDefaults(defineProps<IBaseHeaderProps>(), {
  leftProps: () => { return { gap: 0 } },
  centerProps: () => { return { gap: 0 } },
  rightProps: () => { return { gap: 0 } }
});

// Emission Event Setup
defineEmits<{
  (e: 'click', event: Event): void
}>()

// Reference Setup
const element = ref<InstanceType<typeof HTMLElement>>()

// Attributes and Slots Setup
const attrs = useAttrs();
const slots = useSlots();

// Expose Definitions
defineExpose({
  elRef: () => element.value
}); 

const itemClasses = computed(() => {
  let leftCls = (props?.leftProps?.gap) ? `gapx-${props?.leftProps?.gap} ` : ``;
  leftCls += (props?.leftProps?.gap) ? `gapx-${props?.leftProps?.gap} ` : ``;

  let centerCls = (props?.centerProps?.gap) ? `gapx-${props?.centerProps?.gap} ` : ``;
  centerCls += props?.centerClassName ? ` ${props?.centerClassName}` : ``
  
  let rightCls = (props?.rightProps?.gap) ? `gapx-${props?.rightProps?.gap} ` : ``;
  
  return { leftCls, centerCls, rightCls };
})

</script>

<template>

<div 
  role="banner"
  ref="element"
  class="base-header height-100"
  :class="[attrs?.class]"
  :v-bind="attrs"
>
  <div :class="`inner-base-header height-inherit relative flex align-center justify-between ${props?.innerClassName ?? ``}`" >
    
    <div class="header-left relative height-inherit flex align-center justify-center" :class="[itemClasses?.leftCls]">
      <slot name="headerLeft"></slot>
    </div>
    
    <div v-if="slots.headerCenter" class="header-center relative height-inherit flex align-center justify-center" :class="[itemClasses?.centerCls]">
      <slot name="headerCenter"></slot>
    </div>
    
    <div class="header-right relative height-inherit flex align-center justify-center" :class="[itemClasses?.rightCls]">
      <slot name="headerRight"></slot>
    </div>
    
  </div>
</div>

</template>

<style scoped lang="scss"></style>