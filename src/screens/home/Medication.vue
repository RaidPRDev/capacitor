<script lang="ts">
export default {
  inheritAttrs: false
}   
const DEBUG = false;
</script>

<script setup lang="ts">
import { ComponentPublicInstance, computed, onMounted, ref, shallowRef } from "vue";

import { 
  BRANCH_HEADER_HEIGHT, 
  BREADCRUMB_HEIGHT, 
  COMPILED_DATA_PATH, 
  GLOBAL_PADDING 
} from "@/_core/Constants";

import BasePanel from '@/ui/panels/BasePanel.vue';
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import Branching from '@/ui/navigation/branching/Branching.vue';
import PulseRateLoader from '@/components/PulseRateLoader.vue';
import Breadcrumbs from '@/components/Breadcrumbs.vue';
import useBranching from "@/ui/navigation/branching/hooks/useBranching";
import { IBaseScreenSlotProps } from "@/ui/types";
import { BranchRouteProps, BranchViewData, BranchViewParamData } from "@/ui/navigation/branching/types";
import { loadViewData } from '@/ui/navigation/branching/utils/DataTools';
import { getNavigationRoot } from "@/ui/navigation/branching/utils/tools";

import TimePillIcon from '@/assets/icons/homeMenu/time-pill-icon.svg';

// Component Props Setup
const props = withDefaults(defineProps<IBaseScreenSlotProps & BranchRouteProps>(), {}) 
const loading = ref<boolean>(true);
const views = shallowRef<BranchViewData[]>([]);
const branchingRef = ref<ComponentPublicInstance<typeof Branching>>()

const { 
  baseHeight, 
  breadcrumbs,
  changeView,
} = useBranching({
  branchingRef: branchingRef
})

onMounted(async () => {
  await loadViewData(`${COMPILED_DATA_PATH}/medications_compiled.json`, views);
  
  setTimeout(() => { loading.value = false; }, 750);
})

const headingTitle = computed(() => {
  return views?.value?.[0]?.heading;
})

function onViewBeforeEnter(params: BranchViewParamData) {
  if (DEBUG) console.log(`Medication.onViewBeforeEnter`, params);
  
  const rootInfo = getNavigationRoot(params);

  // show/hide breadcrumbs if not in root view
  if (!rootInfo.isViewRoot) breadcrumbs.value = params?.breadcrumbData!;
  else breadcrumbs.value = { items: [] };

  if (params?.view?.isRootParent) {
    baseHeight.value = BRANCH_HEADER_HEIGHT + GLOBAL_PADDING;
  }
  else {
    baseHeight.value = BRANCH_HEADER_HEIGHT + GLOBAL_PADDING + BREADCRUMB_HEIGHT;
  }
}

</script>

<template>
<BasePanel v-bind="props" class="pxl-0 pxr-0">
  <transition name="fade" appear mode="out-in">
    <div v-if="loading" class="loading flex justify-center align-center height-100">
      <PulseRateLoader />
    </div>
    <div v-else class="height-inherit">
      <BaseHeader class="screen-heading pxlr-20 mxb-20 height-auto">
        <template v-slot:headerLeft>
          <h1 class="screen-title">{{headingTitle}}</h1>    
        </template>
        <template v-slot:headerRight>
          <span class="flex"><TimePillIcon /></span>
        </template>
      </BaseHeader>
      <BaseHeader class="screen-breadcrumbs pxlr-20 mxb-0 height-auto">
        <template v-slot:headerLeft>
          <Breadcrumbs v-bind="breadcrumbs" @triggered="changeView" />
        </template>
      </BaseHeader>
      <Branching 
        ref="branchingRef"
        viewClassName="pxlr-20 pxt-20 pxb-20" 
        :branchRoute="props.branchRoute"
        :views="views" 
        :useNavigation="true"
        :listHeight="baseHeight"
        @onViewBeforeEnter="onViewBeforeEnter"
      />
    </div>
  </transition>
</BasePanel>
</template>

<style scoped lang="scss"></style>