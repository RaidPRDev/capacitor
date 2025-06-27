<script lang="ts">
export default {
  inheritAttrs: false,
  name: "TermsAndConditionsPanel"
}   
</script>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import classnames from "classnames";
import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import PrivacyPolicyPanel from "@/components/panels/PrivacyPolicyPanel.vue";

import { APP_ID, APP_DRAWERS_ID } from '@/_core/Constants';
import { IApp, IAppDrawerComponents } from '@/types';
import useSession from '@/store/session.module';
import { storeToRefs } from 'pinia';

import Logo from '/assets/elso_logo.png';
import CloseIcon from '@/assets/icons/close-icon.svg';


const app = inject<IApp>(APP_ID) as IApp;
const drawerComponents = inject<IAppDrawerComponents>(APP_DRAWERS_ID) as IAppDrawerComponents;

const session = useSession();
const { hasCompletedTerms } = storeToRefs(session);

const divScrollerRef = ref<HTMLElement>();
const hasScrolledEnd = ref<boolean>(false);

function handleScroll() {
  if (!divScrollerRef?.value || hasScrolledEnd?.value) return;

  const div = divScrollerRef.value;
  if (div.scrollTop + div.clientHeight >= div.scrollHeight - 20) {
    hasScrolledEnd.value = true;
  }
}

function onMenuTriggered(selected: number) {
  
  switch (selected) {
    case 0: // Decline
      session.$patch({ hasCompletedTerms: false })
    break;

    case 1: // Accept
      Haptics.impact({ style: ImpactStyle.Light });
      session.$patch({ hasCompletedTerms: true })
    break;
  }

  app.drawers.closeOutside = false;
  app.drawers.bottom.open = !app.drawers.bottom.open;
}

function onLink(e:Event) {
  const el = e.target as HTMLElement;
  if (!el) return;

  // console.log("el.dataset.id", el.dataset.id);

  // Close this panel and open target
  app.drawers.closeOutside = false;
  app.drawers.bottom.open = !app.drawers.bottom.open;

  setTimeout(() => {

    if (el.dataset.id === "privacy") {
      drawerComponents.bottom = PrivacyPolicyPanel;
      app.drawers.bottom.props = { name: "privacy-policy" }
      app.drawers.bottom.closeOutside = false;
      app.drawers.bottom.open = !app.drawers.bottom.open;
    }

  }, 550);
}

</script>

