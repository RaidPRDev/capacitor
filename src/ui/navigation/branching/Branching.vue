<script lang="ts">
export default {
  inheritAttrs: true,
  name: "Branching"
}   
const DEBUG = false;
</script>

<script lang="ts" setup>
import { ref, computed, useAttrs, onMounted, watch, nextTick, shallowRef } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { TOP_HEADER_NAV_HEIGHT } from '@/Constants';
import BaseButton from '@/ui/controls/BaseButton.vue';
import View from './components/BranchView.vue';
import { BranchRouteParams, BranchViewData, BranchViewParamData } from './types';
import { findBranchParents } from './tools';
import useToasterService from '@/ui/notifications/toaster/AppToastService';
import useFavoritesStore from '@/store/favorites.module';
import FavoriteAddedToast from "@/components/toasts/FavoriteAddedToast.vue";

import RestartIcon from '@/assets/icons/restart-icon.svg';
import FavoritesSmallIcon from '@/assets/icons/favorites-small-icon.svg';
import ChevronLeftIcon from '@/assets/icons/chevron-left-icon.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right-icon.svg';

interface IBranchingProps {
  views: BranchViewData[];
  jumpToViewId?: BranchViewData;
  branchRoute?: BranchRouteParams
  useNavigation?: boolean;
  navigationHeight?: number;
  listHeight?: number;
  viewClassName?: string;
}

const props = withDefaults(defineProps<IBranchingProps>(), {
  useNavigation: true,
  navigationHeight: TOP_HEADER_NAV_HEIGHT,
  listHeight: 0
});

// Attributes and Slots Setup
const attrs = useAttrs();
const element = ref<InstanceType<typeof HTMLElement>>();

 // Expose Definitions
defineExpose({
  element: () => element.value as HTMLElement,
  navigateBack: () => goBack(),
  getCurrentViewIndex: () => currentViewIndex.value,
  getCurrentView: () => currentView.value,
  goToBranchByID: (id: string) => {
    handleNavigate(id);
  },
})

// Emission Event Setup
const emit = defineEmits<{
  (e: 'onViewRendered', data: BranchViewParamData): void
  (e: 'onViewChanged', data: BranchViewParamData): void
  (e: 'onViewLeave', data: BranchViewParamData): void
  (e: 'onViewBeforeEnter', data: BranchViewParamData): void
}>()

const router = useRouter();
const route = useRoute();
const favoritesStore = useFavoritesStore();
const { getItem, setItem, removeItem } = favoritesStore;
const toasterService = useToasterService();
const { addToast } = toasterService;

// State variables
const currentViewIndex = ref<number>(0);
const viewHistory = ref<number[]>([]);
const inTransition = ref<boolean>(false);
const isFavoritesEnabled = ref<boolean>(false);
const isFavoritesShowing = ref<boolean>(false);

// Computed properties
const currentView = computed<BranchViewData | null>(() => props?.views?.length > 0 ? props?.views?.[currentViewIndex.value] : null);
const canGoBack = computed<boolean>(() => true);
const canGoNext = computed<boolean>(() => currentView?.value !== null && currentView?.value?.branchTo !== null);

const isAddedToFavorites = ref<boolean>(currentView?.value?.showFavorites!);

const navigationStyles = computed(() => {
  if (!props?.useNavigation) return {}
  
  return { height: `${props?.navigationHeight}px` }
})

const branchViewStyles = computed(() => {
  const adjustHeight = getWrapperMaskHeight();
  
  if (inTransition.value) {
    return {
      ...adjustHeight,
    };
  }

  return {
    ...adjustHeight
  };
})

function getWrapperMaskHeight() {
  if (DEBUG) console.log("Branching.getWrapperMaskHeight");
  let adjustedWidth = 0;
  let adjustedHeight = 0;
  
  if (props?.useNavigation) adjustedHeight += props?.navigationHeight;
  if (props.listHeight > 0) adjustedHeight += props?.listHeight;

  const rect = document.body?.getElementsByClassName("app-wrapper")[0]?.getBoundingClientRect();
  const rectInner = document.body?.getElementsByClassName("inner-body")[0]?.getBoundingClientRect();

  adjustedWidth = rect?.width;  
  
  if (DEBUG) {
    console.log("Branching.getWrapperMaskHeight.options");
    if (props?.useNavigation) console.log("navigationHeight", props?.navigationHeight);
    if (props.listHeight > 0) console.log("listHeight", props?.listHeight);
    console.log("rectInner.height", rectInner.height);
    console.log("adjustedHeight", adjustedHeight);
    console.log(`Height Result:`, `${rectInner.height - adjustedHeight}px`);
  }
  

  return {
    width: `${adjustedWidth}px`,
    height: `${rectInner.height - adjustedHeight}px`,
  };
}

