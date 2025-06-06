<script lang="ts">
export default {
  inheritAttrs: false
}   
const DEBUG = false;
</script>

<script setup lang="ts">
import { ComponentPublicInstance, onMounted, ref, shallowRef } from "vue";

import { 
  COMPILED_DATA_PATH,
  BRANCH_HEADER_HEIGHT, 
  SCREEN_BODY_BOTTOM_PADDING 
} from "@/_core/Constants";

import BasePanel from '@/ui/panels/BasePanel.vue';
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import Branching from '@/components/branching/Branching.vue';
import useBranching from "@/components/branching/hooks/useBranching";
import { BranchRouteProps, BranchViewData, BranchViewParamData } from "@/types";
import { IBaseScreenSlotProps } from "@/ui/types";
import { loadViewData } from "@/components/branching/data/DataTools";
import { getNavigationRoot } from "@/utils/BranchTools";
import PulseRateLoader from '@/components/pulserateloader/PulseRateLoader.vue';

import MedicalBedIcon from '@/assets/icons/homeMenu/medical-bed-icon.svg';
import { MyClarityCapacitator } from "my-clarity-capacitator-plugin";

// Component Props Setup
const props = withDefaults(defineProps<IBaseScreenSlotProps & BranchRouteProps>(), {}) 

const loading = ref<boolean>(true);
const showMainHeader = ref<boolean>(true);
const views = shallowRef<BranchViewData[]>([]);
const branchingRef = ref<ComponentPublicInstance<typeof Branching>>()
  
const { 
  baseHeight, 
} = useBranching({
  branchingRef: branchingRef,
  extraHeight: 0,
  overrideHeight: 0
})

onMounted(async () => {
  await loadViewData(`${COMPILED_DATA_PATH}/ecmo_compiled.json`, views);

  setTimeout(() => { 
    loading.value = false; 
  }, 750);
})

function onViewLeave(params: BranchViewParamData) {
  if (DEBUG) console.log(`Panic.onViewLeave`, params);
  
  const rootInfo = getNavigationRoot(params);
  
  // hide header if not in root view
  if (!rootInfo.isViewRoot) showMainHeader.value = false;
}

function onViewBeforeEnter(params: BranchViewParamData) {
  if (DEBUG) console.log(`Panic.onViewBeforeEnter`, params);
  
  const rootInfo = getNavigationRoot(params);
  
  // show/hide header if not in root view
  showMainHeader.value = rootInfo.isViewRoot;

  if (rootInfo.isViewRoot) {
    baseHeight.value = BRANCH_HEADER_HEIGHT + SCREEN_BODY_BOTTOM_PADDING;
  }
  else {
    baseHeight.value = 0;
  }

  if ((params.previousView?.dataType === 'ecmo')
    && (params.view.heading?.length !== 0)) {
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
        <transition name="fade" appear mode="out-in">
          <BaseHeader v-if="showMainHeader" class="screen-heading pxlr-20 mxb-20 height-auto">
            <template v-slot:headerLeft>
              <h1 class="screen-title">{{`Assess ECMO Candidacy`}}</h1>
            </template>
            <template v-slot:headerRight>
              <span class="flex icon"><MedicalBedIcon /></span>
            </template>
          </BaseHeader>
        </transition>
        
        <Branching 
          ref="branchingRef"
          viewClassName="data-content pxlr-20 pxt-10 pxb-20" 
          :baseRoutePath="`home`"
          :branchRoute="props.branchRoute"
          :views="views" 
          :useNavigation="true"
          :listHeight="baseHeight"
          @onViewLeave="onViewLeave"
          @onViewBeforeEnter="onViewBeforeEnter"
        />
      </div>
    </transition>
   </BasePanel>

</template>

<style scoped lang="scss"></style>