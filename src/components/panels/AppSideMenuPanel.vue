<script lang="ts">
export default {
  inheritAttrs: false,
  name: "AppSideMenuPanel"
}   
</script>

<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue';
import { useRouter } from "vue-router";

import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import BaseList from '@/ui/controls/BaseList.vue';

import { APP_DRAWERS_ID, APP_ID } from '@/_core/Constants';
import { IApp, IAppDrawerComponents } from '@/types';
import TermsAndConditionsPanel from "@/components/panels/TermsAndConditionsPanel.vue";
import PrivacyPolicyPanel from "@/components/panels/PrivacyPolicyPanel.vue";
// import SendFeedbackPanel from "@/components/panels/SendFeedbackPanel.vue";
// import ElsoHelpPanel from "@/components/panels/ElsoHelpPanel.vue";

import CloseIcon from '@/assets/icons/close-icon.svg';
import Logo from '/assets/elso_logo.png';
// import HeartIcon from '@/assets/icons/sideMenu/heart-icon.svg';
import TermsIcon from '@/assets/icons/sideMenu/terms-icon.svg';
import PrivacyIcon from '@/assets/icons/sideMenu/privacy-icon.svg';
import FeedbackIcon from '@/assets/icons/sideMenu/feedback-icon.svg';
import ResourcesIcon from '@/assets/icons/sideMenu/paperclip-icon.svg';

import { capitalizeFirstLetter } from '@/utils/StringTools';
import BuildDetailsPanel from './BuildDetailsPanel.vue';

interface ILeftSidePanelProps {
  items?: any;
}

// Component Props Setup
const props = withDefaults(defineProps<ILeftSidePanelProps>(), {});

const APP_VERSION = import.meta.env.APP_VERSION;
const BUILD_NUMBER = import.meta.env.BUILD_NUMBER;
const PLATFORM_NAME = capitalizeFirstLetter(import.meta.env.PLATFORM);
const HEADER_HEIGHT = 94;

const app = inject<IApp>(APP_ID) as IApp;
const drawerComponents = inject<IAppDrawerComponents>(APP_DRAWERS_ID) as IAppDrawerComponents;
const mounted = ref<boolean>(false);
const router = useRouter();

watch(props, () => {
  console.log("watch.props", props)
})

const sideMenu = [
  // { label: "ECMO Bedside<br>Guide App Help", icon: HeartIcon, route: "Home", class: "" },
  { label: "Terms and Conditions", icon: TermsIcon, route: "Home", class: "" },
  { label: "Privacy Policy", icon: PrivacyIcon, route: "Home", class: "" },
  { label: "Resources", icon: ResourcesIcon, route: "Home", class: "res-icon" },
  { label: "Send Feedback", icon: FeedbackIcon, route: "Home", class: "" },
];

function onMenuTriggered(selected: number) {
  
  app.drawers.left.open = !app.drawers.left.open;
  
  switch (selected) {
    // case 0: // Bedside App Help
    //   drawerComponents.bottom = ElsoHelpPanel;
    //   app.drawers.bottom.props = { name: "bedside-app-help" }
    //   app.drawers.bottom.closeOutside = false;
    //   app.drawers.bottom.open = !app.drawers.bottom.open;
    // break;

    case 0: // Terms
      drawerComponents.bottom = TermsAndConditionsPanel;
      app.drawers.bottom.props = { name: "terms" }
      app.drawers.bottom.closeOutside = false;
      app.drawers.bottom.open = !app.drawers.bottom.open;
    break;

    case 1: // Privacy
      drawerComponents.bottom = PrivacyPolicyPanel;
      app.drawers.bottom.props = { name: "privacy-policy" }
      app.drawers.bottom.closeOutside = false;
      app.drawers.bottom.open = !app.drawers.bottom.open;
    break;
    
    case 2: // Resources
      // drawerComponents.bottom = ResourcesPanel;
      // app.drawers.bottom.props = { name: "resources" }
      // app.drawers.bottom.closeOutside = false;
      // app.drawers.bottom.open = !app.drawers.bottom.open;
      router.push({ name: 'Resources'});
    break;
    
    case 3: // Feedback
      // drawerComponents.bottom = SendFeedbackPanel;
      // app.drawers.bottom.closeOutside = false;
      // app.drawers.bottom.open = !app.drawers.bottom.open;
      window.open("mailto:support@elso.com?subject=Elso Support&body=Add your message")
    break;
  }
}

