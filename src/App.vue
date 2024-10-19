<script lang="ts">
export const APP_ID = "__APP__";
export const APP_DRAWERS_ID = "__APP_DRAWERS__";
export const APP_ALERT_ID = "__APP_ALERT__";
export const APP_TOASTER_ID = "__APP_TOASTER__";
</script>
<script setup lang="ts">
import { ref, onMounted, computed, provide, reactive, shallowReactive } from "vue";
import { useDevice } from "@/plugins/Device";
import { IApp, IAppAlert, IAppDrawerComponents } from "./ui/types";
import RedGradientSVG from '@/components/RedGradientSVG.vue';
import AppToaster from "@/ui/notifications/toaster/AppToaster.vue";

const appToasterRef = ref<any>();

// App Provider
const app = reactive({ 
  device: reactive({ width: 0, height: 0, margin: 0, mobile: false }),
  alert: { options: {} },
  drawers: {
    closeOutside: false,
    left: { open: false, closeOutside: false, props: {} },
    right: { open: false, closeOutside: false, props: {} },
    top: { open: false, closeOutside: false, props: {} },
    bottom: { open: false, closeOutside: false, props: {} },
  },
}) as IApp;
provide<IApp>(APP_ID, app);

// App Drawers Provider
const drawerComponents = shallowReactive({ 
  left: null,
  right: null,
  top: null,
  bottom: null,
}) as IAppDrawerComponents;
provide<IAppDrawerComponents>(APP_DRAWERS_ID, drawerComponents);

// App Alert Provider
const alertComponent = shallowReactive({ 
  closeOutside: false,
  options: {},
  component: null
}) as IAppAlert;
provide<IAppAlert>(APP_ALERT_ID, alertComponent);

// App Toaster Provider
// provide<any>(APP_TOASTER_ID, appToasterRef);

// init device
const device = useDevice();
const renderCount = ref(false);

onMounted(() => { 
  device?.init(); 
  if (!renderCount.value) renderCount.value = true;
});

function onEnter(el:Element, done:() => void) {
  if (false) console.log(el);
  if (!renderCount.value) renderCount.value = true;
  done();
}

const wrapperStyles = computed(() => {
  
  if (!device?.isMobile()) {
    
    app.device.width = 375;
    app.device.height = 812;
    app.device.margin = 20;
    app.device.mobile = device?.isMobile()!;
    
    // console.log("device", device?.state)
    // console.log("device", device?.isMobile())

    // non mobile devices
    return { 
      backgroundColor: `#f5f5f5`,
      width: `375px`, 
      height: `812px`,
      borderRadius: `47px`,
      overflow: `hidden`,
      marginTop: `-1px`
    }
    
  }

  const res = device?.state.resolution;
  app.device.width = res.width;
  app.device.height = res.height;
  app.device.margin = 20;
  app.device.mobile = device?.isMobile()!;
  return { width: `${res.width}px`, height: `${res.height}px` }
});

function onDrawerAfterEnter() {}
function onDrawerAfterLeave() {}

const isDrawerOpen = computed(() =>
{
  return app.drawers.left.open 
  || app.drawers.right.open
  || app.drawers.top.open
  || app.drawers.bottom.open
})

const isAlertOpen = computed(() =>
{
  return app.alert.options.open
})

function onBackdrop() {
  if (app.drawers.closeOutside) {
    if (app.drawers.left.open) {
      app.drawers.left.open = false;
    }
    
    if (app.drawers.right.open) {
      app.drawers.right.open = false;
    }
    
    if (app.drawers.top.open) {
      app.drawers.top.open = false;
    }
    
    if (app.drawers.bottom.open) {
      app.drawers.bottom.open = false;
    }
  }
  
  if (app.alert.closeOutside) {
    if (app.alert.options.open) {
      app.alert.options.open = false;
    }
  }
  
}

</script>

<template>
  <div class="app-wrapper relative" :style="{...wrapperStyles}">
    <RedGradientSVG class="absolute tx-0 lx-0 pointer-none" />
    <router-view v-slot="{ Component, route}" :key="`__APP__`">
      <transition :name="route.meta.transition" @enter="onEnter" :duration="550">
        <component :is="Component" v-bind="{ drawerOpen: isDrawerOpen }" />
      </transition>
    </router-view>

    <div class="app-drawers absolute lx-0 tx-0 width-100 height-inherit">
      <transition :name="'fade'" @after-enter="onDrawerAfterEnter" @after-leave="onDrawerAfterLeave">
        <div class="drawer-backdrop" v-if="isDrawerOpen" @click="onBackdrop"></div>
      </transition>
      <transition :name="'slide-right'" @after-enter="onDrawerAfterEnter" @after-leave="onDrawerAfterLeave">
        <component class="drawers drawer-left" v-if="app.drawers.left.open" :is="drawerComponents.left"></component>
      </transition>
      <transition :name="'slide-left'" @after-enter="onDrawerAfterEnter" @after-leave="onDrawerAfterLeave">
        <div class="drawers drawer-right" v-if="app.drawers.right.open"></div>
      </transition>
    </div>
    <div class="app-drawers absolute lx-0 tx-0 width-100 height-inherit">
      <transition :name="'slide-in-from-bottom'" @after-enter="onDrawerAfterEnter" @after-leave="onDrawerAfterLeave">
        <component class="drawers drawer-bottom" v-if="app.drawers.bottom.open" :is="drawerComponents.bottom" v-bind="app?.drawers?.bottom?.props"></component>
      </transition>
    </div>

    <div class="app-alert absolute lx-0 tx-0 width-100 height-inherit">
      <transition :name="'fade'" @after-enter="onDrawerAfterEnter" @after-leave="onDrawerAfterLeave">
        <div class="alert-backdrop z-index-1" v-if="isAlertOpen" @click="onBackdrop"></div>
      </transition>
      <transition :name="'slide-in-from-bottom'" @after-enter="onDrawerAfterEnter" @after-leave="onDrawerAfterLeave">
        <component class="alert-container" v-if="app.alert.options.open" :is="app.alert.component" v-bind="app?.alert?.options?.props"></component>
      </transition>
    </div>
    
    <AppToaster ref="appToasterRef" :enabled="true" />

  </div>
</template>

<style scoped lang="scss"></style>

<style lang="scss">
#app {
  html.desktop:not(.ios):not(.android) & {
    @include renderPhoneTemplate();
  }
}
.app-notify {
  pointer-events: none;
  .notify-backdrop {
    width: inherit;
    height: inherit;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: all;
  }
}
.app-alert {
  pointer-events: none;
  .alert-backdrop {
    width: inherit;
    height: inherit;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: all;
  }
}
.app-drawers {
  pointer-events: none;
  .drawer-backdrop {
    width: inherit;
    height: inherit;
    position: absolute;
    background-color: rgba(0, 0, 0, 0.5);
    pointer-events: all;
  }
  .drawers {
    position: absolute;
    pointer-events: all;
    height: inherit;
  }
  .drawer-left {
    left: 0;
    width: 316px;
  }
  .drawer-right {
    right: 0;
    width: 316px;
  }
  .drawer-top {
    top: 0;
    left: 0;
    width: 316px;
  }
  .drawer-bottom {
    bottom: 0;
    left: 0;
    width: 100%;
  }
  &.hidden {
    pointer-events: none;
    visibility: hidden;
  }
}
</style>