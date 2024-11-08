<script setup lang="ts">
import { ref, onMounted, computed, provide, reactive, shallowReactive } from "vue";

import { APP_BODY_ID, APP_DRAWERS_ID, APP_ID } from "@/_core/Constants";
import { IAppProvider, IAppProviderDeviceProps, IDrawerPosition } from "@/types";
import { IApp, IAppDrawerComponents } from "@/ui/types";

import AppDrawers from "@/_core/AppDrawers.vue";
import AppAlert from "@/_core/AppAlert.vue";
import AppNavigator from "@/_core/AppNavigator.vue";
import AppToaster from "@/ui/notifications/toaster/AppToaster.vue";
import useAppStyles from "@/_core/AppStyles";
import useSession from "@/store/session.module";
import { useDevice } from "@/plugins/Device";

import RedGradientSVG from '@/components/RedGradientSVG.vue';
import AppDev from "./_core/AppDev.vue";

// App Provider
const app = reactive<IAppProvider>({ 
  device: reactive<IAppProviderDeviceProps>({ 
    width: 0, height: 0, margin: 0, mobile: false, isIOS: false
  }),
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
const drawerComponents = shallowReactive<IDrawerPosition>({ 
  left: null,
  right: null,
  top: null,
  bottom: null,
}) as IAppDrawerComponents;
provide<IAppDrawerComponents>(APP_DRAWERS_ID, drawerComponents);

// Init Session
const session = useSession();

// Init Device and Styles
const renderCount = ref(false);
const device = useDevice();
const { styles: appStyles } = useAppStyles({ app, device });

/**
 * 
 * @param el 
 * @param done 
 */
function onNavigationEnter(el:Element, done:() => void) {
  if (false) console.log(el);
  if (!renderCount.value) renderCount.value = true;
  done();
}

const isDrawerOpen = computed(() =>
{
  return app.drawers.left.open 
  || app.drawers.right.open
  || app.drawers.top.open
  || app.drawers.bottom.open
})

onMounted(() => { 
  device?.init(); 
  if (!renderCount.value) renderCount.value = true;

  session.initSession();
});

</script>

<template>
  <div :id="`${APP_BODY_ID.toLowerCase()}`" class="relative" :style="appStyles">
    <RedGradientSVG class="absolute tx-0 lx-0 pointer-none" />
    
    <AppNavigator :drawerOpen="isDrawerOpen" @onTransitionEnter="onNavigationEnter" />

    <AppDrawers :components="drawerComponents"/>

    <AppAlert />
    
    <AppToaster />

    <AppDev v-if="true" />
  </div>
</template>

<style scoped lang="scss"></style>

<style lang="scss">
#app {
  html.desktop:not(.ios):not(.android) & {
    @include renderPhoneTemplate();
  }
}
</style>