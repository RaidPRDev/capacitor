<script lang="ts">
export default {
  inheritAttrs: false
}
const DEBUG = false; 
</script>

<script setup lang="ts">
import { ComponentPublicInstance, computed, inject, onMounted, ref, shallowRef } from "vue";
import { storeToRefs } from "pinia";

import { 
  APP_DRAWERS_ID,
  APP_ID,
  BRANCH_HEADER_HEIGHT, 
  BREADCRUMB_HEIGHT, 
  COMPILED_DATA_PATH, 
  GLOBAL_PADDING 
} from "@/_core/Constants";

import BasePanel from '@/ui/panels/BasePanel.vue';
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import Branching from '@/components/branching/Branching.vue';
import PulseRateLoader from '@/components/pulserateloader/PulseRateLoader.vue';
import Breadcrumbs from '@/components/breadcrumbs/Breadcrumbs.vue';
import useBranching from "@/components/branching/hooks/useBranching";
import { IBaseScreenSlotProps } from "@/ui/types";
import { BranchRouteProps, BranchViewData, BranchViewParamData, IApp, IAppDrawerComponents } from "@/types";
import { loadViewData } from "@/components/branching/data/DataTools";
import { getNavigationRoot } from "@/utils/BranchTools";
import useSession from "@/store/session.module";

import WrenchIcon from '@/assets/icons/homeMenu/wrench-icon.svg';
import { MyClarityCapacitator } from "my-clarity-capacitator-plugin";
import SectionDisclaimerPanel from "@/components/panels/SectionDisclaimerPanel.vue";
import { EVENT_REGISTRATION_CLOSE } from "@/events/Events";

// Component Props Setup
const props = withDefaults(defineProps<IBaseScreenSlotProps & BranchRouteProps>(), {});
const app = inject<IApp>(APP_ID) as IApp;
const drawerComponents = inject<IAppDrawerComponents>(APP_DRAWERS_ID) as IAppDrawerComponents;
const loading = ref<boolean>(true);
const views = shallowRef<BranchViewData[]>([]);
const branchingRef = ref<ComponentPublicInstance<typeof Branching>>()

const session = useSession();
const { findDisclaimer } = session;
const { hasRegistered, hasCompletedDisclaimer } = storeToRefs(session);
const sectionViewData = ref<BranchViewData>();

const { 
  baseHeight, 
  breadcrumbs,
  changeView,
} = useBranching({
  branchingRef: branchingRef
})

onMounted(async () => {
  await loadViewData(`${COMPILED_DATA_PATH}/equipment_compiled.json`, views);
  
  setTimeout(() => { loading.value = false; }, 750);
})

const headingTitle = computed(() => {
  return views?.value?.[0]?.heading;
})

function onViewBeforeEnter(params: BranchViewParamData) {
  if (DEBUG) console.log(`Equipment.onViewBeforeEnter`, params);
  
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

  if ((params.view.heading?.length !== 0 || params.view.title?.length !== 0)) {
      MyClarityCapacitator.setCurrentScreenName({
        id: params.view.heading! || params.view.title!
      });
  }

  sectionViewData.value = params.view;
  
  // Check if Current Section has a disclaimer
  if (params.view.disclaimer) {
    const canShowDisclaimer = hasRegistered.value && hasCompletedDisclaimer.value;
    if (canShowDisclaimer) {
      showDisclaimerByID(sectionViewData.value.id!);
    }
    else {
      document.body.addEventListener(EVENT_REGISTRATION_CLOSE, onRegistrationClosedEvent);
    }
  }
}

function onRegistrationClosedEvent() {
  document.body.removeEventListener(EVENT_REGISTRATION_CLOSE, onRegistrationClosedEvent);

  if (!sectionViewData.value) return;

  showDisclaimerByID(sectionViewData.value.id!);
}

function showDisclaimerByID(id: string) {
  if (!findDisclaimer(id)) {
    drawerComponents.bottom = SectionDisclaimerPanel;
    app.drawers.bottom.closeOutside = false;
    app.drawers.bottom.open = !app.drawers.bottom.open;
    app.drawers.bottom.data = {
      id: sectionViewData.value?.id,
      html: sectionViewData.value?.disclaimer,
    }
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
          <span class="flex"><WrenchIcon /></span>
        </template>
      </BaseHeader>
      <BaseHeader class="screen-breadcrumbs pxlr-20 mxb-0 height-auto">
        <template v-slot:headerLeft>
          <Breadcrumbs v-bind="breadcrumbs" @triggered="changeView" />
        </template>
      </BaseHeader>
      <Branching 
        ref="branchingRef"
        viewClassName="data-content pxlr-0 pxt-20 pxb-20" 
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