<script lang="ts">
export default {
  inheritAttrs: false,
  name: "ImagePreviewPanel"
}   
</script>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue';
import PinchZoom from "pinch-zoom-js";

import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";

import { APP_ID } from '@/_core/Constants';
import { IApp } from '@/types';

import Logo from '/assets/elso_logo.png';
import CloseIcon from '@/assets/icons/close-icon.svg';

interface IImagePreviewPanel {
  source: string;
}

// Component Props Setup
const props = withDefaults(defineProps<IImagePreviewPanel>(), {}) 

const app = inject<IApp>(APP_ID) as IApp;
const divScrollerRef = ref<HTMLElement>();

onMounted(() => {
  if (!divScrollerRef?.value) return;

  new PinchZoom(divScrollerRef.value, { 
    draggableUnzoomed: false, 
    setOffsetsOnce: true 
  });
})

</script>

<template>
<BasePanel class="preview-panel"
  :class="[``]">
  <template v-slot:headerSlot>
    <BaseHeader ref="headerRef" class="center-container" :innerClassName="`pxlr-30 pxt-18`">
      <template v-slot:headerLeft>
        <div class="flex justify-center mxb-40"><img :src="Logo" width="120" height="89" /></div>
      </template>
    </BaseHeader>
  </template>

  <div class="side-content pxlr-0 pxt-0 pxb-0 relative">
    <div class="pxlr-0 height-100">
      <div ref="divScrollerRef" class="relative px-16 height-inherit">
        <img :src="props?.source" />  
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
  $header-height: 152px;
  $header-padding: 20px;
  $header-title: 24px;
  $header-title-padding: 30px;
  $footer-height: 90px;
  $scroller-bottom: 20px;

  .side-content {
    height: calc(100% - ($header-height));

    img { max-width: 100%; }
  }

  .title {
    font-family: $secondary-font-family;
    font-size: 24px;
    font-weight: 500;
  }

  :deep(.inner-panel) {
    background-color: white;

    .base-header {
      img {
        width: 72px;
        height: 54px;
      }
    }
  }
}

</style>

<style lang="scss">
.base-panel.preview-panel {
  html.ios & {
    // iOS Top Padding 40px
    .side-content { 
      height: calc(100% - (152px + 40px));
    }
  }
}
</style>