// Methods
function goBack() {
  if (viewHistory.value?.length > 0) {
    if (DEBUG) console.log("goBack.viewHistory", viewHistory.value);
    let curIdx = viewHistory.value.pop() as number;
    currentViewIndex.value = curIdx

    if (DEBUG) console.log("goBack.currentViewIndex", curIdx);

    router.go(-1);  
    return;
  }
  
  router.go(-1);  
}

function goNext() {
  if (canGoNext.value) {
    viewHistory.value.push(currentViewIndex.value);
    currentViewIndex.value = props?.views?.findIndex(view => view.id == currentView?.value?.branchTo);
  }
}

function handleNavigate(branchTo: string | null) {
  if (DEBUG) console.log("Branching.handleNavigate.branchTo", branchTo)

  if (branchTo !== null) {
    
    // save previous view reference val
    viewHistory.value.push(currentViewIndex.value);
    
    // update current view index state to start render
    currentViewIndex.value = props?.views?.findIndex(view => {
      return view.id === branchTo
    });
    
    if (DEBUG) console.log("Branching.handleNavigate.currentViewIndex", currentViewIndex)
    if (DEBUG) console.log("route", route)
    if (DEBUG) console.log("router", router)

    __routePrevPath = `${route.fullPath}`;

    router.push({ path: `${route.path}/${branchTo}` });

    inTransition.value = true;
  }
}

function handleTriggered(dataProps: any) {
  console.log("From Branching", dataProps);

  if (!dataProps.hasOwnProperty("data-id")
    || !dataProps.hasOwnProperty("data-type")) {
    console.error("no data id or type")
    return;
  }
  
  let dataType = dataProps['data-type'];
  console.log("From dataType", dataType);
  switch (dataType) {
    case "panic":
      router.push({ path: `/home/${dataType}/${dataProps['data-id']}` });
    break;
    case "checklists":
      router.push({ path: `/home/${dataType}/${dataProps['data-id']}` });
    break;
  }
}

/**
 * get the view's branch data and other options
 */
function getCurrentViewData() {
  
  // get previous index from history
  let __prevIdx = 0;
  if (viewHistory.value.length > 1) 
    __prevIdx = viewHistory.value[viewHistory.value.length - 1];
  
  // save view and previous view
  const view = props?.views[currentViewIndex.value];
  const previousView = props?.views[__prevIdx];

  const breadcrumbData = findBranchParents(props?.views, view?.id);

  return {
    selectedIndex: currentViewIndex.value,
    previousViewIndex: __prevIdx,
    previousView: previousView,
    view: view,
    breadcrumbData: { items: breadcrumbData }
  }
}

/**
 * get the view's branch data and other options
 */
function getCurrentViewDataByIndex(curViewIndex: number) {
  
  // get previous index from history
  let __prevIdx = 0;
  if (viewHistory.value.length > 1) 
    __prevIdx = viewHistory.value[viewHistory.value.length - 1];
  
  // save view and previous view
  const view = props?.views[curViewIndex];
  const previousView = props?.views[__prevIdx];

  const breadcrumbData = findBranchParents(props?.views, view?.id);

  return {
    selectedIndex: curViewIndex,
    previousViewIndex: __prevIdx,
    previousView: previousView,
    view: view,
    breadcrumbData: { items: breadcrumbData }
  }
}

/**
 * Transition Events
 */
function onViewLeave() {
  isFavoritesShowing.value = false;

  const currentData = getCurrentViewData();
  if (DEBUG) console.log("Branching.onViewLeave", currentData)
  emit("onViewLeave", currentData)
}

function onViewBeforeEnter() {
  const currentData = getCurrentViewData();
  if (DEBUG) console.log("Branching.onViewBeforeEnter", currentData);
  emit("onViewBeforeEnter", currentData);
  
  // check if added to favorites
  const __isAddedToFavorites = getItem(currentData?.view?.id!) ? true : false;
  if (DEBUG) console.log("Branching.__isAddedToFavorites", __isAddedToFavorites);
  if (DEBUG) console.log("Branching.currentView", currentView?.value);
  
  isAddedToFavorites.value = !isAddedToFavorites ? false : true;

  if (__isAddedToFavorites) {
    isFavoritesEnabled.value = false;
  }
  else isFavoritesEnabled.value = true;
}

