<script lang="ts">
export default {
  inheritAttrs: false,
  name: "Input"
}   
</script>

<script setup lang="ts">
import BaseInput from '@/ui/controls/BaseInput.vue';
import { IBaseInputProps } from "@/ui/types";
import { reactive, watch } from 'vue';

// Component Props Setup
const props = withDefaults(defineProps<IBaseInputProps>(), {
  containerClass: "default-input",
  labelClass: "mxb-10",
  elementClass: "height-100 text-center background-none",
});

// Component State Setup
interface IState {
  inputValue: string
}

const state:IState = reactive({
  inputValue: props?.modelValue as string
})

// Emission Event Setup
const emit = defineEmits<{
  (e: 'update:inputValue', value: string): void;
  (e: 'focusOut'): void;
}>();

watch(state, () => {
  const { controlledValue } = props;
  emit('update:inputValue', controlledValue as string);
});

function onInputElement(el: HTMLInputElement) {
  emit('update:inputValue', el.value as string);
}

</script>

<template>
  <BaseInput v-bind="props" :controlledValue="state.inputValue" @inputElement="onInputElement"></BaseInput>
</template>

<style scoped lang="scss">
.default-input {
  :deep(.ui-input-label) {
    @include getFontSize('medium');
    font-weight: 700;
  }
  :deep(.ui-input-field) {
    background-color: $white;
    border-radius: $global-radius;
    border: 2px solid $fourth-color;
    height: 48px;
    box-shadow: 0px 6px 20px -13px #{$primary-color}66;
    input {
      color: $primary-color;
      @include getFontSize('normal');
    }
  }
}
</style>