<script lang="ts">
// Disabling Attribute Inheritance
export default {
  inheritAttrs: false,
  name: "BaseToggle"
}    
</script>

<script setup lang="ts">
import { ref, useAttrs } from 'vue'
import { IBaseToggleProps } from '../types';

// Component Props Setup
const props = withDefaults(defineProps<IBaseToggleProps>(), {
  asSubControl: false
}) 

const isControlled = ref<boolean>(props?.modelValue !== null);
const uncontrolledRef = ref<boolean>(false);

// Emission Event Setup
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'click', event: Event): void;
  (e: 'enter', event: Event): void;
}>()

// Reference Setup
const buttonElement = ref<InstanceType<typeof HTMLElement>>()

// Expose Definitions
defineExpose({
  buttonRef: () => buttonElement.value
})

// Attributes and Slots Setup
const attrs = useAttrs();

function onTrigger(e:Event) {
  if (props?.asSubControl) e.stopPropagation();
  
  emit('click', e);

  if (isControlled.value) {
    emit('update:modelValue', !props.modelValue);
    props?.triggerCallback && props?.triggerCallback(!props.modelValue);
    return;
  }

  // Uncontrolled
  const uncontrolledValue = !uncontrolledRef.value;
  uncontrolledRef.value = uncontrolledValue;
  props?.triggerCallback && props?.triggerCallback(uncontrolledValue);
}

function onMouseClick(e:Event) {
  onTrigger(e);
}

function onKeyEnter(e:Event) {
  onTrigger(e);
}

</script>

<template>
  <div 
    role="checkbox"
    :class="['base-control toggle-switch flex align-center justify-center width-100 cursor-pointer outline-none', props?.elementClass, {
      ['selected']: isControlled ? props.modelValue : uncontrolledRef,
    }]" 
    v-bind="{...attrs}"
    tabindex="0"
    :aria-checked="isControlled ? props.modelValue! : uncontrolledRef!"
    @click="onMouseClick"
    @keydown.enter="onKeyEnter" 
  >
    <span v-if="props?.label && !props?.defaultIcon && !props?.activeIcon" 
      class="toggle-label relative text-right"
      role="presentation" 
    >{{ props?.label }}</span>
    <div v-if="!props?.defaultIcon && !props?.activeIcon" class="toggle relative"></div>

    <div class="toggle-icons">
      <div v-if="props?.defaultIcon && !props.modelValue">
        <component :is="props?.defaultIcon" :class="`flex`"></component>
      </div>
      <div v-else-if="props?.activeIcon && props.modelValue">
        <component :is="props?.activeIcon" :class="`flex`"></component>
      </div>
    </div>

  </div>
</template>

<style scoped lang="scss">
$toggle-thumb-color: white;
$toggle-thumb-selected-color: white;

$toggle-background-color: rgba($primary-color, 0.25);
$toggle-background-selected-color: $teniary-color;

$toggle-border-color: rgba($primary-color, 0.25);
$toggle-border-selected-color: rgba($primary-color, 0.5);
$toggle-border-width: 2px;
$toggle-border-radius: .75em;

$toggle-width: 48px; 
$toggle-height: 24px; 
$toggle-gap: 9px; 
$toggle-thumb-left-padding: 2px;
$toggle-thumb-size: calc($toggle-height - (($toggle-border-width * 2) + $toggle-thumb-left-padding));

.toggle-switch {
  border: $toggle-border-width solid transparent;

  &:focus-visible {
    border: $toggle-border-width solid rgb(38 143 255 / 50%);
  }

  .toggle {
    pointer-events: none;
    width: $toggle-width;
    height: $toggle-height;
    background-color: $toggle-background-color;
    box-shadow: .025em .025em .025em rgba(0, 0, 0, 0.1) inset;
    margin-left: $toggle-gap;
    border: $toggle-border-width solid $toggle-border-color;
    border-radius: $toggle-border-radius;
    position: relative;
    transition: all 0.15s ease-out;

    &:before {
      content: '';
      display: block;
      position: absolute;
      width: $toggle-thumb-size;
      height: $toggle-thumb-size;
      background-color: $toggle-thumb-color;
      top: 1px;
      left: $toggle-thumb-left-padding;
      z-index: 1;
      border-radius: 50%;
      transition: all 0.15s ease-out;
      box-shadow: .0625em .0625em .0625em rgba(0, 0, 0, 0.1);
    }
  }

  &.selected {
    .toggle {
      border: $toggle-border-width solid $toggle-border-selected-color;
      background-color: $toggle-background-selected-color;

      &:before {
        background-color: $toggle-thumb-selected-color;
        transform: translateX(calc(math.div($toggle-width - $toggle-thumb-left-padding, 2)));
      }
    }
  }

  .toggle-label {
    color: rgba(white, 90%);
    font-size: 14px;
    font-weight: 400;
    line-height: 100%;
  }

  // &.checkbox-type {

  // }
}
</style>