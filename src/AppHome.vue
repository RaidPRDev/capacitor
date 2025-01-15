<script lang="ts">
export default {
  inheritAttrs: true,
  name: "AppHome"
}   
</script>

<script setup lang="ts">
import { EVENT_DISCLAIMER_CLOSE } from "@/events/Events";
import { 
  APP_DRAWERS_ID, 
  APP_HEADER_HEIGHT, 
  APP_ID, 
  BOTTOM_HEADER_NAV_HEIGHT, 
  SCREEN_BODY_TOP_PADDING
} from "@/_core/Constants";
import { ComponentPublicInstance, computed, ref, VueElement, inject, shallowRef, nextTick, onMounted, onUnmounted } from "vue";
import { RouteLocationGeneric, useRouter } from "vue-router";
import { storeToRefs } from 'pinia';

import { IButtonGroupSelected } from "@/ui/types";
import { IApp, IAppDrawerComponents, IAppScreenProps,  } from "@/types";

import BaseScreen from "@/ui/panels/BaseScreen.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import ButtonGroup from "@/ui/controls/ButtonGroup.vue";
import useSession from '@/store/session.module';
import useBranchingStore from '@/store/branching.module';

import AppSideMenuPanel from "@/components/panels/AppSideMenuPanel.vue";
import AppSearchPanel from "@/components/panels/AppSearchPanel.vue";
import AppAlertPanel from '@/components/panels/AppAlertPanel.vue';
import DisclaimerPanel from "@/components/panels/DisclaimerPanel.vue";
import RegistrationPanel from "./components/panels/RegistrationPanel.vue";

import { MyClarityCapacitator } from "my-clarity-capacitator-plugin";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

import Logo from '/assets/elso_logo.png';
import MenuIcon from '@/assets/icons/menu-icon.svg';
import SearchIcon from '@/assets/icons/search-icon.svg';

import HomeIcon from '@/assets/icons/home-icon.svg';
import NotesIcon from '@/assets/icons/homeMenu/notes-icon.svg';
import PanicIcon from '@/assets/icons/panic-red-icon.svg';
import FavoritesIcon from '@/assets/icons/favorites-star-solid.svg';

// Component Props Setup
const props = withDefaults(defineProps<IAppScreenProps>(), {}) 
const app = inject<IApp>(APP_ID) as IApp;
const drawerComponents = inject<IAppDrawerComponents>(APP_DRAWERS_ID) as IAppDrawerComponents;
const router = useRouter();

const session = useSession();
const { hasCompletedDisclaimer, hasRegistered } = storeToRefs(session);
const branchingStore = useBranchingStore();
const { 
  getCurrentReferredView, 
  removeLastReferrallView, 
  removeAllReferralViews,
  resetViewHistory
} = branchingStore;

// Reference Setup
const headerRef = ref<ComponentPublicInstance<typeof BaseHeader>>()
const bodyRef = ref<ComponentPublicInstance<typeof VueElement>>()
const footerRef = ref<ComponentPublicInstance<typeof BaseHeader>>()
const footerSelectedItem = ref<IButtonGroupSelected>();
const timeoutCopy = shallowRef<ReturnType<typeof setTimeout>>();
const timeoutTrans = shallowRef<ReturnType<typeof setTimeout>>();

const footerMenuGroup = [
  { label: "Home", icon: HomeIcon, route: "Home", class: "footer-home" },
  { label: "Notes", icon: NotesIcon, route: "Notes", class: "footer-notes" },
  { label: "Favorites", icon: FavoritesIcon, route: "Favorites", class: "footer-setup" },
  { label: "PANIC!", icon: PanicIcon, route: "Panic", class: "footer-panic" }
];

const sectionIndex = computed(() => {
  const index = footerMenuGroup.findIndex((item) => item.route === router.currentRoute.value.name);
  session?.setCurrentIndex(index);
  return index;
})

const bodyProps = computed(() => {
  if (!headerRef?.value) return {}
  if (!bodyRef?.value) return {}
  if (!footerRef?.value) return {}

  const topPadding = SCREEN_BODY_TOP_PADDING;
  const bottomPadding = 0;

  const IOS_PADDING = app.device.isIOS ? 20 : 0;
  const headerHeight = APP_HEADER_HEIGHT;
  const footerHeight = BOTTOM_HEADER_NAV_HEIGHT(IOS_PADDING);
  const footerMargin = app.device.height - (footerHeight);
  let diff = (footerMargin - headerHeight) - ( topPadding + bottomPadding );

  return {
    styles: {
      height: `${diff}px`
    }
  }
})

