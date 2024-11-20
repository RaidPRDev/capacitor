<script lang="ts">
export default {
  inheritAttrs: true,
  name: "Branching"
}   
const DEBUG = false;
</script>

<script lang="ts" setup>
import { ref, computed, useAttrs, onMounted, watch, nextTick, shallowRef, ComponentPublicInstance, onUnmounted } from 'vue';
import { useRoute, useRouter } from "vue-router";
import { APP_BODY_ID, TOP_HEADER_NAV_HEIGHT } from '@/_core/Constants';
import BaseButton from '@/ui/controls/BaseButton.vue';
import View from './components/BranchView.vue';
import BranchReferralPanel from './components/BranchReferralPanel.vue';

import { BranchRouteParams, BranchViewData, BranchViewParamData, DeviceBackButtonEventName, IDeviceBackButtonEvent } from '@/types';
import { findBranchParents } from '@/utils/BranchTools';
import useAppStore from '@/store/app.module';
import useToasterService from '@/ui/notifications/toaster/AppToastService';
import useFavoritesStore from '@/store/favorites.module';
import useBranchingStore from '@/store/branching.module';
import FavoriteAddedToast from "@/components/toasts/FavoriteAddedToast.vue";

import RestartIcon from '@/assets/icons/restart-icon.svg';
import FavoritesSmallIcon from '@/assets/icons/favorites-small-icon.svg';
import ChevronLeftIcon from '@/assets/icons/chevron-left-icon.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right-icon.svg';

