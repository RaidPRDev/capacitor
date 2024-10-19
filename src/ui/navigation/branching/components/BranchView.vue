<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchView"
}   
</script>

<script lang="ts" setup>
import { computed, ref, useAttrs } from 'vue';
import { BranchViewData } from '../types';

interface IBranchViewProps {
  view: BranchViewData | null;
  height?: number | undefined;
}

const props = withDefaults(defineProps<IBranchViewProps>(), {});

// Attributes and Slots Setup
const attrs = useAttrs();

const emit = defineEmits<{
  (e: 'navigate', branchTo: string | null): void;
  (e: 'triggered', dataProps: any): void;
}>();

// Reference Setup
const element = ref<InstanceType<typeof HTMLElement>>()

const styles = computed(() => {
  if (props?.height === undefined) return { flexGrow: 1 }
  return { height: `calc(100% - ${props?.height}px)` }
})

// Expose Definitions
defineExpose({
  elRef: () => element.value
});

function navigate(branchTo: string | null) {
  emit('navigate', branchTo);
}

function triggered(dataProps: any) {
  emit('triggered', dataProps);
}
</script>

<template>
  <div ref="element" 
    class="branch-view" 
    v-bind="{ ...attrs }" 
    :class="[{ ['overflow-v-scroll']: false }]"
    :style="styles"
  >
    <component 
      :is="props?.view?.component" 
      :view="props?.view" 
      :showTitle="view?.showTitle" 
      @navigate="navigate"
      @triggered="triggered"
    />
  </div>
</template>

<style scoped lang="scss"></style>