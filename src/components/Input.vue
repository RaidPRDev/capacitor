<script lang="ts">
export default {
  inheritAttrs: false,
  name: "Input"
}   
</script>

<script setup lang="ts">
import BaseInput from '@/ui/controls/BaseInput.vue';
import { IBaseInputProps } from "@/ui/types";

// Component Props Setup
const props = withDefaults(defineProps<IBaseInputProps>(), {
  containerClass: "default-input",
  labelClass: "mxb-10",
  elementClass: "height-100 text-center background-none",
});

</script>

<template>
  <BaseInput v-bind="props" ></BaseInput>
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
    border: 2px solid $quad-color;
    height: 48px;
    box-shadow: 0px 6px 20px -13px #{$primary-color}66;
    input {
      color: $primary-color;
      @include getFontSize('normal');
    }
  }
}
</style>