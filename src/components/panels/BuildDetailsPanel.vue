<script lang="ts">
export default {
  inheritAttrs: false,
  name: "BuildDetailsPanel"
}   
</script>

<script setup lang="ts">
import { inject } from 'vue';
import classnames from "classnames";
import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";

import { APP_ID } from '@/App.vue';
import { IApp } from '@/ui/types';
import { storeToRefs } from 'pinia';
import useSession from '@/store/session.module';
import { useDevice } from '@/plugins/Device';

import Logo from '/assets/elso_logo.png';
import CloseIcon from '@/assets/icons/close-icon.svg';
import { capitalizeFirstLetter } from '@/utils/StringTools';

const APP_VERSION = import.meta.env.APP_VERSION;
const BUILD_VERSION = import.meta.env.BUILD_VERSION;

const session = useSession();
const device = useDevice();
const { hasCompletedTerms } = storeToRefs(session);

const app = inject<IApp>(APP_ID) as IApp;

console.log("device", device)

</script>

<template>
<BasePanel :class="classnames(`relative`, { ['accepted']: hasCompletedTerms })">
  <template v-slot:headerSlot>
    <BaseHeader ref="headerRef" class="center-container" :innerClassName="`pxlr-30 pxt-18`">
      <template v-slot:headerLeft>
        <div class="flex justify-center mxb-40"><img :src="Logo" width="120" height="89" /></div>
      </template>
    </BaseHeader>
  </template>

  <div class="side-content pxlr-0 pxt-20 pxb-0 relative">
    <div class="pxlr-0 height-100">

      <div class="title width-100 text-center mxb-30">Build Details</div>
    
      <div class="content-scroller relative pxlr-16">
        <div class="inner-scroller pxb-40">
          

          <div><p>Version: <b>{{ `${APP_VERSION}` }}</b></p></div>
          <div><p>Build: <b>{{ `${BUILD_VERSION}` }}</b></p></div>

          <p class="p-title">Device:</p>
            <div v-if="device?.state.android"><p>Platform: <b>{{ `Android` }}</b></p></div>
            <div v-else-if="device?.state.ios"><p>Platform: <b>{{ `iOS` }}</b></p></div>
            <div v-else-if="device?.state.macos"><p>Platform: <b>{{ `MacOS` }}</b></p></div>
            <div v-else-if="device?.state.windows"><p>Platform: <b>{{ `Windows` }}</b></p></div>
            <div v-else><p>Platform: <b>{{ `Unknown` }}</b></p></div>
            <div><p>Type: <b>{{ capitalizeFirstLetter(device?.state.type!) }}</b></p></div>
            
          <p class="p-title">Display:</p>
            <div><p>Resolution: <b>{{ `${device?.state.resolution.width}w ${device?.state.resolution.height}h [px]` }}</b></p></div>
            <div><p>Orientation: <b>{{ `${capitalizeFirstLetter(device?.state.orientation!)}` }}</b></p></div>

          <p class="p-title">WebView:</p>
            <div><p>Browser: <b>{{ `${capitalizeFirstLetter(device?.state.browser!)}` }}</b></p></div>
            <div><p>Viewport: <b>{{ `${device?.state.viewport.width}w ${device?.state.viewport.height}h [px]` }}</b></p></div>
            <div><p>Agent: <b>{{ `${device?.state?.navigator?.userAgent}` }}</b></p></div>
            <div><p>CodeName: <b>{{ `${device?.state?.navigator?.appCodeName}` }}</b></p></div>
            <div><p>AppName: <b>{{ `${device?.state?.navigator?.appName}` }}</b></p></div>
            <div><p>IsMobile: <b>{{ `${device?.state?.navigator?.userAgentData?.mobile}` }}</b></p></div>

          <!-- <p class="p-title">SoftKeyboard:</p>
            <div><p>Size: <b>{{ `${device?.state?.navigator?.virtualKeyboard?.boundingRect?.width}h ${device?.state?.navigator?.virtualKeyboard?.boundingRect?.height}h` }}</b></p></div>
            <div><p>IsOpen: <b>{{ `${device?.softKeyboardOpen}` }}</b></p></div> -->

          <p class="p-title">Accessories:</p>
            <div><p>Touch: <b>{{ `${device?.state.touch}` }}</b></p></div>
            <div><p>Pointer: <b>{{ `${device?.state.pointer}` }}</b></p></div>
            <div><p>WebP: <b>{{ `${device?.state.webp}` }}</b></p></div>
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

  &.accepted {
    .content-scroller {
      height: calc(100% - ($header-title + 10px));
      font-size: 16px;

      .inner-scroller {
        @include use-scroller-styles();

        overflow: hidden auto;
        height: calc(100% - ($scroller-bottom));
      }
    }
    .confirm-panel {
      display: none;
    }
  }

  .side-content {
    height: calc(100% - ($header-height));
  }

  .title {
    font-family: $secondary-font-family;
    font-size: 24px;
    font-weight: 500;
  }

  .content-scroller {
    height: calc(100% - ($header-title + 10px + $footer-height));
    font-size: 16px;

    .inner-scroller {
      @include use-scroller-styles();

      overflow: hidden auto;
      height: calc(100% - ($scroller-bottom));
    }

    .p-title {
      color: $sixth-color;
      font-weight: 500;
      font-size: 20px;
    }

    .scroll-fade {
      width: 100%;
      height: 100px;
      background: linear-gradient(180deg, #FFFFFF00 0%, #FFF 100%);
      box-shadow: 0px 10px 20px 2px #0B247A26;
    }
  }

  .confirm-panel {
    height: 90px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    background-color: white;
  }

  
  :deep(.inner-panel) {
    background-color: rgba(white, .95);

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

</style>