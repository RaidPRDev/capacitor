<script lang="ts">
export default {
  inheritAttrs: false,
  name: "BaseButton"
}   
</script>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, shallowReactive, useAttrs, useSlots, watch } from 'vue';
import type { IBaseButtonProps } from '@/ui/types';
import { findParentByClassName } from '@/utils/HTMLTools';

// Component Props Setup
const props = withDefaults(defineProps<IBaseButtonProps>(), {
  usePressedState: true,
  pressedTranstionDelay: 475,
  useLongPressedState: false,
  longPressedDelay: 1200,
  asSubControl: false,
  hasInternalLinks: false,
  useIconAsRaw: false,
  useAccessoryIconAsRaw: false,
});

// Emission Event Setup
const emit = defineEmits<{
  (e: 'triggered', event: Event): void;
  (e: 'internalLink', element: HTMLAnchorElement): void;
  (e: 'longPressed', element: HTMLElement): void;
}>()

const LOG = false;

const isPressed = ref<boolean>(false);
const isSelected = ref<boolean>(false);

// Reference Setup
const element = ref<InstanceType<typeof HTMLElement>>();
const iconElement = ref<InstanceType<any>>();
const accessoryIconElement = ref<InstanceType<any>>();

// Icon State
const _iconState = shallowReactive({ 
  icon: props.icon
});

// Accessory Icon State
const _accessoryIconState = shallowReactive({ 
  icon: props.accessoryIcon
});

// Attributes and Slots Setup
const attrs = useAttrs();
const slots = useSlots();
const bodyRef = ref<HTMLElement>();

// Long Press
let _longPressStartTime = 0;
let _longPressIsRunning = false;
let _longPressIsActive = false;
const _requestId = ref<number>(0);

// Expose Definitions
defineExpose({
  buttonRef: () => element.value,
  iconRef: () => iconElement.value,
  accessoryIconRef: () => accessoryIconElement.value,
}); 

watch(props, () => {
  _iconState.icon = props?.icon;
  _accessoryIconState.icon = props?.accessoryIcon;
})

/**
 * 
 * @param timestamp 
 */
function checkPressDuration(timestamp: number) {
  // if (LOG) console.log("checkPressDuration", timestamp);
    
  if (!_longPressIsRunning) _longPressIsRunning = true;
  
  if (!_longPressStartTime) _longPressStartTime = timestamp;
  const elapsedTime = timestamp - _longPressStartTime;

  if (elapsedTime >= props?.longPressedDelay && !_longPressIsActive) {
    _longPressIsActive = true;
    _longPressIsRunning = false;
    enableLongPressMode();
  } else if (!_longPressIsActive) {
    _requestId.value = window.requestAnimationFrame(checkPressDuration);
  }
}

function enableLongPressMode() {
  stopLongPressMode();

  nextTick(() => {
    emit("longPressed", element.value!);
  })  
}

function stopLongPressMode() {
  if (_requestId.value) {
    window.cancelAnimationFrame(_requestId.value);
    nextTick(() => {
      _longPressIsRunning = false;
    })
  }
  _longPressStartTime = 0;
  _longPressIsActive = false;
}    

function onUp(e:MouseEvent) {
  if (props?.useLongPressedState) stopLongPressMode();
  if (props?.asSubControl) e.stopPropagation()
  if (props?.disabled || props?.usePressedState) return;
  if (_longPressIsRunning) return;

  trigger(e, "up");
}

function onDown(e:MouseEvent) {
  if (props?.useLongPressedState) {
    _longPressStartTime = 0;
    _longPressIsActive = false;
    _requestId.value = window.requestAnimationFrame(checkPressDuration);
    document?.body?.addEventListener("pointermove", onMove);
  }  
  
  if (props?.asSubControl) e.stopPropagation();

  if (e?.button === 2) return;
  if (props?.disabled) return;

  const target = e?.target as HTMLElement;
  // console.log("target", e?.target)

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
    nextTick(() => {
      const speed = props.pressedTranstionDelay;
      isPressed.value = true; 
      isSelected.value = true; 

      setTimeout(() => isPressed.value = false, speed / 2);
      setTimeout(() => trigger(e, "down"), speed / 1.3);
      setTimeout(() => isSelected.value = false, speed);
    })
  }
}

