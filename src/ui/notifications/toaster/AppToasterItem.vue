<script lang="ts">
export default {
  inheritAttrs: true,
  name: "AppToasterItem"
}   
</script>

<script lang="ts" setup>
import { onMounted, onUnmounted, shallowRef } from 'vue';
import { IToaster } from './types';

// Component Props Setup
const props = withDefaults(defineProps<IToaster>(), {
  hasAutoClose: true,
  duration: 3000,
  position: "top-center"
});

const timeoutComplete = shallowRef<ReturnType<typeof setTimeout>>();

// Emission Event Setup
const emit = defineEmits<{
  (e: 'close', toast: IToaster): void;
  (e: 'complete', toast: IToaster): void;
}>()

function startTimer() {
  if (!props?.hasAutoClose) return;

  clearTimeout(timeoutComplete.value);

  timeoutComplete.value = setTimeout(() => {
    emit("complete", {...props});
  }, props?.duration);
}

onMounted(() => {
  startTimer();
})

onUnmounted(() => {
  clearInterval(timeoutComplete.value);
})

</script>

<template>
  <div :class="[`toaster-item`, `flex-center`, `px-20`]">
    <div v-if="props?.label" class="label">{{ props?.label }}</div>
    <component v-else-if="typeof(props?.component) === 'object'" :is="props.component" v-bind="props?.componentProps"></component>
  </div>
</template>

<style lang="scss" scoped>
.toaster-item {
  transform-origin: top left;
  background-color: $primary-color;
  border-radius: $global-radius;
  width: 100%;
  
  // for bottom postion
  + .toaster-item {
    margin-top: 1rem;
  }

  .label {
    color: white;
    font-size: 16px;
    font-weight: 400;
  }
}
</style>