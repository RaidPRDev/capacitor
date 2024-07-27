<script lang="ts">
export default {
  inheritAttrs: false,
  name: "BaseButton"
}   
</script>

<script setup lang="ts">
import { reactive, ref, shallowReactive, useAttrs, useSlots } from 'vue';
import type { IBaseButtonProps } from '@/ui/types';
import { findParentByClassName } from '@/utils/HTMLTools';

// Component Props Setup
const props = withDefaults(defineProps<IBaseButtonProps>(), {
  usePressedState: true,
  pressedTranstionDelay: 475
});

// Emission Event Setup
const emit = defineEmits<{
  (e: 'triggered', event: Event): void
}>()

const isPressed = ref<boolean>(false);
const isSelected = ref<boolean>(false);

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

function onUp() {
  if (props?.disabled || props?.usePressedState) return;

  trigger();
}

function onDown(e:MouseEvent) {
  if (e?.button === 2) return;
  if (props?.disabled) return;

  const target = e?.target as HTMLElement;

  console.log("target", e?.target)

  // detect if clicking on icon or accessory slots
  const checkIconSlot = findParentByClassName(e?.target as HTMLElement, 'ui-accessory-icon');
  const checkAccIconSlot = findParentByClassName(e?.target as HTMLElement, 'ui-accessory-icon');
 
  // use 'base-control' class name for interaction control within parent button
  if (checkIconSlot || checkAccIconSlot) {
    if (target?.classList.contains('base-control')) {
      return;
    }
  }

  if (isPressed.value || isSelected.value) return;

  if (props?.usePressedState) {
    const speed = props.pressedTranstionDelay;
    isPressed.value = isSelected.value = true; 
    setTimeout(() => isPressed.value = false, speed / 2);
    setTimeout(() => trigger(e), speed / 1.3);
    setTimeout(() => isSelected.value = false, speed);
  }
}

function trigger(e?:Event) {
  if (!findParentByClassName(e?.target as HTMLElement, 'base-control')) {
    return;
  }
  emit('triggered', e!);

  // console.log("target", e?.target)
  // console.log("currentTarget", e?.currentTarget)

  props?.triggerCallback && props?.triggerCallback({ e });
}

</script>

<template>

<button 
  ref="element"
  class="base-control base-button relative bg-transparent font-inherit color-inherit select-none mx-0"
  :class="[
    props?.elementClassName, 
    { 
      ['disabled']: props?.disabled,
      ['pressed']: isPressed,
      ['selected']: isSelected,
    }]" 
  v-bind="{
    style: styleObject,
    ...attrs
  }"
  @mouseup="onUp"
  @mousedown="onDown"
>
  <span class="inner-base-button height-100 flex align-center justify-center" :class="props?.innerClassName" >
    <span :class="`ui-background pointer-none absolute lx-0 tx-0 width-100 height-100`"></span>
  
    <span class="ui-icon flex relative" :class="props?.iconClassName" v-if="_iconState.icon || slots.iconSlot">
      <slot name="iconSlot">
        <component v-if="typeof(_iconState.icon) === 'object'" :is="_iconState.icon" xmlns="yes" v-bind="props?.iconProps"></component>
        <img v-else-if="typeof(_iconState.icon) === 'string'" v-bind:src="_iconState.icon" /> 
      </slot>
    </span>
    
    <span v-if="label" class="ui-body flex relative" :class="props?.bodyClassName">
      <slot name="bodySlot">
        <span class="ui-label transform-z" v-html="label"></span>
        <span v-if="subLabel" class="ui-label sub-header transform-z" v-html="subLabel"></span>
      </slot>
    </span>

    <span class="ui-accessory-icon flex relative" :class="props?.accessoryIconClassName" v-if="_accessoryIconState.icon || slots.accessorySlot">
      <slot name="accessorySlot">
        <component v-if="typeof(_accessoryIconState.icon) === 'object'" :is="_accessoryIconState.icon" v-bind="props?.accessoryIconProps"></component>
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
  }  
}
</style>