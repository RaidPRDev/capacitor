<script lang="ts">
export default {
  inheritAttrs: false,
  name: "AppSearchBottomPanel"
}   
</script>

<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue';
import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import BaseList from '@/ui/controls/BaseList.vue';

import { APP_ID } from '@/App.vue';
import { IApp } from '@/ui/types';

import CloseIcon from '@/assets/icons/close-icon.svg';
import Logo from '/assets/elso_logo.png';
import UserIcon from '@/assets/icons/sideMenu/user-icon.svg';
import BellIcon from '@/assets/icons/sideMenu/bell-icon.svg';
import SettingsIcon from '@/assets/icons/sideMenu/settings-icon.svg';
import { capitalizeFirstLetter } from '@/utils/StringTools';

interface ILeftSidePanelProps {
  items?: any;
}

// Component Props Setup
const props = withDefaults(defineProps<ILeftSidePanelProps>(), {});

const APP_VERSION = import.meta.env.APP_VERSION;
const BUILD_VERSION = import.meta.env.BUILD_VERSION;
const PLATFORM_NAME = capitalizeFirstLetter(import.meta.env.PLATFORM);
const HEADER_HEIGHT = 94;

const app = inject<IApp>(APP_ID) as IApp;
const mounted = ref<boolean>(false);

watch(props, () => {
  console.log("watch.props", props)
})

const sideMenu = [
  { label: "My Profile", icon: UserIcon, route: "Home", class: "" },
  { label: "Notifications", icon: BellIcon, route: "Setup", class: "" },
  { label: "Settings", icon: SettingsIcon, route: "Panic", class: "" },
];

onMounted(() => {
  setTimeout(() => mounted.value = true, 1000);
})

</script>

<template>
<BasePanel class="relative" :headerSlotProps="{ styles: { height: `${HEADER_HEIGHT}px` } }">
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
          :class="`menu-item width-100`" 
          :innerClassName="`px-20 justify-start gapx-10`"
          :bodyClassName="`text-left`"
          :label="data.item.label"
          :icon="data.item.icon"
          :triggerCallback="(_data) => {
            console.log(`TRIGGER`, _data)
            // const bView = data.item as CheckListItemType;
            // if (!bView?.branchTo) return;
            // navigate(bView?.branchTo!);
          }"
        >
        </BaseButton>
      </template>
    </BaseList>
    <div class="version absolute bx-10 width-100 text-center">
      <BaseButton 
        :class="`menu-item width-100`" 
        :innerClassName="`px-20 justify-start gapx-10`"
        :bodyClassName="`text-left`"
        :label="`Version: ${APP_VERSION} | Build: ${BUILD_VERSION} | ${PLATFORM_NAME}`"
      ></BaseButton>
    </div>
  </div>
</BasePanel>
</template>

<style scoped lang="scss">
.base-panel {
  :deep(.inner-panel) {
    background-color: rgba(#2C51CF, .85);
  }

  // Does not work in chrome
  html:not(.desktop) & {
    :deep(.inner-panel) {
      background-color: rgba(#2C51CF, .75);
      backdrop-filter: blur(10px);
    }
  }
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
      font-size: 20px;
      font-weight: 400;
    }
  }
}
.version {
  font-size: 14px;
  font-weight: 300;
  color: rgba(white, 0.25);
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