function onFooterMenuTriggered(selected: IButtonGroupSelected) {
  
  const currentReferredView = getCurrentReferredView();

  // check if we are in panic mode
  if (currentReferredView !== null) {
    footerSelectedItem.value = selected;

    Haptics.notification({ type: NotificationType.Warning });

    let message = `You are currently in the `;
    message += `<span style="color: red">${currentReferredView?.title}</span> panic session. `;
    message += `Do you want to be taken to your current session or exit panic?`;

    const actions = {
      action: (index:number) => {
        if (index === 0) return;

        // Exit
        if (index === 1) {
          // clear store referral
          removeAllReferralViews();

          goToSection(footerSelectedItem.value!);
        }
        // Take me
        else if (index === 2) {
          // get last view and clear from store
          const lastView = removeLastReferrallView();
          console.log("LAST VIEW", lastView)
          
          // replace route
          // wait, then replace
          nextTick(() => router.push({ path: `${lastView?.fullPath}` }))
        }
      }
    }

    nextTick(() => { showPanicAlert(message, actions); });    
    return;
  }
  
  // show if in panic and want to go back to the panic menu
  // 3 === Panic Button
  if (selected.index === 3) {
    // if already in panic home, do nothing
    const checkCurPath = router.currentRoute?.value?.fullPath;
    const checkLen = checkCurPath?.split("/")?.length;
    if (checkCurPath?.indexOf("/home/panic") === 0 && checkLen > 3) {
      footerSelectedItem.value = selected;
      nextTick(() => { showGoPanicHomeAlert(); });    
      return;
    }
  }
  
  Haptics.impact({ style: ImpactStyle.Light });

  goToSection(selected);
}

function goToSection(selected: IButtonGroupSelected) {
  if (sectionIndex.value === selected.index) return;
  
  MyClarityCapacitator.setCurrentScreenName({
    id: selected.data.route
  });
  
  session.$patch({ currentIndex: selected.index })
  router.push({ name: selected.data.route });
}

function onAfterEnter(el:Element, route:RouteLocationGeneric) {
  if (false) console.log("onAfterEnter", el, route);
}

function onAfterLeave(el:Element) {
  if (false) console.log("onAfterLeave", el);
}

function showPanicAlert(msg: string = "", actions: any = null) {
  Haptics.notification({ type: NotificationType.Warning });
  
  app.alert.component = shallowRef(AppAlertPanel);
  app.alert.options.props = {
    title: '',
    content: `${msg}`,
    labels: ['No', 'Exit', 'Take me'],
    ...actions
  }
  app.alert.options.open = !app.alert.options.open;
}

function showGoPanicHomeAlert() {
  Haptics.notification({ type: NotificationType.Warning });
  
  let message = `Would you want to go back to the Panic menu?`;

  app.alert.component = shallowRef(AppAlertPanel);
  app.alert.options.props = {
    title: '',
    content: `${message}`,
    labels: ['No', 'Yes'],
    action: (index:number) => {
      if (index === 0) return;

      // Exit
      if (index === 1) {
        // clear store referrals
        removeAllReferralViews();
        resetViewHistory();

        goToSection(footerSelectedItem.value!);
        let nextRoute = "", rawRoute = footerSelectedItem?.value?.data?.route as string;
        if (footerSelectedItem?.value?.data?.route) {
          nextRoute = rawRoute?.toLowerCase();
        }
        nextTick(() => router.replace({ path: `/home/${nextRoute}` }))
      }
    }
  }
  app.alert.options.open = !app.alert.options.open;  
}

function onLogo() {
  
  const currentReferredView = getCurrentReferredView();
  if (!currentReferredView) {
    router.push({ name: `Home` });
    return;
  }

  let message = `You are currently in the `;
  message += `<span style="color: red">${currentReferredView?.title}</span> panic session. `;
  message += `Do you want to be taken to your current session or exit panic?`;

  const actions = {
    action: (index:number) => {
      if (index === 0) return;

      // Exit
      if (index === 1) {
        // clear store referral
        removeAllReferralViews();

        router.push({ name: `Home` });
      }
      // Take me
      else if (index === 2) {
        // get last view and clear from store
        const lastView = removeLastReferrallView();
        
        // replace route
        // wait, then replace
        nextTick(() => router.replace({ path: `${lastView?.fullPath}` }))
      }
    }
  }

  nextTick(() => { showPanicAlert(message, actions); });   
}

function checkRegistration() {
  // if (true) return;
  // console.log("hasRegistered.value",hasRegistered.value)
  if (hasRegistered.value) return;

  clearTimeout(timeoutCopy.value);

  timeoutCopy.value = setTimeout(() => {
    drawerComponents.bottom = RegistrationPanel;
    app.drawers.bottom.closeOutside = false;
    app.drawers.bottom.open = !app.drawers.bottom.open;
  }, 750);
}

function disclaimerClosedEvent() {
  checkRegistration();
}

onMounted(() => {
  if (!hasCompletedDisclaimer.value) {
    clearTimeout(timeoutCopy.value);
    clearTimeout(timeoutTrans.value);
  
    // show disclaimer
    timeoutCopy.value = setTimeout(() => {
      document.body.addEventListener(EVENT_DISCLAIMER_CLOSE, disclaimerClosedEvent);

      drawerComponents.bottom = DisclaimerPanel;
      app.drawers.bottom.closeOutside = false;
      app.drawers.bottom.open = !app.drawers.bottom.open;
    }, 750);
  }
  else {

    // show registration after disclaimer has been accepted
    if (hasCompletedDisclaimer.value) checkRegistration();
  } 
})

