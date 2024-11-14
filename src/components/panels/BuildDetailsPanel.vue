<script lang="ts">
export default {
  inheritAttrs: false,
  name: "BuildDetailsPanel"
}   
</script>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, reactive, ref, shallowRef } from 'vue';
import classnames from "classnames";
import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";

import { APP_ID } from '@/_core/Constants';
import { IApp } from '@/types';

import useToasterService from '@/ui/notifications/toaster/AppToastService';
import { useDevice } from '@/plugins/Device';
import { capitalizeFirstLetter, copyToClipboard } from '@/utils/StringTools';

import Logo from '/assets/elso_logo.png';
import CloseIcon from '@/assets/icons/close-icon.svg';

const APP_VERSION = import.meta.env.APP_VERSION;
const BUILD_NUMBER = import.meta.env.BUILD_NUMBER;
const BUILD_DATE = import.meta.env.BUILD_DATE;
const BUILD_PHASE = import.meta.env.BUILD_PHASE;

const device = useDevice();
const toasterService = useToasterService();
const { addToast } = toasterService;

const app = inject<IApp>(APP_ID) as IApp;

const buildDate = new Date(BUILD_DATE);
const dateTime = `${buildDate.getHours()}:${buildDate.getMinutes()} ${buildDate.getHours() > 11 ? 'PM' : 'AM'}`;
const dateLabel = `${buildDate.getMonth() + 1}/${buildDate.getDate()}/${buildDate.getFullYear()} ${dateTime}`;

const timeoutCopy = shallowRef<ReturnType<typeof setTimeout>>();
const state = reactive<{ isCopying?: boolean }>({
  isCopying: false
});
const IsOnline = ref<boolean>(false);

function generateCopy(): string {
  let platform = ``;
  if (device?.state.android) platform = `Android`;
  else if (device?.state.ios) platform = `iOS`;
  else if (device?.state.macos) platform = `MacOS`;
  else if (device?.state.windows) platform = `Windows`;
  else platform = `Unknown`;
  
  const content = `
App Version: ${APP_VERSION}
Build Number: ${BUILD_NUMBER}
Build Type: ${BUILD_PHASE}
Date Published: ${dateLabel}
\nDEVICE:
Platform: ${platform}
Version: ${device?.state?.version?.major}
Type: ${capitalizeFirstLetter(device?.state.type!)}
Vendor: ${capitalizeFirstLetter(device?.state.navigator.vendor!)}
Is Online: ${capitalizeFirstLetter(IsOnline?.value?.toString())}
\nDISPLAY:
Resolution: ${device?.state.resolution.width}w ${device?.state.resolution.height}h [px]
Orientation: ${capitalizeFirstLetter(device?.state.orientation!)}
\nWEBVIEW:
Browser: ${capitalizeFirstLetter(device?.state.browser!)}
Viewport: ${device?.state.viewport.width}w ${device?.state.viewport.height}h [px]
Agent: ${device?.state?.navigator?.userAgent}
CodeName: ${device?.state?.navigator?.appCodeName}
AppName: ${device?.state?.navigator?.appName}
IsMobile: ${capitalizeFirstLetter(navigatorDataIsMobile.value)}
IsOnline: ${capitalizeFirstLetter(IsOnline?.value?.toString())}
\nACCESSORIES:
Touch: ${capitalizeFirstLetter(device?.state.touch.toString()!)}
Pointer: ${capitalizeFirstLetter(device?.state.pointer.toString()!)}
WebP: ${capitalizeFirstLetter(device?.state.webp.toString()!)}
\nTECHNOLOGIES:
Ionic Capacitor: 6.1.0
Vue Framework: 3.5.7
Vite Builder: 5.4.7
Pinia Data Store: 2.2.2`;

  return content;
}

async function onCopy() {
  if (state.isCopying) return;
  clearTimeout(timeoutCopy.value);
  state.isCopying = true;

  await copyToClipboard(generateCopy());

  timeoutCopy.value = setTimeout(() => state.isCopying = false, 1000);
  nextTick(() => addToast({ label: `Copied to clipboard.` }));
}

const navigatorDataIsMobile = computed(() => {

  if (device?.state?.ios) {
    return "True";
  }

  return capitalizeFirstLetter(device?.state?.navigator?.userAgentData?.mobile.toString());
})

onMounted(() => {
  console.log("device", device?.state)

  console.log('IsOnline?', device?.state?.navigator?.onLine);
  if (device?.state?.navigator?.onLine) {
    IsOnline.value = true;
  }
})

</script>

