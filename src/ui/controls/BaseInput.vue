<script lang="ts">
  export default {
    inheritAttrs: false,
    name: "BaseInput"
  }
</script>

<script setup lang="ts">
import { ref, useAttrs, useSlots, reactive, watch } from 'vue';
import { IBaseInputProps } from '../types';

// Component Props Setup

const props = withDefaults(defineProps<IBaseInputProps>(), {
  elementClass: "",
  required: false,
  disabled: false,
});

// Emission Event Setup
const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void;
  (e: 'inputElement', el: HTMLInputElement): void;
  (e: 'input', value: number | string): void;
  (e: 'key', value: KeyboardEvent): void;
  (e: 'enter', value: KeyboardEvent): void;
  (e: 'focus', value: Event): void;
  (e: 'focusOut', value: Event): void;
  (e: 'errorValidation', element: HTMLInputElement): void;
}>();

// Reference Setup
const inputElement = ref<InstanceType<typeof HTMLInputElement>>()

// Expose Definitions
defineExpose({
  inputRef: () => inputElement.value as HTMLInputElement,
  inputValue: () => inputElement.value?.value as string,
})

// Attributes and Slots Setup
const attrs = useAttrs();
const slots = useSlots();

// Computed Style Setup
const styleObject = reactive({
  gap: ( (props.icon || props.accessoryIcon) ) ? props.gap : 0
})

// Event Callback Setup
function onInput(event:Event | InputEvent)
{
  // update model value
  const target:HTMLInputElement | null = event.target as HTMLInputElement;
  emit('update:modelValue', target?.value as string);

  // invoke? input
  emit("input", target?.value as string);
  emit("inputElement", target as HTMLInputElement);

  props?.onBaseInput && props?.onBaseInput(props);
}

function onKeyPress(event:KeyboardEvent)
{
  if (event?.key === "Enter" || event?.code === "Enter") {
    event?.preventDefault();
    props?.onEnter && props?.onEnter(props);
    
    emit("enter", event);
    return;
  }

  emit("key", event);
}

function onBlur(event:Event | InputEvent)
{
  event?.preventDefault();

  emit("focusOut", event);

  props?.onBlur && props?.onBlur(props);
}

/**
 * Watch for error 
 * 
 * Triggers when an error is validated.
 * 
 * @returns HTMLElement
 * 
 */
watch(props, (({ error }) => 
{
  if (error?.hasError)
  {
    emit("errorValidation", inputElement.value as HTMLInputElement);
  }

}), { flush: "post" })

</script>

<template>
<div :class="['base-input relative', props?.containerClass, { ['required']: props.required && !props.disabled, ['disabled']: props.disabled } ]">
  
  <div :class="['ui-input-label mxt-0 mxb-0', props?.labelClass]">
    <label v-bind:for="props.id" class="ui-label">
      {{props.label}}
      <span v-if="props.required">*</span>
    </label>
  </div>

  <div class="inner-input flex align-center width-100" :class="[props?.innerClass]">

    <div v-if="icon || slots.iconSlot" class="ui-icon flex">
      <component v-if="typeof(icon) === 'object'" :is="icon"></component>
      <img v-else-if="typeof(icon) === 'string'" v-bind:src="icon" />
      <slot v-if="slots.iconSlot" name="iconSlot"></slot>
    </div>

    <div :class="[
        'ui-input-field relative flex align-center justify-between outline-none width-100',
        props?.inputFieldClass,
        { ['error']: error?.hasError }
      ]" 
      v-bind:style="styleObject"
    >
      <input 
        ref="inputElement"
        v-bind="{
          ...attrs,
          class: [
            'ui-input-element border-none width-100', 
            props?.elementClass, { 
              ['required']: props.required && !props.disabled }
            ],
          id: props.id,
          'data-index': props?.index ?? ``,
          type: props.type,
          pattern: props.pattern,
          name: props.name,
          autocomplete: props.autocomplete,
          placeholder: props.placeholder,
          required: props.required && !props.disabled,
          value: props.controlledValue,
          disabled: props.disabled
        }"
        @blur="onBlur"
        @input="onInput" 
        @keypress="onKeyPress"
      />
      
    </div>

    <div v-if="accessoryIcon || slots.accessorySlot" class="ui-icon accessory flex">
      <component v-if="typeof(accessoryIcon) === 'object'" :is="accessoryIcon"></component>
      <img v-else-if="typeof(accessoryIcon) === 'string'" v-bind:src="accessoryIcon" />
      <slot v-if="slots.accessorySlot" name="accessorySlot"></slot>
    </div>

  </div>
  
  <div v-if="error?.hasError" class="error-field flex">{{error.message}}</div>
    
</div>
</template>

<style scoped lang="scss">
.ui-label {
  > span {
    margin-left: 0.25rem;
  }
}
.error-field {
  margin: 0.25rem 0 0 0.5rem;
  font-size: 12px;
  font-weight: 700;
  color: red;
}
.error {
  color: red;
}
</style>