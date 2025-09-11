<script setup lang="ts">
import { ref, onMounted, computed, provide, reactive, shallowReactive, shallowRef } from "vue";
import { useDevice } from "@/plugins/Device";
import { useRouter } from "vue-router";
import { App } from "@capacitor/app"
import useSession from "@/store/session.module";
import AppToaster from "@/ui/notifications/toaster/AppToaster.vue";
import RedGradientSVG from '@/components/redgradient/RedGradientSVG.vue';

import { APP_BODY_ID, APP_DRAWERS_ID, APP_ID } from "@/_core/Constants";
import { 
  DeviceBackButtonEventName,
  IApp, 
  IAppDrawerComponents, 
  IAppProvider, 
  IAppProviderDeviceProps, 
  IDeviceBackButtonEvent, 
  IDrawerPosition 
} from "@/types";

import AppDrawers from "@/_core/AppDrawers.vue";
import AppAlert from "@/_core/AppAlert.vue";
import AppNavigator from "@/_core/AppNavigator.vue";
import AppDev from "./_core/AppDev.vue";
import AppStyles from "@/_core/AppStyles";
import AppAlertPanel from "@/components/panels/AppAlertPanel.vue";

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
const router = useRouter();

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

/**
 * 
 * @param props 
 */
function onDeviceBackButton(props: any) {
  /** @ts-ignore */
  const { canGoBack } = props;

  const routeName = router?.currentRoute?.value?.name;

  if (routeName === "Home") {
    app.alert.component = shallowRef(AppAlertPanel);
    app.alert.options.props = {
      title: '',
      content: `Would you want to close the app?`,
      labels: ['No', 'Yes'],
      action: (index:number) => {
        if (index === 0) return;

        // Yes
        if (index === 1) {
          App.exitApp();
        }
      }
    }
    app.alert.options.open = !app.alert.options.open;
    return;
  }

  // Create a custom event with type safety
  const myDeviceBackButton = new CustomEvent<IDeviceBackButtonEvent>(DeviceBackButtonEventName, {
    detail: { canGoBack },
    bubbles: true,
    cancelable: true
  } as CustomEvent & IDeviceBackButtonEvent);
  document?.dispatchEvent(myDeviceBackButton);
  // router.go(-1);
}

onMounted(() => { 
  device?.init(); 
  if (!renderCount.value) renderCount.value = true;

  session.initSession();

  App.addListener("backButton", onDeviceBackButton);
});

const SHOW_DEBUG = import.meta.env.SHOW_DEBUG;
if (SHOW_DEBUG) console.log("SHOW_DEBUG", import.meta.env.SHOW_DEBUG)

</script>

<template>
  <div :id="`${APP_BODY_ID.toLowerCase()}`" 
    class="relative" 
    :class="[{ ['debug-mode']: SHOW_DEBUG }]" 
    :style="appStyles"
  >
    <RedGradientSVG />
    
    <AppNavigator :drawerOpen="isDrawerOpen" @onTransitionEnter="onNavigationEnter" />

    <AppDrawers :components="drawerComponents"/>

    <AppAlert />
    
    <AppToaster />

    <AppDev v-if="SHOW_DEBUG" />
  </div>
</template>

<style scoped lang="scss"></style>

<style lang="scss">
#app {
  
  html.desktop:not(.ios):not(.android) & {
    @include renderPhoneTemplate();
  }

  #__app_body__ {
    background-color: rgb(245, 245, 245);
  }

  &.page-guide {
    background-color: rgb(239, 238, 237)!important;
    background-image: none!important;
    background-size: 100%!important;
    display: flex!important;
    align-items: center!important;
    justify-content: center!important;

    #__app_body__ {
      width: 100%!important;
      height: 100vh!important;
    }
  }
}
</style>