<template>
<BasePanel :class="classnames(`relative`)">
  <template v-slot:headerSlot>
    <BaseHeader ref="headerRef" class="center-container" :innerClassName="`pxlr-30 pxt-18`">
      <template v-slot:headerLeft>
        <div class="flex justify-center mxb-40"><img :src="Logo" width="120" height="89" /></div>
      </template>
    </BaseHeader>
  </template>

  <div class="side-content pxlr-0 pxt-20 pxb-0 relative">
    <div class="pxlr-0 height-100">

      <div class="title width-100 text-center mxb-30 relative">
        Build Details
        <BaseButton 
          class="copy-btn absolute mxl-10"
          inner-class-name="px-4" 
          :label="`COPY`" 
          @triggered="onCopy" 
        />
      </div>
    
      <div class="content-scroller relative pxlr-16">
        <div class="inner-scroller pxb-80 select-text">

          <div><p>App Version: <b>{{ `${APP_VERSION}` }}</b></p></div>
          <div><p>Build Number: <b>{{ `${BUILD_NUMBER}` }}</b></p></div>
          <div><p>Build Type: <b>{{ `${BUILD_PHASE}` }}</b></p></div>
          <div><p>Date Published: <b>{{ `${dateLabel}` }}</b></p></div>
          
          <p class="p-title">Device:</p>
            <div v-if="device?.state.android"><p>Platform: <b>{{ `Android` }}</b></p></div>
            <div v-else-if="device?.state.ios"><p>Platform: <b>{{ `iOS` }}</b></p></div>
            <div v-else-if="device?.state.macos"><p>Platform: <b>{{ `MacOS` }}</b></p></div>
            <div v-else-if="device?.state.windows"><p>Platform: <b>{{ `Windows` }}</b></p></div>
            <div v-else><p>Platform: <b>{{ `Unknown` }}</b></p></div>
            <div><p>Version: <b>{{ device?.state?.version?.major }}</b></p></div>
            <div><p>Type: <b>{{ capitalizeFirstLetter(device?.state.type!) }}</b></p></div>
            <div><p>Vendor: <b>{{ capitalizeFirstLetter(device?.state.navigator.vendor!) }}</b></p></div>
            <div><p>Is Online: <b>{{ capitalizeFirstLetter(IsOnline?.toString()) }}</b></p></div>

          <p class="p-title">Display:</p>
            <div><p>Resolution: <b>{{ `${device?.state.resolution.width}w ${device?.state.resolution.height}h [px]` }}</b></p></div>
            <div><p>Orientation: <b>{{ `${capitalizeFirstLetter(device?.state.orientation!)}` }}</b></p></div>

          <p class="p-title">WebView:</p>
            <div><p>Browser: <b>{{ `${capitalizeFirstLetter(device?.state.browser!)}` }}</b></p></div>
            <div><p>Viewport: <b>{{ `${device?.state.viewport.width}w ${device?.state.viewport.height}h [px]` }}</b></p></div>
            <div><p>Agent: <b>{{ `${device?.state?.navigator?.userAgent}` }}</b></p></div>
            <div><p>CodeName: <b>{{ `${device?.state?.navigator?.appCodeName}` }}</b></p></div>
            <div><p>AppName: <b>{{ `${device?.state?.navigator?.appName}` }}</b></p></div>
            <div><p>IsMobile: <b>{{ `${navigatorDataIsMobile}` }}</b></p></div>

          <p class="p-title">Accessories:</p>
            <div><p>Touch: <b>{{ `${capitalizeFirstLetter(device?.state.touch.toString()!)}` }}</b></p></div>
            <div><p>Pointer: <b>{{ `${capitalizeFirstLetter(device?.state.pointer.toString()!)}` }}</b></p></div>
            <div><p>WebP: <b>{{ `${capitalizeFirstLetter(device?.state.webp.toString()!)}` }}</b></p></div>
          
          <p class="p-title">Technologies:</p>
            <div><p>Ionic Capacitor: <b>{{ `6.1.0` }}</b></p></div>  
            <div><p>Vue Framework: <b>{{ `3.5.7` }}</b></p></div>
            <div><p>Vite Builder: <b>{{ `5.4.7` }}</b></p></div>
            <div><p>Pinia Data Store: <b>{{ `2.2.2` }}</b></p></div>
        </div>

        <div class="scroll-fade absolute lx-0 bx-8"></div>
      </div>

    </div>
  </div>

  <BaseButton 
    class="close-button absolute tx-20 rx-20" 
    :innerClassName="`flex-column`" 
    :icon="CloseIcon" 
    @triggered="() => {
      app.drawers.closeOutside = false;
      app.drawers.bottom.open = !app.drawers.bottom.open;
    }" 
  />

</BasePanel>
</template>

<style scoped lang="scss">
.base-panel {
  $header-height: 112px;
  $header-padding: 20px;
  $header-title: 24px;
  $header-title-padding: 30px;
  $footer-height: 90px;
  $scroller-bottom: 20px;
  $scroll-height: $header-height + $header-padding + $header-title + $header-title-padding + $footer-height;

  .side-content {
    height: calc(100% - ($header-height));
  }

  .title {
    font-family: $secondary-font-family;
    font-size: 24px;
    font-weight: 500;
  }

  .content-scroller {
    height: calc(100% - ($header-title + 10px));
    font-size: 16px;

    .inner-scroller {
      @include use-scroller-styles();
      
      overflow: hidden auto;
      height: calc(100% - ($scroller-bottom));

      p:not(.p-title) { margin: 0; font-size: 14px; }
    }

    .p-title {
      color: $sixth-color;
      font-weight: 500;
      font-size: 16px;
      margin: 1rem 0 0.35rem 0;
      border-bottom: 1px solid rgba(black, .15)
    }

    .scroll-fade {
      width: 100%;
      height: 100px;
      background: linear-gradient(180deg, #FFFFFF00 0%, #FFF 100%);
      // box-shadow: 0px 10px 20px 2px #0B247A26;
    }
  }

  :deep(.inner-panel) {
    // background-color: rgba(white, .95);
    background-color: white;

    .base-header {
      img {
        width: 72px;
        height: 54px;
      }
    }

    .variant-red {
      box-shadow: 0px 0px 12px 0px #0B247A26;

      &.cancel {
        opacity: 1;
        .inner-base-button {
          background: $fourth-color;
        }
      }
    }
  }

  // Does not work in chrome
  html:not(.desktop) & {
    :deep(.inner-panel) {
      background-color: rgba(white, .85);
      backdrop-filter: blur(10px);
    }
  }
}

.copy-btn {
  :deep(.inner-base-button) {
    .ui-background {
      background-color: rgba(0, 0, 0, 0.1);
    }
    .ui-label {
      font-size: 12px;
      font-weight: 600;
      color: rgba(0, 0, 0, 0.5);
    }
  }
}
</style>