onUnmounted(() => {
  clearTimeout(timeoutCopy.value);
  document.body.removeEventListener(EVENT_DISCLAIMER_CLOSE, disclaimerClosedEvent);
})

</script>

<template>
<BaseScreen 
  :className="[`home`,  props?.class, props?.drawerOpen ? `drawer-open` : ``].join(` `)"
  :headerSlotProps="{ class: `z-index-1` }" 
  :footerSlotProps="{ 
    styles: { 
      position: `fixed`,
      top: `calc(${app.device.height}px - ${BOTTOM_HEADER_NAV_HEIGHT(app.device.isIOS ? 20 : 0)}px)`,
      height: `${BOTTOM_HEADER_NAV_HEIGHT(app.device.isIOS ? 20 : 0)}px` 
    } 
  }">
  
  <template v-slot:headerSlot>
    <BaseHeader ref="headerRef" class="home-header center-container pxlr-20" :innerClassName="`pxl-20 pxr-20`">
      <template v-slot:headerLeft>
        <BaseButton class="menu-button" :innerClassName="`flex-column`" :icon="MenuIcon" @triggered="() => {
          drawerComponents.left = AppSideMenuPanel;
          app.drawers.left.props = { name: `menu`, closeOutside: true }
          app.drawers.closeOutside = true;
          app.drawers.left.open = !app.drawers.left.open;
        }"/>
      </template>
      <template v-slot:headerCenter>
        <BaseButton class="absolute bx--20" @triggered="onLogo">
          <template v-slot:bodySlot>
            <img :src="Logo" width="81" height="60" class="" />
          </template>
        </BaseButton>
      </template>
      <template v-slot:headerRight>
        <BaseButton class="menu-button" :innerClassName="`flex-column`" :icon="SearchIcon" @triggered="() => {
          drawerComponents.bottom = AppSearchPanel;
          app.drawers.bottom.props = { name: `search` }
          app.drawers.bottom.open = !app.drawers.bottom.open;
        }"/>
      </template>
    </BaseHeader>
  </template>
  
  <template v-slot:bodySlot>
    <div class="inner-body" v-bind="{ style: { ...bodyProps?.styles } }" >
      <router-view :key="`__HOME__`" v-slot="{ Component, route,  }">
        <transition :name="route.meta.transition || 'scale-slide'" @after-leave="onAfterLeave" @after-enter="(el) => onAfterEnter(el, route)">
          <component ref="bodyRef" :is="Component" v-bind="{ styles: { ...bodyProps?.styles }, products: `` }" />
        </transition>
      </router-view>
    </div>
  </template>
  
  <template v-slot:footerSlot>
    <BaseHeader ref="footerRef" 
      class="home-footer center-container pxlr-20" 
      centerClassName="width-100"
    >
      <template v-slot:headerCenter>
        <ButtonGroup 
          :class="`footer width-100`"
          :role="`contentinfo`"
          :selectedIndex="sectionIndex"
          :defaultButtonProps="{ 
            elementClassName: `menu-button mxlr-10`, 
            innerClassName: `flex-column` 
          }"
          :dataProvider="footerMenuGroup" @triggered="onFooterMenuTriggered"
        ></ButtonGroup>
      </template>
    </BaseHeader>
  </template>
 
</BaseScreen>
</template>

<style lang="scss">
.home-header {
  html.ios & {
    .inner-base-header {
      padding-top: 30px; // iOS Header Padding
    }
  }
}

.home-footer {
  html.ios & {
    .header-center {
      align-items: start;
      padding-top: 6px;
    }
  }
}
</style>

<style scoped lang="scss">

.base-screen {
  &.drawer-open {
    transform: scale(0.95);
  }
}

.screen-header, .screen-footer {
  .center-container {
    :deep(.inner-base-header) {
      background-color: $white;
      box-shadow: $header-shadow-props $header-shadow-color;
    }
  }
}

.screen-header {
  .center-container {
    :deep(.inner-base-header) {
      border-radius: $header-border-radius;
    }
  }
}

.screen-footer {
  
  .center-container {
    :deep(.inner-base-header) {
      width: 100%;
      border-radius: $footer-border-radius;
      .inner-button-group {
        justify-content: space-around;
      }
      .menu-button {
        .ui-label {
          font-size: 13px;
          line-height: 14px;
          // @include getFontSize('small');
        }
      }
    }
  }
}

// Footer Button Group
.button-group {
  :deep(.menu-button) {
    color: $primary-color;

    &.footer-setup {
      .ui-icon {
        width: 44px;
        height: 43px;
      }
    }

    .ui-label {
      @include getFontSize('small');
    }

    .ui-icon {
      width: 43px;
      height: 43px;
      svg { width: 100%; height: 100%; }
    }

    &:hover:not(.active) {
      color: $secondary-blue;
    }

    &.active {
      color: $secondary-blue;
    }
  }
}


</style>