function onViewRendered() {
  const currentData = getCurrentViewData();
  if (DEBUG) console.log("Branching.onViewRendered", currentData);
  emit("onViewRendered", currentData);

  // transition completed
  inTransition.value = false;

  isFavoritesShowing.value = true;
}

onMounted(() => {
  if (DEBUG) console.log("Branching.branchRoute", props.branchRoute);
  if (DEBUG) console.log("Branching.branchId", props.branchRoute?.branchId);

  if (props.branchRoute && props.branchRoute.branchId) {
    // update current view index state to start render

    const idx = props?.views?.findIndex(view => {
      return view.id === props.branchRoute?.branchId
    });
    const currentData = getCurrentViewDataByIndex(idx);
    if (DEBUG) console.log("Branching.currentData", currentData);
    currentViewIndex.value = idx;
  }
  else {
    currentViewIndex.value = 0;
  }
})

const routePrevPath = ref<string>("");
let __routePrevPath = "";
watch(route, (to, from) => {

  if (DEBUG) console.error("Branching.route.to", to);
  if (DEBUG) console.error("Branching.route.from", from);
  if (DEBUG) console.error("Branching.routePrevPath", routePrevPath.value);
  if (DEBUG) console.error("Branching.__routePrevPath", __routePrevPath);
  if (DEBUG) console.error("Branching.fullPath", route.fullPath);
  if (DEBUG) console.error("Branching.back", router.options.history.state.back);

  if (!router.options.history.state.back) {
    if (DEBUG) console.error("Branching.NO ROUTE BACK!!!");
    currentViewIndex.value = 0;
  }

  if (route.fullPath == __routePrevPath) {
    if (DEBUG) console.error("Branching.SAME ROUTE!!!");
    
    if (route.params?.id) { 
      if (DEBUG) console.error("Branching.HAD ROUTE ID!!!");
      
      // let routeViewId = "", parsedParams: any = {};
      if (route.params?.id) {
        const routesFromParams = (route?.params?.id as string).split("/")
        const parentRoute = routesFromParams[0] as string;
        routesFromParams.shift();

        let branchId = (routesFromParams.length >= 1) ? routesFromParams[routesFromParams.length - 1] : parentRoute;
        currentViewIndex.value = props?.views?.findIndex(view => {
          return view.id === branchId
        });
      }
      return;
    }
    else {
      if (router.options.history.state.back) {
        if (DEBUG) console.error("Branching.NO ROUTE BACK!!!");
        currentViewIndex.value = 0;
      }
    }
  }
  else {
    if (DEBUG) console.error("Branching.CHANGING ROUTE!!!");

    if (route.params?.id) { 
      if (DEBUG) console.error("Branching.HAD ROUTE ID!!!", route.params?.id);
      const routesFromParams = (route?.params?.id as string).split("/")
      const parentRoute = routesFromParams[0] as string;
      routesFromParams.shift();

      let branchId = (routesFromParams.length >= 1) ? routesFromParams[routesFromParams.length - 1] : parentRoute;
      currentViewIndex.value = props?.views?.findIndex(view => {
        return view.id === branchId
      });
    }
    else {
      if (router.options.history.state.back) {
        if (DEBUG) console.error("Branching.NO ROUTE BACK!!!");
        currentViewIndex.value = 0;
      }
    }
  }

}, { flush: "sync" })

function addToFavorites() {
  if (DEBUG) console.log("Branching.addToFavorites");

  isFavoritesEnabled.value = false;

  nextTick(() => {

    const favoriteData = getFavoriteDataFromCurrentView()

    if (getItem(favoriteData?.id!)) {
      removeItem(favoriteData?.id!);
      nextTick(() => addToast({ label: `Removed from favorites.` }));
      isFavoritesEnabled.value = true;
      return;
    }

    if (DEBUG) console.log("Branching.favoriteData", favoriteData);

    setItem({
      type: `${favoriteData.dataType}`,
      data: {
        id: favoriteData?.id!,
        title: favoriteData?.title!,
      },
      parentData: {
        id: favoriteData?.parentId!,
        title: favoriteData?.parentTitle!,
      },
    });
    nextTick(() => addToast({ 
      component: shallowRef(FavoriteAddedToast),
      componentProps: {
        label: `Added to favorites.` 
      }
    }));
  })

  
}

