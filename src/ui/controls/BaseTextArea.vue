<!-- BaseTextArea.vue 
https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea
-->
<script lang="ts">
  // Disabling Attribute Inheritance
  export default {
    inheritAttrs: false,
    name: "BaseTextArea"
  }
</script>

<script setup lang="ts">

import { ref, onMounted, useSlots, reactive, computed, useAttrs, nextTick } from 'vue'
import { IBaseTextAreaProps } from '../types';
import BaseButton from './BaseButton.vue';

// Component Props Setup
const props = withDefaults(defineProps<IBaseTextAreaProps>(), {
  rows: 8,
  cols: 20,
  spellCheck: "true",
  wrap: "soft",
  useClear: true
}) 

// focus directive test
// const vFocus = {
//   mounted: (el:HTMLTextAreaElement) => el.focus()
// }

// Emission Event Setup
const emit = defineEmits<{
  (e: 'update:modelValue', value: number | string): void
  (e: 'input', value: number | string): void
  (e: 'focusIn'): void
  (e: 'focusOut'): void
  (e: 'onClear'): void
}>();

// Reference Setup
const inputElement = ref<InstanceType<typeof HTMLTextAreaElement>>()

// Expose Definitions
defineExpose({
  inputRef: () => inputElement.value as HTMLTextAreaElement
})

// Setup Attributes
const textAreaAttrs = computed(() => {
  let __attrs = {}
  __attrs = { ...__attrs, spellcheck: props.spellCheck, readonly: props.readonly }
  return __attrs as Record<string, string>;
})

// Attributes and Slots Setup
const slots = useSlots();
const attrs = useAttrs();

// Computed Style Setup
const styleObject = reactive({
  gap: ( (props.icon || props.accessoryIcon) ) ? props.gap : 0
})

// Lifecycle Hook Setup
onMounted(() => {})

// Event Callback Setup
function onInput(event:Event | InputEvent)
{
  // update model value
  const target:HTMLInputElement | null = event.target as HTMLInputElement;
  emit('update:modelValue', target?.value as string);

  // invoke? input
  emit("input", target?.value as string);
}

function onFocusOut()
{
  emit("focusOut");
}

function onFocusIn()
{
  emit("focusIn");
}

function onClear()
{
  // if (inputElement.value) inputElement.value.innerText = ``;

  emit('update:modelValue', '');

  nextTick(() => {
    emit("onClear");

    if (inputElement.value) inputElement.value.focus();
  });  
}
</script>

<template>
  <div  
    v-bind:class="[
      'base-textarea-input width-inherit', 
      props?.containerClass, { 
        ['disabled']: disabled 
      }
    ]"
    v-bind="{ ...attrs }"
  >
    <div v-if="props.label" class="textarea-input-label">
      <label v-bind:for="props.id" class="textarea-label">
        {{props.label}}
        <span v-if="props.required">*</span>
      </label>
    </div>
    <div v-bind:class="[`base-textarea-field relative`, props?.fieldClass]" v-bind:style="styleObject">
        
      <div v-if="icon || slots.iconSlot" class="textarea-icon">
        <component v-if="typeof(icon) === 'object'" :is="icon"></component>
        <img v-else-if="typeof(icon) === 'string'" v-bind:src="icon" />
        <slot v-if="slots.iconSlot" name="iconSlot"></slot>
      </div>
      
      <textarea 
        ref="inputElement"
        v-bind="{
          ...textAreaAttrs,
          class: [
            'base-textarea-element', 
            'relative', 
            elementClass, 
            { 
              ['required']: props.required,
              ['has-clear']: props.useClear
            }
          ],
          id: props.id,
          name: props.name,
          placeholder: props.placeholder,
          required: props.required,
          rows: props.rows,
          cols: props.cols,
          minlength: props.minLength,
          maxlength: props.maxLength,
          wrap: props.wrap,
          value: modelValue
        }"
        @input="onInput" 
        @focusout="onFocusOut"
        @focus="onFocusIn"
      />
      
      <div v-if="accessoryIcon || slots.accessorySlot" class="ui-icon accessory">
          <component v-if="typeof(accessoryIcon) === 'object'" :is="accessoryIcon"></component>
          <img v-else-if="typeof(accessoryIcon) === 'string'" v-bind:src="accessoryIcon" />
          <slot v-if="slots.accessorySlot" name="accessorySlot"></slot>
      </div>
      
      <BaseButton :class="`clear-btn absolute tx-8 rx-8`" :inner-class-name="`px-6`" :label="`Clear`" @triggered="onClear" />

    </div>
  </div>
</template>

<style scoped lang="scss">
.base-textarea-input {
  display: block;
}

.textarea-input-label {
  margin-top: 0px;
  margin-bottom: 0px;
}

.textarea-label {
  > span {
    margin-left: 0.25rem;
  }
}

.base-textarea-field {
  outline: none;
  gap: 0.75rem;
  padding: 0;

  /* if using icon */
  display: flex;
  flex-direction: row;
  -webkit-box-pack: justify;
  justify-content: space-between;
  -webkit-box-align: center;
  align-items: center;

  &:focus {
    outline: none;
    box-shadow: none;
  }
}

.base-textarea-element {
  padding: 1rem;
  border: none;
  display: block;
  width: 100%;
  height: 100%;
  resize: none;

  &.has-clear {
    padding-top: 60px;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
}

.textarea-icon {
  border: none;
  background: transparent;
  font-size: 1.6rem;
  width: auto;
  padding: 0;
  display: flex;
  -webkit-box-align: center;
  align-items: center;

  &.accessory {
    padding: 0;
  }

  svg {
    width: auto;
    height: auto;
  }
}

.clear-btn {
  :deep(.inner-base-button) {
    background-color: darkgray;
    border-radius: 8px;

    .ui-label {
      @include getFontSize('small');
      text-transform: uppercase;
      
      color: white;
      font-weight: 600;
      font-size: 12px;
    }
  }
}
</style>