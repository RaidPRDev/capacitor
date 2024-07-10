<script lang="ts">
export default {
  inheritAttrs: false,
  name: "BaseButton"
}   
</script>

<script setup lang="ts">
import { reactive, ref, shallowReactive, useAttrs, useSlots } from 'vue';
import type { IBaseButtonProps } from '@/ui/types';

// Component Props Setup
const props = withDefaults(defineProps<IBaseButtonProps>(), {});

// Emission Event Setup
const emit = defineEmits<{
  (e: 'triggered', event: Event): void
}>()

// Reference Setup
const element = ref<InstanceType<typeof HTMLElement>>()

// Attributes and Slots Setup
const attrs = useAttrs();
const slots = useSlots();

// Expose Definitions
defineExpose({
  buttonRef: () => element.value
}); 

// Icon State
const _iconState = shallowReactive({ 
  icon: props.icon
});

// Accessory Icon State
const _accessoryIconState = shallowReactive({ 
  icon: props.accessoryIcon
});

// Computed Style Setup
const styleObject = reactive({
  // gap: ( (props.icon || props.accessoryIcon) && (props.label)) ? props.gap : 0
})


function onClick(e:Event) {
  if (props?.disabled) return;
  
  emit('triggered', e);
}

</script>

<template>

<button 
  ref="element"
  class="base-button relative bg-transparent font-inherit color-inherit mx-0"
  :class="props?.elementClassName" 
  v-bind="{
    style: styleObject,
    ...attrs
  }"
  
  @click="onClick"
>
  <span class="inner-base-button flex align-center justify-center px-6" :class="props?.innerClassName" >
    <span :class="`ui-background pointer-none absolute lx-0 tx-0 width-100 height-100`"></span>
  
    <span class="ui-icon flex" :class="props?.iconClassName" v-if="_iconState.icon || slots.iconSlot">
      <slot name="iconSlot">
        <component v-if="typeof(_iconState.icon) === 'object'" :is="_iconState.icon"></component>
        <img v-else-if="typeof(_iconState.icon) === 'string'" v-bind:src="_iconState.icon" /> 
      </slot>
    </span>
    
    <span class="ui-body flex" :class="props?.bodyClassName">
      <slot name="bodySlot">
        <span class="ui-label" v-html="label"></span>
        <span v-if="subLabel" class="ui-label sub-header" v-html="subLabel"></span>
      </slot>
    </span>

    <span class="ui-accessory-icon flex" :class="props?.accessoryIconClassName" v-if="_accessoryIconState.icon || slots.accessorySlot">
      <slot name="accessorySlot">
        <component v-if="typeof(_accessoryIconState.icon) === 'object'" :is="_accessoryIconState.icon"></component>
        <img v-else-if="typeof(_accessoryIconState.icon) === 'string'" v-bind:src="_accessoryIconState.icon" /> 
      </slot>
    </span>

  </span>
</button>

</template>

<style scoped lang="scss">
.base-button {
  &.active {
    cursor: not-allowed;
  }  
  &.disabled {
    cursor: not-allowed;
    pointer-events: none;
  }  
}
</style>