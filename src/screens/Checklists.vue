<script lang="ts">
export default {
  inheritAttrs: false
}   
const DEBUG = false;
</script>

<script setup lang="ts">
import { ComponentPublicInstance, computed, onMounted, ref, shallowRef, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { 
  COMPILED_DATA_PATH,
  BRANCH_HEADER_HEIGHT, 
  BREADCRUMB_HEIGHT, 
  GLOBAL_PADDING 
} from "@/_core/Constants";

import { MyClarityCapacitator } from "my-clarity-capacitator-plugin";
import BasePanel from '@/ui/panels/BasePanel.vue';
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import Branching from '@/components/branching/Branching.vue';
import PulseRateLoader from '@/components/pulserateloader/PulseRateLoader.vue';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs.vue';
import useBranching from "@/components/branching/hooks/useBranching";
import { IBaseScreenSlotProps } from "@/ui/types";
import { BranchRouteProps, BranchViewData, BranchViewParamData } from "@/types";
import { loadViewData } from "@/components/branching/data/DataTools";
import { getNavigationRoot } from "@/utils/BranchTools";

import ChecklistIcon from '@/assets/icons/homeMenu/checklist-icon.svg';

// Component Props Setup
const props = withDefaults(defineProps<IBaseScreenSlotProps & BranchRouteProps>(), {}) 

const loading = ref<boolean>(true);
const views = shallowRef<BranchViewData[]>([]);
const branchingRef = ref<ComponentPublicInstance<typeof Branching>>()
const showMainHeader = ref<boolean>(true);

const route = useRoute();
const router = useRouter();
// const itemID = route?.query?.id;
// const childID = parseInt(route?.query?.childId! as string);
// console.log("itemID", itemID);
// console.log("childID", childID);
// console.log("query", route?.query);

const { 
  baseHeight, 
  breadcrumbs,
  changeView,
} = useBranching({
  branchingRef: branchingRef,
  extraHeight: 0,
  overrideHeight: 0
})

// if we have am incoming query, replace route...
watch(route, () => {
  if (route?.query?.id && isNaN(parseInt(route?.query?.childId! as string))) {
    
    router.replace({ path: `/home/checklists/${route?.query?.id}` });
  }
  else {
    if (route?.query?.id && !isNaN(parseInt(route?.query?.childId! as string))) {
      console.warn("getCurrentView", (branchingRef.value as unknown as any).getCurrentView())
      console.warn("getCurrentViewIndex", (branchingRef.value as unknown as any).getCurrentViewIndex())
      emitChecklistRoute(route?.query?.childId as string, route?.query?.id as string, views);
    }
  }

  
}, { flush: "post" })

function emitChecklistRoute(childId: string, id: string, data: any) {
  console.warn("emitChecklistRoute")
  const event = new CustomEvent('onChecklistRoute', {
    detail: { childId, id, data },
    bubbles: true, // allows the event to bubble up the DOM
    composed: true, // allows it to cross Shadow DOM boundary if needed
  });

  // Dispatch from a known element, e.g., document or a component root
  document.dispatchEvent(event);
}

onMounted(async () => {
  await loadViewData(`${COMPILED_DATA_PATH}/checklists_compiled.json`, views);

  setTimeout(() => { 
    loading.value = false; 
  }, 750);
})

const headingTitle = computed(() => {
  return views?.value?.[0]?.heading;
})

function onViewLeave(params: BranchViewParamData) {
  if (DEBUG) console.log(`Checklist.onViewLeave`, params);
  
  const rootInfo = getNavigationRoot(params);
  
  // hide header if not in root view
  if (!rootInfo.isViewRoot) showMainHeader.value = false;
}


function onViewBeforeEnter(params: BranchViewParamData) {
  if (DEBUG) console.log(`Checklist.onViewBeforeEnter`, params);
  
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

  if ((params.view.layout === 'list' || params.view.layout === 'checklist')
    && (params.view.heading?.length !== 0 || params.view.title?.length !== 0)) {
      MyClarityCapacitator.setCurrentScreenName({
        id: params.view.heading! || params.view.title!
      });
  }
}

</script>

<template>
<BasePanel v-bind="props" class="checklist pxl-0 pxr-0">
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
          <span class="flex"><ChecklistIcon /></span>
        </template>
      </BaseHeader>
      <BaseHeader class="screen-breadcrumbs pxlr-20 mxb-0 height-auto">
        <template v-slot:headerLeft>
          <Breadcrumbs v-bind="breadcrumbs" @triggered="changeView" />
        </template>
      </BaseHeader>
      <Branching 
        ref="branchingRef"
        viewClassName="data-content pxlr-20 pxt-20 pxb-20" 
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

<style scoped lang="scss">
// .branching {
//   transition: all 450ms ease-in;
// }

</style>