function restart() {
  const id = currentView.value?.id;
  const splt = id?.split("__") as string[];
  
  const branchIndex = props?.views?.findIndex(view => {
    return view.id === splt[0]
  });
  currentViewIndex.value = branchIndex;
}

function getFavoriteDataFromCurrentView() {
  if (DEBUG) console.log("getFavoriteDataFromCurrentView");
  const id = currentView.value?.id;
  const splt = id?.split("__") as string[];
  const parentSecId = splt[0]; // parent id
  
  const dataType = props?.views[0]?.dataType;
  if (DEBUG) console.log("  dataType", dataType);

  const parentBranch = props?.views?.find(view => {
    return view.id === parentSecId
  });
  if (DEBUG) console.log("  parentBranch", parentBranch);

  return {
    dataType: dataType,
    id: id,
    title: currentView.value?.title || currentView.value?.heading,
    parentId: parentSecId,
    parentTitle: parentBranch?.title || parentBranch?.heading,
  }
}

</script>

<template>
  <div 
    ref="element"
    class="branching flex flex-column height-inherit" 
    v-bind="{ ...attrs }"
    :style="branchViewStyles"
  >
    <div 
      class="relative height-inherit set-scroll" 
      :class="[{ ['overflow-v-scroll-show']: true }]" 
    >
      <transition 
        name="fade" 
        mode="out-in" 
        appear
        @beforeLeave="onViewLeave"
        @beforeEnter="onViewBeforeEnter"
        @afterEnter="onViewRendered"
      >
        <View 
          :key="`${currentViewIndex}_${currentView?.id}_${route?.fullPath}`"
          :view="currentView" 
          @navigate="handleNavigate" 
          @triggered="handleTriggered"
          :class="[viewClassName, {
            ['remove-top-padding']: currentView?.isRootParent
          }]" 
        />
      </transition>
    </div>

    <div 
      v-if="props?.useNavigation" 
      class="branch-navigation absolute bx-0 bg-transparent flex justify-center align-center pxlr-20 width-100" 
      :style="navigationStyles"
    >
      <div class="inner-navigation flex justify-between width-100 pxlr-10">
        <BaseButton 
          class="variant-red small" 
          innerClassName="pxlr-13 pxtb-9 justify-between"
          bodyClassName="text-left"
          :label="`Back`"
          :icon="ChevronLeftIcon"
          :disabled="!canGoBack"
          @triggered="goBack"
        />

        <div v-if="currentView?.showFavorites && isFavoritesShowing">
          <transition 
            name="fade" 
            mode="out-in"
            :appear="isFavoritesShowing"
          >
            <BaseButton 
              v-if="isFavoritesEnabled"
              class="variant-red small" 
              innerClassName="pxlr-13 pxtb-9 justify-between gapx-6"
              bodyClassName="text-left"
              :label="`Add To Favorites`"
              :icon="FavoritesSmallIcon"
              @triggered="addToFavorites"
            />
            <BaseButton 
              v-else
              class="remove-favorite-btn variant-blue small" 
              innerClassName="pxlr-13 pxtb-9 justify-between gapx-6"
              bodyClassName="text-left"
              :label="`Remove`"
              :icon="FavoritesSmallIcon"
              @triggered="addToFavorites"
            />
          </transition>

        </div>
        
        <transition 
          name="fade" 
          mode="out-in" 
          appear
        >
          <BaseButton 
            v-if="currentView?.showRestart"
            class="variant-red small" 
            innerClassName="pxlr-13 pxtb-9 justify-between gapx-6"
            bodyClassName="text-left"
            :label="`Start Over`"
            :icon="RestartIcon"
            @triggered="restart"
          />
        </transition>

        <BaseButton 
          v-if="currentView?.branchTo"
          class="variant-red small" 
          innerClassName="pxlr-13 pxtb-9 justify-between"
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
.branching {
  :deep(.branch-view) {
    &.remove-top-padding {
      padding-top: 0;
    }
  }
}

.branch-view-wrapper {
  @include use-scroller-styles();
}

.remove-favorite-btn {
  :deep(.inner-base-button) {
    .ui-label {
      font-size: 14px;
      line-height: 15px;
      text-transform: uppercase;
      font-weight: 600;
    }
  }
}

</style>