// Component Props Setup
interface IBranchingProps {
  views: BranchViewData[];
  baseRoutePath?: string;
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
const contentElement = ref<InstanceType<typeof HTMLElement>>();
const branchReferralRef = ref<ComponentPublicInstance<typeof BranchReferralPanel>>()

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
  (e: 'onViewAction', data: BranchViewParamData): void
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
const branchingStore = useBranchingStore();
const { 
  addReferrallView, 
  getCurrentReferredView, 
  removeAllReferralViews,
  addViewHistory,
  getViewHistoryByID
} = branchingStore;
const appStore = useAppStore();

// Computed properties
const currentDataType = props?.views?.length > 0 ? props?.views?.[0].dataType : ""
const currentView = computed<BranchViewData | null>(() => props?.views?.length > 0 ? props?.views?.[currentViewIndex.value] : null);
const canGoBack = computed<boolean>(() => true);
const canGoNext = computed<boolean>(() => currentView?.value !== null && currentView?.value?.branchTo !== null);

const branchViewStyles = computed(() => {
  const adjustHeight = getWrapperMaskHeight();
  return adjustHeight;
});
const navigationStyles = computed(() => {
  if (!props?.useNavigation) return {}
  return { height: `${props?.navigationHeight}px` }
});

// State variables
let __routePrevPath = "";
const routePrevPath = ref<string>("");
const currentViewIndex = ref<number>(0);
const viewHistory = ref<number[]>([]);
const inTransition = ref<boolean>(false);
const isFavoritesEnabled = ref<boolean>(false);
const isFavoritesShowing = ref<boolean>(false);
const isAddedToFavorites = ref<boolean>(currentView?.value?.showFavorites!);

// Navigation Methods
function onDeviceBackButton(event: CustomEvent & IDeviceBackButtonEvent) {
  if (event) { goBack(); }  
}

function goBack() {
  if (DEBUG) console.log("Branching.goBack");
  
  const currentReferralView = getCurrentReferredView();
  if (currentReferralView !== null) {
    if (DEBUG) console.log("  branchReferralRef", branchReferralRef?.value);
    if (DEBUG) console.log("  routerFrom", branchingStore.$state.routerFrom);
   
    if (branchingStore.$state.routerFrom) {
      const fromRawId = branchingStore.$state.routerFrom?.params?.id as string;
      if (DEBUG) console.log("  fromRawId", fromRawId);

      const fromIdArr = fromRawId?.split("/");
      if (DEBUG) console.log("  fromIdArr", fromIdArr);
      
      const fromId = fromIdArr?.pop();
      if (DEBUG) console.log("  fromId", fromId);

      if (DEBUG) console.log("  fromId", fromId);

      if (DEBUG) console.log("  ReferredView", currentReferralView.id);
      if (DEBUG) console.log("  currentView", currentReferralView.id);
      if (fromId === currentReferralView.id) {
        if (DEBUG) console.log("  Views are the same");
        removeAllReferralViews();
        branchReferralRef?.value?.setMode("removed");
        nextTick(() => {
          if (DEBUG) console.warn("  Run Router.Go!")
          setTimeout(() => router.go(-1), 325);
        })
        return;
      }
    }
  }
  
  if (viewHistory.value?.length > 0) {
    if (DEBUG) console.log("  viewHistory", viewHistory.value);
    let curIdx = viewHistory.value.pop() as number;
    currentViewIndex.value = curIdx

    if (DEBUG) console.log("  currentViewIndex", curIdx);
  }
  
  router.go(-1);  
}

function goNext() {
  if (canGoNext.value) {
    viewHistory.value.push(currentViewIndex.value);
    handleNavigate(currentView?.value?.branchTo!);
  }
}

function handleNavigate(branchTo: string | null) {
  if (DEBUG) console.log("Branching.handleNavigate()", branchTo);
  if (DEBUG) console.log("  branchTo", branchTo);
  if (DEBUG) console.log("  scrollTop", contentElement?.value?.scrollTop);

  if (branchTo !== null) {
    
    if (currentView?.value) {
      addViewHistory({ id: currentView.value.id!, scrollPos: contentElement?.value?.scrollTop! });
    }

    // save previous view reference val
    viewHistory.value.push(currentViewIndex.value);

    // update current view index state to start render
    currentViewIndex.value = props?.views?.findIndex(view => {
      return view.id === branchTo
    });
    
    if (DEBUG) console.log("  currentViewIndex", currentViewIndex);
    if (DEBUG) console.log("  route", route);
    if (DEBUG) console.log("  router", router);

    __routePrevPath = `${route.fullPath}`;

    router.push({ path: `${route.path}/${branchTo}` });

    inTransition.value = true;
  }
}

function handleTriggered(dataProps: any) {
  if (DEBUG) {
    console.log("Branching.handleTriggered()", dataProps);
    console.log("  currentDataType", currentDataType);
    console.log("  currentView", currentView?.value);
  }
  
  if (!dataProps.hasOwnProperty("data-id")
    || !dataProps.hasOwnProperty("data-type")) {
    console.error("no data id or type");
    return;
  }
  
  if (!dataProps.hasOwnProperty("data-no-referral")) {
    // get root view
    const refferredRootView = getBranchRootView();

    addReferrallView({
      id: currentView?.value?.id, 
      dataType: currentDataType,
      title: refferredRootView?.title,
      subTitle: currentView?.value?.title || currentView?.value?.heading,
      fullPath: `${route.fullPath}`
    })
  }
  
  const dataType = dataProps['data-type'];
  const baseRoutePath = props?.baseRoutePath?.length! > 0 ? `/${props?.baseRoutePath}` : ``;
  if (DEBUG) console.log("  dataType", dataType);
  switch (dataType) {
    case "branchTo":
      viewHistory.value.push(currentViewIndex.value);
      handleNavigate(`${dataProps['data-id']}`);
    break;
    case "panic":
    case "equipment":
    case "checklists":
    case "ecmo":
    case "resources":
      if (currentView?.value) {
        addViewHistory({ id: currentView.value.id!, scrollPos: contentElement?.value?.scrollTop! });
      }
      router.push({ path: `${baseRoutePath}/${dataType}/${dataProps['data-id']}` });
    break;
  }
}

function getWrapperMaskHeight() {
  if (DEBUG) console.log("Branching.getWrapperMaskHeight()");
  let adjustedWidth = 0;
  let adjustedHeight = 0;
  
  if (props?.useNavigation) adjustedHeight += props?.navigationHeight;
  if (props?.listHeight > 0) adjustedHeight += props?.listHeight;

  // const rect = document.body?.getElementsByClassName("app-wrapper")[0]?.getBoundingClientRect();
  const rect = document.getElementById(APP_BODY_ID?.toLowerCase())?.getBoundingClientRect()!;
  const rectInner = document.body?.getElementsByClassName("inner-body")[0]?.getBoundingClientRect();

  adjustedWidth = rect?.width;  
  
  if (DEBUG) {
    console.log("  getWrapperMaskHeight.options");
    if (props?.useNavigation) console.log("  navigationHeight", props?.navigationHeight);
    if (props?.listHeight > 0) console.log("  listHeight", props?.listHeight);
    console.log("  rectInner.height", rectInner.height);
    console.log("  adjustedHeight", adjustedHeight);
    console.log(`  Height Result:`, `${rectInner.height - adjustedHeight}px`);
  }
  
  return {
    width: `${adjustedWidth}px`,
    height: `${rectInner.height - adjustedHeight}px`,
  };
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

function addToFavorites() {
  if (DEBUG) console.log("Branching.addToFavorites()");

  isFavoritesEnabled.value = false;

  nextTick(() => {

    const favoriteData = getFavoriteDataFromCurrentView();

    if (getItem(favoriteData?.id!)) {
      removeItem(favoriteData?.id!);
      nextTick(() => addToast({ label: `Removed from favorites.` }));
      isFavoritesEnabled.value = true;
      return;
    }

    if (DEBUG) console.log("  favoriteData", favoriteData);

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

function restartToRootView() {
  if (DEBUG) console.log("Branching.restartToRootView()");
  // The branch id is formatted in a way the will give us the Root View.  Ex: ELSOBA_PANIC_030__B__TERMD
  // Each section in the id is separated by double underscores `__`
  
  // get target root and check for base route 
  const targetRootView = getBranchRootView();
  const baseRoutePath = props?.baseRoutePath?.length! > 0 ? `/${props?.baseRoutePath}` : ``;

  if (DEBUG) console.log("  targetRootView", targetRootView);
  if (DEBUG) console.log("  baseRoutePath", baseRoutePath);
  if (DEBUG) console.log("  targetRoutePath", `${baseRoutePath}/${currentDataType}/${targetRootView.id}`);

  // build new target route and send
  router.push({ path: `${baseRoutePath}/${currentDataType}/${targetRootView.id}` });
}

function getBranchRootView() {
  // The first item is the Root View
  const id = currentView.value?.id;
  const idsArr = id?.split("__") as string[];
  const branchIndex = props?.views?.findIndex(view => view.id === idsArr[0]);
  const rootView = props?.views[branchIndex];

  return rootView;
}

function getFavoriteDataFromCurrentView() {
  if (DEBUG) console.log("Branching.getFavoriteDataFromCurrentView");
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
  
  appStore.setCurrentID(currentData?.view?.id!);

  // check if added to favorites
  const __isAddedToFavorites = getItem(currentData?.view?.id!) ? true : false;
  if (DEBUG) console.log("  __isAddedToFavorites", __isAddedToFavorites);
  if (DEBUG) console.log("  currentView", currentView?.value);
  
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
  
  // prevent from overwriting the previous route when refreshing.
  // refreshing causes the router to set it's route to / at init
  if (router.from?.fullPath != "/") {
    branchingStore.$patch({ routerFrom: {
      fullPath: router.from?.fullPath,
      params: router.from?.params,
      path: router.from?.path,
    }})
  }
}

function checkLastReferralScrollPosition() {
  // check last view scroll position
  if (DEBUG) console.log("getViewHistoryByID", getViewHistoryByID(currentView?.value?.id!));
  
  const lastScrollPos = getViewHistoryByID(currentView?.value?.id!)?.scrollPos;
  if (lastScrollPos! > 0 && contentElement.value) {
    setTimeout(() => {
      if (contentElement.value) {
        contentElement.value.scrollTo({
          top: lastScrollPos,
          behavior: 'smooth'
        });
        console.log("lastScrollPos", lastScrollPos);
      }
    }, 1000)
  }
}

watch(route, () => {

  // check last refferred view scroll position
  checkLastReferralScrollPosition();

}, { flush: "post" })

watch(route, (to, from) => {

  if (DEBUG) console.log("Branching.watch", route);
  if (DEBUG) console.log("  route.to", to);
  if (DEBUG) console.log("  route.from", from);
  if (DEBUG) console.log("  routePrevPath", routePrevPath.value);
  if (DEBUG) console.log("  __routePrevPath", __routePrevPath);
  if (DEBUG) console.log("  fullPath", route.fullPath);
  if (DEBUG) console.log("  back", router.options.history.state.back);
    
  if (!router.options.history.state.back) {
    if (DEBUG) console.log("  history.state.back", history.state.back);
    currentViewIndex.value = 0;
  }

  if (route.fullPath == __routePrevPath) {
    if (DEBUG) console.log("  route.fullPath and __routePrevPath match");
    
    if (route.params?.id) { 
      if (DEBUG) console.log("  route.params?.id", route.params?.id);
      
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
        if (DEBUG) console.log("  history.state.back", history.state.back);
        currentViewIndex.value = 0;
      }
    }
  }
  else {
    if (DEBUG) console.log("  route.fullPath and __routePrevPath do NOT match");

    if (route.params?.id) { 
      if (DEBUG) console.log("  route.params?.id", route.params?.id);
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
        if (DEBUG) console.log("  history.state.back", history.state.back);
        currentViewIndex.value = 0;
      }
    }
  }
  
}, { flush: "sync" })

onMounted(() => {
  if (DEBUG) console.log("Branching.onMounted");
  if (DEBUG) console.log("  branchId", props.branchRoute?.branchId);

  if (props.branchRoute && props.branchRoute.branchId) {
    // update current view index state to start render

    const idx = props?.views?.findIndex(view => {
      return view.id === props.branchRoute?.branchId
    });
    const currentData = getCurrentViewDataByIndex(idx);
    if (DEBUG) console.log("  currentData", currentData);
    currentViewIndex.value = idx;
  }
  else {
    currentViewIndex.value = 0;
  }

  // check last refferred view scroll position
  checkLastReferralScrollPosition();
  
  // Add an device back button event listener
  document.addEventListener(DeviceBackButtonEventName, onDeviceBackButton as EventListener);
})

onUnmounted(() => {
  document.removeEventListener(DeviceBackButtonEventName, onDeviceBackButton as EventListener);
})

</script>

<template>
  <div 
    ref="element"
    class="branching flex flex-column height-inherit" 
    v-bind="{ ...attrs }"
    :style="branchViewStyles"
  >
    <div 
      ref="contentElement"
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

      <Teleport to="#__app_body__">
        <BranchReferralPanel ref="branchReferralRef" :baseRoutePath="baseRoutePath" />
      </Teleport>

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
            @triggered="restartToRootView"
          />

          <BaseButton 
            v-else-if="currentView?.branchTo"
            class="variant-red small" 
            innerClassName="pxlr-13 pxtb-9 justify-between"
            bodyClassName="text-left"
            :label="`Next`"
            :accessoryIcon="ChevronRightIcon"
            :disabled="!canGoNext"
            @triggered="goNext"
          />
        </transition>

        
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
