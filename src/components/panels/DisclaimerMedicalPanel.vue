<script lang="ts">
export default {
  inheritAttrs: false,
  name: "DisclaimerMedicalPanel"
}   

</script>

<script setup lang="ts">
import { EVENT_DISCLAIMER_CLOSE } from '@/events/Events';

import { inject, onMounted, onUnmounted, ref } from 'vue';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import classnames from "classnames";

import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";

import { APP_ID } from '@/_core/Constants';
import { IApp } from '@/types';
import useSession from '@/store/session.module';

import Logo from '/assets/elso_logo.png';

const disclaimerClosedEvent = new Event(EVENT_DISCLAIMER_CLOSE);
const session = useSession();
const app = inject<IApp>(APP_ID) as IApp;
const divScrollerRef = ref<HTMLElement>();
const hasScrolledEnd = ref<boolean>(false);

function checkScrollPosition() {
  // If already accepted, stop checking
  if (!divScrollerRef.value || hasScrolledEnd.value) return;

  const div = divScrollerRef.value;
  
  const isShortContent = div.clientHeight >= div.scrollHeight; 
  const hasReachedBottom = div.scrollTop + div.clientHeight >= div.scrollHeight - 20;

  if (isShortContent || hasReachedBottom) {
    hasScrolledEnd.value = true;
  }
}

function handleScroll() {
  checkScrollPosition();
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  // Slight delay to ensure DOM and animations are rendered
  setTimeout(() => {
    checkScrollPosition();

    // Setup Observer: If the div size changes (e.g. rotation), re-check logic
    if (divScrollerRef.value) {
      resizeObserver = new ResizeObserver(() => {
        checkScrollPosition();
      });
      resizeObserver.observe(divScrollerRef.value);
    }
  }, 300); 
});

onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});

function onMenuTriggered(selected: number) {
  switch (selected) {
    case 0: // Decline
      session.$patch({ hasCompletedMedDisclaimer: false })
    break;

    case 1: // Accept
      Haptics.impact({ style: ImpactStyle.Light });
      session.$patch({ hasCompletedMedDisclaimer: true })
    break;
  }

  // fire closed event
  document.body.dispatchEvent(disclaimerClosedEvent);

  app.drawers.closeOutside = false;
  app.drawers.bottom.open = !app.drawers.bottom.open;
}

</script>

<template>
<BasePanel class="disclaimer-panel" :class="classnames(`relative`)">
  <template v-slot:headerSlot>
    <BaseHeader ref="headerRef" class="center-container" :innerClassName="`pxlr-30 pxt-18`">
      <template v-slot:headerLeft>
        <div class="flex justify-center mxb-40"><img :src="Logo" width="120" height="89" /></div>
      </template>
    </BaseHeader>
  </template>

  <div class="side-content pxlr-0 pxt-20 pxb-0 relative">
    <div class="pxlr-0 height-100">

      <div class="content-scroller relative">
        <div ref="divScrollerRef"  @scroll="handleScroll" class="inner-scroller pxb-60 pxlr-16">
          
          <p>This section is intended to give the reader information on medication alterations specific to ECMO. 
            These recommendations are based on the best level of evidence currently available. Please refer to your 
            standard drug references for other details on these medications such as doses, 
            side-effects, or interactions.</p>

        </div>

        <div class="scroll-fade absolute lx-0 bx-8 pointer-none"></div>
      </div>

      <div class="confirm-panel absolute lx-0 bx-0 flex align-start justify-center width-100 pxlr-60 gapx-20">

        <BaseButton 
          class="variant-red" 
          :class="[{  
            ['disabled']: !hasScrolledEnd
          }]"
          :elementClassName="classnames(`width-100 mxtb-10`, {})"
          :innerClassName="`px-13 justify-center`" 
          :label="`I UNDERSTAND`"
          @triggered="() => onMenuTriggered(1)"
        />
        
      </div>
    </div>
  </div>
  
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
    height: calc(100% - ($footer-height));
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
      // box-shadow: 0px 10px 20px 2px #0B247A26;
    }
  }

  .confirm-panel {
    height: 90px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    background-color: white;
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
  // html:not(.desktop) & {
  //   :deep(.inner-panel) {
  //     background-color: rgba(white, .85);
  //     backdrop-filter: blur(10px);
  //   }
  // }
}

</style>

<style lang="scss">
.base-panel.disclaimer-panel {
  .side-content {
    height: calc(100% - (112px));
  }
  :deep(.content-scroller) {
    height: calc(100%);
  }

  html.ios & {
    // iOS Top Padding 40px
    .side-content { 
      height: calc(100% - (112px + 40px));
    }
  }
}
</style>
