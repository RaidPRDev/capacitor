<script lang="ts">
export default {
  inheritAttrs: false,
  name: "PrivacyPolicyPanel"
}   
</script>

<script setup lang="ts">
import { inject } from 'vue';
import { storeToRefs } from 'pinia';
import classnames from 'classnames';
import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";

import useSession from '@/store/session.module';
import { APP_ID } from '@/_core/Constants';
import { IApp } from '@/ui/types';

import Logo from '/assets/elso_logo.png';
import CloseIcon from '@/assets/icons/close-icon.svg';

const session = useSession();
const { hasCompletedPrivacy } = storeToRefs(session);

const app = inject<IApp>(APP_ID) as IApp;

function onMenuTriggered(selected: number) {
  
  switch (selected) {
    case 0: // Decline
      session.$patch({ hasCompletedPrivacy: false })
    break;

    case 1: // Accept
      session.$patch({ hasCompletedPrivacy: true })
    break;
  }

  app.drawers.closeOutside = false;
  app.drawers.bottom.open = !app.drawers.bottom.open;
}

</script>

<template>
<BasePanel :class="classnames(`relative`, { ['accepted']: hasCompletedPrivacy })">
  <template v-slot:headerSlot>
    <BaseHeader ref="headerRef" class="center-container" :innerClassName="`pxlr-30 pxt-18`">
      <template v-slot:headerLeft>
        <div class="flex justify-center mxb-40"><img :src="Logo" width="120" height="89" /></div>
      </template>
    </BaseHeader>
  </template>

  <div class="side-content pxlr-0 pxt-20 pxb-0 relative">
    <div class="pxlr-0 height-100">

      <div class="title width-100 text-center mxb-30">Privacy Policy</div>
    
      <div class="content-scroller relative pxlr-16">
        <div class="inner-scroller pxb-40">
          <p class="p-title">First Point:</p>
          <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.</p>
          <p>Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias.</p>
        </div>

        <div class="scroll-fade absolute lx-0 bx-8"></div>
      </div>

      <div class="confirm-panel absolute lx-0 bx-0 flex align-center justify-center width-100 pxlr-60 gapx-20">

        <BaseButton 
          class="variant-red cancel" 
          :elementClassName="classnames(`width-100 mxtb-10`, {})"
          :innerClassName="`px-13 justify-center`" 
          :label="`Decline`"
          @triggered="() => onMenuTriggered(0)"
        />
        
        <BaseButton 
          class="variant-red" 
          :elementClassName="classnames(`width-100 mxtb-10`, {})"
          :innerClassName="`px-13 justify-center`" 
          :label="`Accept`"
          @triggered="() => onMenuTriggered(1)"
        />
        
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