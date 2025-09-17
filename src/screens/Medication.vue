<script lang="ts">
export default {
  inheritAttrs: false
}   
const DEBUG = false;
</script>

<script setup lang="ts">
import { ComponentPublicInstance, computed, inject, onMounted, ref, shallowRef } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";

import { 
  APP_DRAWERS_ID,
  APP_ID,
  BRANCH_HEADER_HEIGHT, 
  BREADCRUMB_HEIGHT, 
  COMPILED_DATA_PATH, 
  GLOBAL_PADDING 
} from "@/_core/Constants";

import { IApp, IAppDrawerComponents,  } from "@/types";
import BasePanel from '@/ui/panels/BasePanel.vue';
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import Branching from '@/components/branching/Branching.vue';
import PulseRateLoader from '@/components/pulserateloader/PulseRateLoader.vue';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs.vue';
import useBranching from "@/components/branching/hooks/useBranching";
import { IBaseScreenSlotProps } from "@/ui/types";
import { BranchRouteProps, BranchViewData, BranchViewParamData } from "@/types";
import { loadViewData } from '@/components/branching/data/DataTools';
import { getNavigationRoot } from "@/utils/BranchTools";
// import { MyClarityCapacitator } from "my-clarity-capacitator-plugin";
import DisclaimerMedicalPanel from "@/components/panels/DisclaimerMedicalPanel.vue";
import useSession from "@/store/session.module";

import TimePillIcon from '@/assets/icons/homeMenu/time-pill-icon.svg';

// Component Props Setup
const props = withDefaults(defineProps<IBaseScreenSlotProps & BranchRouteProps>(), {}) 
const app = inject<IApp>(APP_ID) as IApp;
const drawerComponents = inject<IAppDrawerComponents>(APP_DRAWERS_ID) as IAppDrawerComponents;
const loading = ref<boolean>(true);
const views = shallowRef<BranchViewData[]>([]);
const branchingRef = ref<ComponentPublicInstance<typeof Branching>>()

const session = useSession();
const { hasCompletedMedDisclaimer } = storeToRefs(session);

const route = useRoute();
const router = useRouter();

const { 
  baseHeight, 
  breadcrumbs,
  changeView,
} = useBranching({
  branchingRef: branchingRef
})

onMounted(async () => {
  await loadViewData(`${COMPILED_DATA_PATH}/medications_compiled.json`, views);
  
  setTimeout(() => { 
    loading.value = false; 

    if (!hasCompletedMedDisclaimer.value) {
      drawerComponents.bottom = DisclaimerMedicalPanel;
      app.drawers.bottom.closeOutside = false;
      app.drawers.bottom.open = !app.drawers.bottom.open;
    }

    if (route?.query?.id && isNaN(parseInt(route?.query?.childId! as string))) {
      router.replace({ path: `/home/medications/${route?.query?.id}` });
    }   
    
  }, 750);
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

  // if ((params.view.heading?.length !== 0 || params.view.title?.length !== 0)) {
  //   MyClarityCapacitator.setCurrentScreenName({
  //     id: params.view.heading! || params.view.title!
  //   });
  // }
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
        viewClassName="medications data-content pxlr-0 pxt-20 pxb-20" 
        :baseRoutePath="`home`"
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