onMounted(() => {
  setTimeout(() => mounted.value = true, 1000);
})

</script>

<template>
<BasePanel class="app-side-panel relative" :headerSlotProps="{ styles: { height: `${HEADER_HEIGHT}px` } }">
  <template v-slot:headerSlot>
    <BaseHeader ref="headerRef" class="center-container pxlr-0" :innerClassName="`px-20`">
      <template v-slot:headerLeft>
        <BaseButton>
          <template v-slot:bodySlot>
            <img :src="Logo" width="72" height="54" />
          </template>
        </BaseButton>
      </template>
      <template v-slot:headerRight>
        <BaseButton :class="[`close-button`, { [`anim`]: !mounted }]" :innerClassName="`flex-column`" :icon="CloseIcon" @triggered="() => {
          app.drawers.left.open = !app.drawers.left.open;
        }"/>
      </template>
    </BaseHeader>
  </template>
  <div class="side-content pxlr-0 pxtb-20 relative">
    <BaseList :dataProvider="sideMenu">
      <template v-slot:listItemSlot="data">
        <BaseButton 
          :data-id="data.item.index"
          :class="`menu-item width-100 ${data.item.class}`" 
          :innerClassName="`px-20 justify-start gapx-10 align-start`"
          :bodyClassName="`text-left`"
          :label="data.item.label"
          :icon="data.item.icon"
          :triggerCallback="(_data) => {
            onMenuTriggered(data.item.index);
          }"
        >
        </BaseButton>
      </template>
    </BaseList>
    
    <div class="version absolute bx-10 width-100 text-center">
      <BaseButton 
        :class="`menu-item width-100`" 
        :innerClassName="`px-20 justify-center gapx-10`"
        :bodyClassName="`text-left`"
        :label="`Version: ${APP_VERSION} | Build: ${BUILD_NUMBER} | ${PLATFORM_NAME} (Beta)`"
        :triggerCallback="(_data) => {
          drawerComponents.bottom = BuildDetailsPanel;
          app.drawers.bottom.props = {
            onCopy: () => {
              console.log(`Branching.onCopyBuildDetails2`)
              // await copyToClipboard(data);
              // console.log(`Branching.Copy Complete`);
              // nextTick(() => addToast({ label: `Copied to clipboard.` }));
            }
          }
          app.drawers.bottom.closeOutside = false;
          app.drawers.bottom.open = !app.drawers.bottom.open;
        }"
      ></BaseButton>
    </div>
  </div>
</BasePanel>
</template>

<style lang="scss">
.app-side-panel {
  html.ios & {
    > .inner-panel {
      padding-top: 36px;
    }
  }
}
</style>

<style scoped lang="scss">
.base-panel {
  width: 80%;

  :deep(.inner-panel) {
    background-color: rgba(#2C51CF, 1);
    border-top-right-radius: 20px;
  }

  // Does not work in chrome
  // html:not(.desktop) & {
  //   :deep(.inner-panel) {
  //     background-color: rgba(#2C51CF, .75);
  //     backdrop-filter: blur(10px);
  //   }
  // }
}
.side-content {
  height: calc(100% - 94px);
}
.close-button {
  color: white;
  
  &.anim {
    transition: all 0.35s cubic-bezier(0.55, 0, 0.1, 1);
    animation: 0.65s ease 0.15s slide-in;
    animation-fill-mode: forwards;
    opacity: 0;
  }
}
.menu-item {
  color: white;
  background-color: transparent;

  &.pressed {
    background-color: $primary-color;
  }

  :deep(.inner-base-button) {
    .ui-label {
      font-size: 18px;
      font-weight: 300;
    }
  }
}

.version {
  :deep(.inner-base-button) {
    .ui-label {
      font-size: 14px;
      font-weight: 300;
      color: rgba(white, 0.25);
    }
  }
}

.res-icon {
  :deep(.ui-icon) {
    width: 28px;
    height: 28px;
    svg { width: 100%; height: 100%; }
  }
}

@keyframes slide-in {
  from {
    /* pushes the sun down past the viewport */
    transform: translateX(-50%) scale(0.5) rotate(-180deg);
    opacity: 0;
  }
  to {
    /* returns the sun to its default position */
    transform: translateX(0) scale(1) rotate(0deg);
    opacity: 1;
  }
}
</style>