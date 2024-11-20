<script lang="ts">
export default {
  inheritAttrs: false,
  name: "PrivacyPolicyPanel"
}   
</script>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import classnames from 'classnames';

import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";

import useSession from '@/store/session.module';
import { APP_ID } from '@/_core/Constants';
import { IApp } from '@/types';

import Logo from '/assets/elso_logo.png';
import CloseIcon from '@/assets/icons/close-icon.svg';

const session = useSession();
const { hasCompletedPrivacy } = storeToRefs(session);

const divScrollerRef = ref<HTMLElement>();
const hasScrolledEnd = ref<boolean>(false);
function handleScroll() {
  if (!divScrollerRef?.value || hasScrolledEnd?.value) return;

  const div = divScrollerRef.value;
  if (div.scrollTop + div.clientHeight >= div.scrollHeight - 20) {
    hasScrolledEnd.value = true;
  }
}

const app = inject<IApp>(APP_ID) as IApp;

function onMenuTriggered(selected: number) {
  
  switch (selected) {
    case 0: // Decline
      session.$patch({ hasCompletedPrivacy: false })
    break;

    case 1: // Accept
      Haptics.impact({ style: ImpactStyle.Light });
      session.$patch({ hasCompletedPrivacy: true })
    break;
  }

  app.drawers.closeOutside = false;
  app.drawers.bottom.open = !app.drawers.bottom.open;
}

</script>

<template>
<BasePanel :class="classnames(`privacy-panel`, `relative`, { ['accepted']: hasCompletedPrivacy })">
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
    
      <div class="content-scroller relative">
        <div class="inner-scroller pxb-60 pxlr-16" ref="divScrollerRef" @scroll="handleScroll">
          
          <p class="p-title">PRIVACY POLICY</p>
          <p>Extracorporeal Life Support Organization (“ELSO”) is committed to protecting your privacy and has created this Privacy Policy to describe the information we collect about you when you download and use ELSO’s ECMO Bedside Guide App (the “App”), how that information may be used and disclosed and how we protect your information. This Privacy Policy applies to the App and governs data collection and usage. By using the App, you consent to the data practices described in this Privacy Policy.</p>

          <p class="p-title">Collection of your Personal Information</p>
          <p>ELSO collects personally identifiable information, such as your name, e-mail address, address or telephone number. ELSO also collects demographic information such as your role, title, place of work.</p>

          <p>There is information about your hardware and software that is automatically collected by ELSO. This information is used by ELSO for the operation of its services, to maintain quality of the services, and to provide general statistics regarding use of the App.</p>

          <p>The App uses “cookies” to help you personalize your online experience. “Cookies” are small pieces of information that are stored by a user’s Internet browser on a user’s device. You have the ability to accept or decline cookies. Most Web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. If you choose to decline cookies, you may not be able to fully experience the interactive features of the ELSO services or the App.</p>

          <p class="p-title">Use of your Personal Information</p>
          <p>ELSO collects and uses your personal information to operate the App and deliver the services you have requested. ELSO also uses your personally identifiable information to inform you of other products or services available from ELSO and its affiliates. ELSO may also contact you via surveys to conduct research about your opinion of current services or of potential new services that may be offered.</p>

          <p>ELSO does not sell, rent, or lease its customer lists to third parties. ELSO may, from time to time, contact you on behalf of external business partners about a particular offering that may be of interest to you. In those cases, your unique personally identifiable information (name, e-mail, address, telephone number) is not transferred to the third party. In addition, ELSO may share data with trusted partners to help us perform statistical analysis, send you e-mail or postal mail, provide customer support, or arrange for deliveries. All such third parties are prohibited from using your personal information except to provide these services to ELSO, and they are required to maintain the confidentiality of your information.</p>

          <p>Due to the existing regulatory environment, we cannot ensure that all of your private communications and other personally identifiable information will never be disclosed in ways not otherwise described in this Privacy Policy. ELSO will disclose your personal information, without notice, only if required to do so by law or in the good faith belief that such action is necessary to: (a) conform to the law or comply with legal process served on ELSO; (b) protect and defend the rights or property of ELSO; and, (c) act under exigent circumstances to protect the personal safety of users of the App or the public.</p>

          <p class="p-title">Security of your Personal Information</p>
          <p>ELSO secures your personal information from unauthorized access, use or disclosure as described in the Terms of Use on the App.</p>

          <p>ELSO makes every effort to protect your information. However:</p>

          <p>ELSO CANNOT GUARANTEE SECURITY OR PRIVACY. ELSO ASSUMES NO RESPONSIBILITY OR LIABILITY FOR DISCLOSURE OF YOUR PERSONAL INFORMATION THAT OCCURS BY NEGLIGENCE OF ELSO, ERRORS IN TRANSMISSION, UNAUTHORIZED OR ILLEGAL ACCESS, OR ANY OTHER VEHICLE FOR DISCLOSURE.</p>

          <p>THE APP CONTAINS LINKS TO OTHER WEBSITES. ELSO IS NOT RESPONSIBLE FOR THE CONTENT, TERMS OF USE, OR PRIVACY POLICIES ON ANY THIRD-PARTY WEBSITES, OR PRIVACY PRACTICES BY ANY THIRD PARTIES.</p>

          <p class="p-title">Children Under Thirteen</p>
          <p>ELSO does not knowingly accept personal information from anyone under the age of 13. By using the App and/or providing personal information, you represent and warrant that you are over the age of 13.</p>

          <p class="p-title">Changes to this Privacy Policy</p>
          <p>ELSO may amend this Privacy Policy from time to time by posting the amended terms on this App.</p>

          <p class="p-title">Contact Information</p>
          <p>If you have any questions about ELSO’s Privacy Policy, please contact us at: <a href="mailto:support@elso.org">support@elso.org</a>.</p>

        </div>

        <div class="scroll-fade absolute lx-0 bx-8 pointer-none"></div>
      </div>

      <div class="confirm-panel absolute lx-0 bx-0 flex align-center justify-center width-100 pxlr-60 gapx-20">

        <BaseButton 
          class="variant-red cancel" 
          :class="[{  
            ['disabled']: !hasScrolledEnd
          }]"
          :elementClassName="classnames(`width-100 mxtb-10`, {})"
          :innerClassName="`px-13 justify-center`" 
          :label="`Decline`"
          @triggered="() => onMenuTriggered(0)"
        />
        
        <BaseButton 
          class="variant-red" 
          :class="[{  
            ['disabled']: !hasScrolledEnd
          }]"
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

      &.cancel:not(.disabled) {
        .inner-base-button {
          background: linear-gradient(106.56deg, #0B247A 0%, #2C51CF 100%);
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
.base-panel.privacy-panel {
  .side-content {
    // Title Height 24px
    height: calc(100% - (112px + 24px));
  }
  :deep(.content-scroller) {
    height: calc(100%);
  }

  html.ios & {
    // Title Height 24px
    // iOS Top Padding 40px
    .side-content { 
      height: calc(100% - (112px + 24px + 40px));
    }
  }
}
</style>