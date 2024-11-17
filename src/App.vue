<script setup lang="ts">
import { ref, onMounted, computed, provide, reactive, shallowReactive } from "vue";
import { useDevice } from "@/plugins/Device";
import { App } from "@capacitor/app"
import useSession from "@/store/session.module";
import AppToaster from "@/ui/notifications/toaster/AppToaster.vue";
import RedGradientSVG from '@/components/redgradient/RedGradientSVG.vue';

import { APP_BODY_ID, APP_DRAWERS_ID, APP_ID } from "@/_core/Constants";
import { 
  IApp, 
  IAppDrawerComponents, 
  IAppProvider, 
  IAppProviderDeviceProps, 
  IDrawerPosition 
} from "@/types";

import AppDrawers from "@/_core/AppDrawers.vue";
import AppAlert from "@/_core/AppAlert.vue";
import AppNavigator from "@/_core/AppNavigator.vue";
import AppDev from "./_core/AppDev.vue";
import AppStyles from "@/_core/AppStyles";

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
const { styles: appStyles } = AppStyles({ app, device });

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

function onBackButton(props: any) {
  // const { canGoBack } = props;
  
  // if(!canGoBack){
  //   App.exitApp();
  // } else {
  //   window.history.back();
  // }
  alert("Hello" + JSON.stringify(props));
}

onMounted(() => { 
  device?.init(); 
  if (!renderCount.value) renderCount.value = true;

  session.initSession();

  App.addListener("backButton", onBackButton);
});

</script>

<template>
  <div :id="`${APP_BODY_ID.toLowerCase()}`" class="relative" :style="appStyles">
    <RedGradientSVG />
    
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