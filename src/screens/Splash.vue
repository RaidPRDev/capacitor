<script lang="ts">
export default {
  inheritAttrs: true,
  name: "Splash"
}   
</script>

<script setup lang="ts">
import { inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import classnames from "classnames";

import BaseButton from '@/ui/controls/BaseButton.vue';
import FullScreen from "@/ui/panels/FullScreen.vue";
import TermsAndConditionsPanel from "@/components/panels/TermsAndConditionsPanel.vue";
import PrivacyPolicyPanel from "@/components/panels/PrivacyPolicyPanel.vue";

import { APP_DRAWERS_ID, APP_ID } from "@/_core/Constants";
import { IApp, IAppDrawerComponents } from "@/types";
import useSession from "@/store/session.module";
import useToasterService from '@/ui/notifications/toaster/AppToastService';
import useBranchingStore from "@/store/branching.module";
import { capitalizeFirstLetter } from "@/utils/StringTools";
import { storeToRefs } from "pinia";

import Logo from '/assets/elso_logo.png';

const router = useRouter();
const session = useSession();
const { hasCompletedPrivacy, hasCompletedTerms } = storeToRefs(session);

const branchingStore = useBranchingStore();
const { 
  getCurrentReferredView,  
  removeAllReferralViews 
} = branchingStore;

const app = inject<IApp>(APP_ID) as IApp;
const drawerComponents = inject<IAppDrawerComponents>(APP_DRAWERS_ID) as IAppDrawerComponents;

const toasterService = useToasterService();
/** @ts-ignore */
const { addToast } = toasterService;

function onMenuTriggered(selected: number) {
  // addToast({ label: "Test" });
  // addToast({ 
  //   hasAutoClose: false,
  //   component: shallowRef(FavoriteAddedToast), 
  //   componentProps: { 
  //     label: "Component Toast"
  //   } 
  // });
  // return;

  switch (selected) {
    case 0: // Terms
      drawerComponents.bottom = TermsAndConditionsPanel;
      app.drawers.bottom.closeOutside = false;
      app.drawers.bottom.open = !app.drawers.bottom.open;
    break;

    case 1: // Privacy
      drawerComponents.bottom = PrivacyPolicyPanel;
      app.drawers.bottom.closeOutside = false;
      app.drawers.bottom.open = !app.drawers.bottom.open;
    break;
    
    case 2: // Start
      if (hasCompletedPrivacy.value && hasCompletedTerms.value) router.push({ name: "Home" });
    break;
  }
}

const APP_VERSION = import.meta.env.APP_VERSION;
const BUILD_NUMBER = import.meta.env.BUILD_NUMBER;
const PLATFORM_NAME = capitalizeFirstLetter(import.meta.env.PLATFORM);

onMounted(() => {
  const currentReferralView = getCurrentReferredView();
  if (currentReferralView) {
    removeAllReferralViews();
  }
})

</script>

<template>
<FullScreen 
  className="splash" 
  innerClassName="inner-splash"
  :bodySlotProps="{ class: 'splash-body flex align-center justify-center px-20' }" 
>
  <template v-slot:bodySlot>
    <div class="relative width-inherit height-100 flex flex-column justify-start ptb-3">
      <div class="flex justify-center mxb-80"><img :src="Logo" width="120" height="89" /></div>
      
      <div class="flex justify-center pxlr-20 width-100">
        <div class="width-100">
          <div class="splash-title text-center white-space width-100">ECMO<br>Bedside Guide</div>
          
          <Transition name="fade" :duration="750" mode="out-in">
            <div v-if="!hasCompletedPrivacy || !hasCompletedTerms" class="splash-description text-center width-100">
              <div class="splash-welcome text-center white-space width-100">Welcome!</div>
              Please read and agree to our Terms and Conditions and Privacy Policy.
            </div>
            <div v-else-if="hasCompletedPrivacy && hasCompletedTerms" class="splash-description text-center width-100 mxt-20">
              Tap <b>START</b> to continue
            </div>
          </Transition>
        </div>
      </div>

      <div class="absolute bx-60 width-100">
        <BaseButton 
          class="variant-red" 
          :elementClassName="classnames(`width-100 mxtb-10`, { [`hide`]: hasCompletedTerms })"
          :innerClassName="`px-13 justify-center`" 
          :label="`Terms & Conditions`"
          @triggered="() => onMenuTriggered(0)"
        />
        
        <BaseButton 
          class="variant-red" 
          :elementClassName="classnames(`width-100 mxtb-10`, { [`hide`]: hasCompletedPrivacy })"
          :innerClassName="`px-13 justify-center`" 
          :label="`Privacy Policy`"
          @triggered="() => onMenuTriggered(1)"
        />
        
        <BaseButton 
          v-show="hasCompletedTerms || hasCompletedPrivacy"
          class="variant-red" 
          :elementClassName="classnames(`width-100 mxtb-10`, { [`disabled`]: !hasCompletedTerms || !hasCompletedPrivacy })"
          :innerClassName="`px-13 justify-center`" 
          :label="`Start`"
          @triggered="() => onMenuTriggered(2)"
        />
      </div>
      
      <div class="version absolute bx-0 width-100 text-center">
        {{ `Version: ${APP_VERSION} | Build: ${BUILD_NUMBER} | ${PLATFORM_NAME}` }}
      </div>
    </div>
  </template>
  
</FullScreen>
</template>

<style scoped lang="scss">
.splash {
  font-family: $secondary-font-family;

  :deep(.inner-splash) {
    background: linear-gradient(-104deg, $secondary-blue 10%, $primary-color 100%);

    .variant-red {
        
      .inner-base-button {
        background: $fifth-color;
      }
      
      .ui-background {
        background: $red-gradient;
      }
  
      .ui-label {
        font-size: 18px;
        font-weight: 700;
        line-height: 21.6px;
        height: 21px;
      }

      &.disabled {
        opacity: 1;
        .inner-base-button {
          background: $fourth-color;
        }
      }
    }
  }

  .splash-title {
    color: white;
    font-size: 44px;
    font-weight: 300;
    line-height: 52px;
    margin: 0 0 2rem 0;
    text-align: left;
  }
  
  .splash-welcome {
    color: white;
    font-size: 34px;
    font-weight: 200;
    line-height: 40px;
    margin: 0 0 1rem 0;
    text-align: left;
  }
  
  .splash-description {
    color: white;
    font-size: 22px;
    font-weight: 200;
    line-height: 28px;
    text-align: left;

    b {
      font-weight: 500;
    }
  }

  .version {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.35);
  }
}
</style>