<template>
<BasePanel :class="classnames(`terms-panel`, `relative`, { ['accepted']: hasCompletedTerms })">
  <template v-slot:headerSlot>
    <BaseHeader ref="headerRef" class="center-container" :innerClassName="`pxlr-30 pxt-18`">
      <template v-slot:headerLeft>
        <div class="flex justify-center mxb-40"><img :src="Logo" width="120" height="89" /></div>
      </template>
    </BaseHeader>
  </template>

  <div class="side-content pxlr-0 pxt-20 pxb-0 relative">
    <div class="pxlr-0 height-100">

      <div class="title width-100 text-center mxb-30">Terms & Conditions</div>
    
      <div class="content-scroller relative">
        <div class="inner-scroller pxb-60 pxlr-16" ref="divScrollerRef" @scroll="handleScroll">
          
          <p class="p-title">TERMS OF USE</p>
          <p>Extracorporeal Life Support Organization (ELSO)’s ECMO Bedside Guide App (the “App”) is comprised of various content owned and operated by ELSO.</p>

          <p>Please read these Terms of Use carefully. Your continued use of the App constitutes your agreement to these Terms of Use; if you do not agree, do not use the App.</p>

          <p class="p-title">MODIFICATION OF THESE TERMS OF USE</p>
          <p>ELSO may amend these Terms of Use and/or ELSO’s <span class="a-link" @click.prevent="onLink" data-id="privacy">[Privacy Policy]</span> for the App from time to time by posting the amended Terms of Use and/or Privacy Policy on the App. Any amendments to these Terms of Use and/or the Privacy Policy shall be effective immediately on posting to the App. Your continued use of the App following posting of amended Terms of Use and/or Privacy Policy constitutes your acceptance of the posted amendment.</p>

          <p class="p-title">DISCLAIMER</p>
          <p>ELSO’s ECMO Bedside Guide App is intended for educational use to provide useful information easily accessible to clinical care professionals in assessing the conditions and managing the treatment of patients undergoing ECLS/ECMO or assessing candidacy for ECLS/ECMO. Content may change from time to time as new information becomes available. ELSO is under no obligation to provide updates. The aim of ELSO’s ECMO Bedside Guide App is to help clinicians make informed decisions about their patients. However, any content provided through this app does not guarantee a successful outcome. Ultimately, healthcare professionals must make their own treatment decisions about care on a case-by-case basis, after consultation with their patients, using their clinical judgement, knowledge, and expertise. Any content included in ELSO’s ECMO Bedside Guide App does not take the place of physicians’ and other health professionals’ judgment in diagnosing and treatment of any patient. Content provided through ELSO’s ECMO Bedside Guide App does not establish a standard of care. The content provided cannot be deemed inclusive of all proper methods of care nor exclusive of other methods of care reasonably directed at obtaining the same results. The ultimate judgment must be made by the physician and other health professionals and the patient in light of all the circumstances presented by the individual patient, and the known variability and biological behavior of the clinical condition. 
            <i>In no event will ELSO be liable for any decision made or action taken in reliance upon the information provided through ELSO’s ECMO Bedside Guide App.</i></p>

          <p class="p-title">LINKS TO THIRD PARTY SITES</p>
          <p>The App may contain links to websites ("Linked Sites"). The Linked Sites are not under the control of ELSO and ELSO is not responsible for the contents of any Linked Site, including without limitation any link contained in a Linked Site, or any changes or updates to a Linked Site. ELSO is not responsible for webcasting or any other form of transmission received from any Linked Site. ELSO provides these links to you only as a convenience, and the inclusion of any link does not imply endorsement by ELSO of the Linked Site or any association with its operators. The content of such Linked Sites is developed and provided by others. Nothing in these Terms will be deemed to be a representation or warranty by ELSO with respect to any Linked Sites. ELSO has no obligation to monitor Linked Sites and may block or disable access to any Linked Sites (in whole or part) through the App at any time.</p>

          <p class="p-title">NO UNLAWFUL OR PROHIBITED USE</p>
          <p>As a condition of your use of the App, you warrant to ELSO that you will not use the App for any purpose that is unlawful or prohibited by these Terms of Use. You may not use the App in any manner which could damage, disable, overburden, or impair the App or interfere with any other party's use and enjoyment of the App. You may not obtain or attempt to obtain any materials or information through any means not intentionally made available or provided for through the App.</p>

          <p class="p-title">USE OF MATERIALS</p>
          <p>All material on the App, including, without limitation, the ELSO Registry, the ELSO Guidelines, all other publications, all text, user interfaces, visual interfaces, photographs, videos, trademarks, logos, sounds, music, artwork, files, documents, images, software code or other materials (collectively, the "Materials"), including but not limited to the compilation of such Materials on the App, are owned by ELSO or other parties that have licensed their material to ELSO, and are protected by copyright, trademark, and other intellectual property and unfair competition laws.</p>

          <p>Except as expressly provided in these Terms of Use, no part of the App and no Materials may be copied, reproduced, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted or distributed in any way (including "mirroring") to any other computer, server, website or other medium for publication or distribution or for any commercial enterprise, without ELSO’s express prior written consent. You may not use any data mining, robots, or similar data gathering and extraction tools on the Materials, frame any portion of the App or Materials, or circumvent any mechanisms included in the Materials for preventing the unauthorized reproduction or distribution of the Materials.</p>

          <p>All rights not expressly granted in these Terms of Use by ELSO to you are reserved by ELSO and/or its licensors.</p>

          <p class="p-title">ELSO TRADEMARKS</p>
          <p>ELSO’s names and logos are trademarks and service marks owned and used by ELSO (the “ELSO Marks”). All other trademarks and service marks on the App are the property of their respective owners. You are not authorized to use the ELSO Marks without the prior written consent of ELSO. Requests for authorization should be made 
            to <a class="a-link" href="mailto:support@elso.org?subject=Bedside Guide App&body=Add your message">support@elso.org</a>.</p>

          <p class="p-title">SUBMISSIONS PROVIDED TO ELSO</p>
          <p>By submitting, sending or otherwise making available information or other material on or though the App (“Submission”), you grant to ELSO the royalty-free, unrestricted, world-wide, perpetual, irrevocable right and license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform and display such Submission (in whole or part) worldwide and/or to incorporate it in other works in any form, media, or technology now known or later developed and warrant that you own or control the rights to the Submission and that you have all necessary rights to submit, send or otherwise make available the Submission and grant such right and license to ELSO. You also warrant that any “moral rights” you have in such Submission have been waived.</p>

          <p class="p-title">YOUR REPRESENTATIONS AND WARRANTIES</p>
          <p>By using the App, you represent and warrant that:</p>
          <ul>
              <li>You are at least 13 years old or older.</li>
              <li>You shall at all times comply with all applicable laws, rules and regulations with respect to your use of the App and with respect to any product or service related thereto.</li>
              <li>You shall not use the App to infringe, misappropriate or violate any rights of ELSO and/or any third party.</li>
              <li>You shall comply at all times with these Terms of Use.</li>
              <li>You are the owner or permitted licensee of any Submission that you upload or 
                provide to the App and have the complete right and ability to provide such Submission to 
                the App. Further, you will not violate any agreement you have with any third party by 
                uploading or providing a Submission to the App.</li>
          </ul>
          
          <p class="p-title">MATERIALS AND WARRANTY DISCLAIMER</p>
          <p>The materials, information, software, products, and services included in or available through the app may include inaccuracies or typographical errors. Changes are periodically made to the information contained on the app. Elso and/or its suppliers may make improvements and/or changes in the app at any time. Advice received via the app should not be relied upon for medical advice and you should consult an appropriate professional for specific advice tailored to your situation. Without limiting the generality of the foregoing, Elso makes no representations or warranties with respect to any information offered or provided within or through the app regarding treatment of medical conditions, action, or application of medication, including that of ECMO. The information offered or provided within or through the app does not guarantee access to ECMO, nor that ECMO will work for any particular patient. Elso does not provide any form of medical care, medical opinion, medical advice, diagnosis, or treatment, and Elso does not evaluate the need to seek medical attention, through the app or any services. The information on the app may be changed without notice and is not guaranteed to be complete, correct, timely, current or up-to-date. Similar to any printed materials, the information may become out-of-date. Elso undertakes no obligation to update any information on the app. Information provided and the use of any products or services received from the app by you does not create a doctor-patient relationship between you and any of the health professionals affiliated with the app (if any).</p>
          <p>Elso and/or its suppliers make no representations or warranties about the suitability, reliability, availability, timeliness, and accuracy of the materials, information, software, products, services and related graphics contained on the app for any purpose. To the maximum extent permitted by applicable law, all such materials, information, software, products, services and related graphics are provided "as is" without warranty or condition of any kind. Elso and/or its suppliers hereby disclaim all warranties and conditions with regard to the materials, information, software, products, services and related graphics, including all implied warranties or conditions of merchantability, fitness for a particular purpose, title and non-infringement.</p>
          <p>Elso does not warrant that the app will be available or operate in an uninterrupted, delay or error-free manner (including, without limitation, any errors, delay or interruptions due to problems with communication lines or systems, acts of God or failure of a telecommunications service provider to provide connectivity), or that errors or defects will be corrected, or that the server that makes the app available are free from any harmful components, including viruses.</p>
         
          <p class="p-title">LIMITATION OF LIABILITY</p>
          <p>To the maximum extent permitted by applicable law, in no event shall Elso and/or its suppliers be liable for any direct, indirect, punitive, incidental, special, consequential damages or any damages whatsoever including, without limitation, damages for loss of use, data or profits, arising out of or in any way connected with the use or performance of the app, with the delay or inability to use the app or related services, the provision of or failure to provide services, or for any materials, information, software, products, services and related graphics obtained through the app, or otherwise arising out of the use of the app, whether based on contract, tort, negligence, strict liability or otherwise, even if Elso or any of its suppliers has been advised of the possibility of damages. Because some states/jurisdictions do not allow the exclusion or limitation of liability for consequential or incidental damages, the above limitation may not apply to you. If you are dissatisfied with any portion of the app, or with any of these terms of use, your sole and exclusive remedy is to discontinue using the app. To the extent the foregoing limitation of liability is, in whole or in part, held to be inapplicable or unenforceable for any reason, then the aggregate liability of Elso and/or its suppliers for any reason and upon any cause of action arising from or related to the app or the subject matter of these terms, in contract, strict liability warranty, tort (including negligence), or otherwise, shall be limited to direct damages actually incurred up to fifty ($50) US dollars. These limitations of liability shall apply even if a limited remedy fails of its essential purpose. The provisions of this paragraph are independent of, severable from, and to be enforced independently of any other enforceable or unenforceable provision of these terms.</p>
          
          <p class="p-title">INDEMNITY</p>
          <p>You agree to indemnify, defend and hold harmless ELSO, its officers, directors, affiliates, successors, assigns, employees, and agents for, from, and against any claims, demands, obligations, liabilities, losses, costs, damages, fines, and expenses, including reasonable attorneys' and consultants' fees and expenses, made against ELSO by any third party due to or arising out of or in connection with your use of the App.</p>

          <p class="p-title">TERMINATION/ACCESS RESTRICTION</p>
          <p>ELSO reserves the right, in its sole discretion, to terminate your access to the App and the related services or any portion thereof, or otherwise restrict, at any time, without notice.</p>

          <p class="p-title">GENERAL</p>
          <p>To the maximum extent permitted by law, you agree that all matters relating to your access to or use of the App, including all disputes, will be governed by the laws of the United States and by the laws of the State of Michigan without regard to its conflicts of law’s provisions. You agree to the personal jurisdiction by and venue in the state and federal courts in Washtenaw County, Michigan, and waive any objection to such jurisdiction or venue. Use of the App is unauthorized in any jurisdiction that does not give effect to all provisions of these terms and conditions, including without limitation this paragraph. You agree that no joint venture, partnership, employment, or agency relationship exists between you and ELSO as a result of these Terms of Use or your use of the App. Nothing contained in these Terms of Use is in derogation of ELSO's right to comply with governmental, court and law enforcement requests or requirements relating to your use of the App or information provided to or gathered by ELSO with respect to such use. If any part of these Terms of Use is determined to be invalid or unenforceable pursuant to applicable law including, but not limited to, the warranty disclaimers and liability limitations set forth above, then the invalid or unenforceable provision will be deemed superseded by a valid, enforceable provision that most closely matches the intent of the original provision and the remainder of the Terms of Use shall continue in effect. These Terms of Use and the ELSO Privacy Policy constitute the entire agreement between you and ELSO with respect to your use of the App, and supersede all prior agreements between the parties, whether written or oral, relating to your use of the App.</p>
          
          
          <p class="p-title">DIGITAL MILLENNIUM COPYRIGHT ACT (DMCA) NOTICES</p>
          <p>If you believe that your work has been copied in a way that constitutes copyright infringement, please send written notification to ELSO: <a class="a-link" href="mailto:support@elso.org?subject=Bedside Guide App&body=Add your message">support@elso.org</a>.</p>
          <ul>
              <li>You should only send notice of potential copyright infringement to ELSO’s Designated Agent. For all other inquiries (e.g., requests for technical assistance or customer service, reports of email abuse, and piracy reports), please contact us through ELSO’s contact page.</li>
              <li>
                Your written notification must include the following:
                <ul>
                  <li>An electronic or physical signature of the owner or of the person authorized to act on behalf of the owner of the copyright interest;</li>
                  <li>A description of the copyrighted work that you claim has been infringed;</li>
                  <li>A description of the material you claim to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material;</li>
                  <li>Your address, telephone number, and e-mail address;</li>
                  <li>A statement by you that you have a good-faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law; and</li>
                  <li>A statement by you made under penalty of perjury, that the above information in your notice is accurate and that you are the copyright owner or authorized to act on the copyright owner's behalf.</li>
                </ul>
              </li>
          </ul>
          
          <p>November 10, 2024</p>

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

    .a-link {
      color: $sixth-color;
      font-weight: 500;
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

          .ui-background {
            background: none;
          }
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
.base-panel.terms-panel {
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