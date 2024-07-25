<script lang="ts">
export default {
  inheritAttrs: true,
  name: "Branching"
}   
</script>

<script lang="ts" setup>
import { ref, computed, useAttrs, onMounted } from 'vue';
import BaseButton from '@/ui/controls/BaseButton.vue';
import View from './components/BranchView.vue';
import { BranchViewData } from './types';

import ChevronLeftIcon from '@/assets/icons/chevron-left-icon.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right-icon.svg';

interface IBranchingProps {
  views: BranchViewData[];
  useNavigation?: boolean;
  navigationHeight?: number;
  viewClassName?: string;
}

const props = withDefaults(defineProps<IBranchingProps>(), {
  useNavigation: true,
  navigationHeight: 60
});

// Attributes and Slots Setup
const attrs = useAttrs();

// State variables
const currentViewIndex = ref<number>(0);
const viewHistory = ref<number[]>([]);

// Computed properties
const currentView = computed<BranchViewData | null>(() => props?.views?.length > 0 ? props?.views?.[currentViewIndex.value] : null);
const canGoBack = computed<boolean>(() => viewHistory.value.length > 0);
const canGoNext = computed<boolean>(() => currentView.value !== null && currentView.value.branchTo !== null);
const navigationStyles = computed(() => {
  if (!props?.useNavigation) return {}
  return { height: `${props?.navigationHeight}px` }
})

// Methods
function goBack() {
  if (canGoBack.value) {
    currentViewIndex.value = viewHistory.value.pop() as number;
  }
}

function goNext() {
  if (canGoNext.value) {
    viewHistory.value.push(currentViewIndex.value);
    currentViewIndex.value = props?.views?.findIndex(view => view.id == currentView?.value?.branchTo);
  }
}

function handleNavigate(branchTo: string | null) {
  if (branchTo !== null) {
    viewHistory.value.push(currentViewIndex.value);
    currentViewIndex.value = props?.views?.findIndex(view => view.id === branchTo);
  }
}

onMounted(() => {});

</script>

<template>
  <div class="branching flex flex-column height-inherit" v-bind="{ ...attrs }">
    <transition name="fade" mode="out-in">
      <View :key="currentView?.id" :view="currentView" @navigate="handleNavigate" :height="props?.useNavigation ? props?.navigationHeight : 0" :class="viewClassName" />
    </transition>

    <div v-if="props?.useNavigation" class="branch-navigation bg-transparent flex justify-center align-center pxlr-20 width-100" :style="navigationStyles">
      <div class="inner-navigation flex justify-between width-100 pxlr-10">
        <BaseButton 
          class="variant-red" 
          innerClassName="pxlr-16 pxtb-9 justify-between"
          bodyClassName="text-left"
          :label="`Back`"
          :icon="ChevronLeftIcon"
          :disabled="!canGoBack"
          @triggered="goBack"
        />
        <BaseButton 
          class="variant-red" 
          innerClassName="pxlr-16 pxtb-9 justify-between"
          bodyClassName="text-left"
          :label="`Next`"
          :accessoryIcon="ChevronRightIcon"
          :disabled="!canGoNext"
          @triggered="goNext"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
// .branch-navigation {}
</style>
