<script lang="ts">
export default {
  inheritAttrs: false
}
const DEBUG = true;
</script>

<script setup lang="ts">
import { ComponentPublicInstance, computed, onMounted, ref, shallowRef } from "vue";

import { 
  BRANCH_HEADER_HEIGHT, 
  BREADCRUMB_HEIGHT, 
  COMPILED_DATA_PATH, 
  GLOBAL_PADDING 
} from "@/_core/Constants";

import { IBaseScreenSlotProps } from "@/ui/types";
import { BranchRouteProps, BranchViewData, BranchViewParamData } from "@/types";
import { loadViewData } from "@/components/branching/data/DataTools";
import BasePanel from '@/ui/panels/BasePanel.vue';
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import Branching from '@/components/branching/Branching.vue';
import PulseRateLoader from '@/components/pulserateloader/PulseRateLoader.vue';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs.vue';
import useBranching from "@/components/branching/hooks/useBranching";
import { getNavigationRoot } from "@/utils/BranchTools";

import CalculatorIcon from '@/assets/icons/homeMenu/calculator-icon.svg';
import { MyClarityCapacitator } from "my-clarity-capacitator-plugin";

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
  await loadViewData(`${COMPILED_DATA_PATH}/calculators_compiled.json`, views);
  
  setTimeout(() => { loading.value = false; }, 750);
})

const headingTitle = computed(() => {
  return views?.value?.[0]?.heading;
})

function onViewBeforeEnter(params: BranchViewParamData) {
  if (DEBUG) console.log(`Calculators.onViewBeforeEnter`, params);
  
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

  if ((params.view.layout === 'list' || params.view.layout === 'input')
    && (params.view.heading?.length !== 0 || params.view.title?.length !== 0)) {
      MyClarityCapacitator.setCurrentScreenName({
        id: params.view.heading! || params.view.title!
      });
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
          <span class="flex"><CalculatorIcon /></span>
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