function onMove(e:MouseEvent) {
  if (_longPressIsRunning || _longPressIsActive) {
    if (LOG) console.log("x", e.movementX, "y", e.movementY);
    if ((e.movementX > 1) || (e.movementX < -1) || (e.movementY > 1) || (e.movementY < -1) ) {
      if (LOG) console.log("CANCEL LONG PRESS");
      window.cancelAnimationFrame(_requestId.value);
      document?.body?.removeEventListener("pointermove", onMove);
    }
    return; 
  }
}

function trigger(e?:Event, from:string = "down") {
  if (!e) return;

  if (!findParentByClassName(e?.target as HTMLElement, 'base-control')) {
    return;
  }

  // return if called from the Pointer Down state.
  if (props?.useLongPressedState) {
    if (from === "down" && _longPressIsActive) {
      return;
    }
    if (_longPressIsRunning) return;
  }
  
  emit('triggered', e!);
  props?.triggerCallback && props?.triggerCallback({ e });
}

function handleInternalBodyLinks(e:Event) {
  // console.log("handleInternalBodyLinks", e)
  e?.preventDefault();
  const target = e?.target as HTMLAnchorElement;
  emit("internalLink", target);
}

onMounted(() => {
  if (props?.hasInternalLinks) bodyRef?.value?.addEventListener("click", handleInternalBodyLinks);
  // document?.body?.addEventListener("mousemove", onMove);
})

onUnmounted(()=> {
  if (props?.hasInternalLinks) bodyRef?.value?.removeEventListener("click", handleInternalBodyLinks);
  document?.body?.removeEventListener("pointermove", onMove);
}) 
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
      ['selected']: isSelected
    }]" 
  v-bind="{
    ...attrs
  }"
  @pointerup="onUp"
  @pointerdown="onDown"
>
  <span class="inner-base-button height-100 flex align-center justify-center" :class="props?.innerClassName" >
    <span :class="`ui-background pointer-none absolute lx-0 tx-0 width-100 height-100`"></span>
  
    <span class="ui-icon flex relative" :class="props?.iconClassName" v-if="_iconState.icon || slots.iconSlot">
      <slot name="iconSlot">
        <component ref="iconElement" v-if="typeof(_iconState.icon) === 'object'" :is="_iconState.icon" xmlns="yes" v-bind="props?.iconProps"></component>
        <img ref="iconElement" v-else-if="typeof(_iconState.icon) === 'string'" v-bind:src="_iconState.icon" /> 
      </slot>
    </span>
    
    <span v-if="label || slots.bodySlot" class="ui-body flex relative" :class="props?.bodyClassName">
      <slot name="bodySlot">
        <span ref="bodyRef" class="ui-label transform-z" :class="props?.labelClassName" v-html="label"></span>
        <span v-if="subLabel" class="ui-label sub-header transform-z" :class="props?.subLabelClassName" v-html="subLabel"></span>
      </slot>
    </span>

    <span class="ui-accessory-icon flex relative" :class="props?.accessoryIconClassName" v-if="_accessoryIconState.icon || slots.accessorySlot">
      <slot name="accessorySlot">
        <component ref="accessoryIconElement" v-if="typeof(_accessoryIconState.icon) === 'object'" :is="_accessoryIconState.icon" v-bind="props?.accessoryIconProps"></component>
        <img ref="accessoryIconElement" v-else-if="typeof(_accessoryIconState.icon) === 'string' && !useAccessoryIconAsRaw" v-bind:src="_accessoryIconState.icon" /> 
        <div v-else-if="typeof(_accessoryIconState.icon) === 'string' && useAccessoryIconAsRaw" v-html="_accessoryIconState.icon" /> 
      </slot>
    </span>

  </span>
  <slot name="optionalSlot"></slot>
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