<script lang="ts">
export default {
  inheritAttrs: false,
  name: "PrivacyPolicyPanel"
}   
</script>

<script setup lang="ts">
import { inject, ref } from 'vue';
import { storeToRefs } from 'pinia';
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

</script>

<template>
<BasePanel :class="classnames(`acknowledgments-panel`, `relative`, { ['accepted']: hasCompletedPrivacy })">
  <template v-slot:headerSlot>
    <BaseHeader ref="headerRef" class="center-container" :innerClassName="`pxlr-30 pxt-18`">
      <template v-slot:headerLeft>
        <div class="flex justify-center mxb-40"><img :src="Logo" width="120" height="89" /></div>
      </template>
    </BaseHeader>
  </template>

  <div class="side-content pxlr-0 pxt-20 pxb-0 relative">
    <div class="pxlr-0 height-100">

      <div class="title width-100 text-center mxb-30">Acknowledgements</div>
    
      <div class="content-scroller relative">
        <div class="inner-scroller pxb-60 pxlr-16" ref="divScrollerRef" tabindex="0" @scroll="handleScroll">
          
          <section class="ack-section">
            <h2 class="ack-title">Editor in Chief</h2>
            <div class="ack-name">Giles Peek, MD, FELSO</div>
          </section>

          <section class="ack-section">
            <h2 class="ack-title">Senior Editor</h2>
            <div class="ack-name">Erika O'Neil, MD</div>
          </section>

          <section class="ack-section">
            <h2 class="ack-title">Editor</h2>
            <div class="ack-name">Graeme MacLaren, MBBS, FELSO</div>
            <div class="ack-name">Marta Velia Antonini, MSc, Perfusionist</div>
            
          </section>

          <section class="ack-section">
            <h2 class="ack-title">Publications Chair</h2>
            <div class="ack-name">KR Ramanathan, MBBS, DNB</div>
          </section>
         
          <section class="ack-section">
            <h2 class="ack-title">Section Leads</h2>
            <div class="ack-name">Marta Velia Antonini, TFCPC, MSc</div>
            <div class="ack-name">Thomas Brogan, MD</div>
            <div class="ack-name">Rodrigo Diaz, MD, FELSO</div>
            <div class="ack-name">Amy Dzierba, PharmD</div>
            <div class="ack-name">Roberto Lorusso, MD, PhD, FELSO</div>
            <div class="ack-name">Thomas Staudinger, MD</div>
            <div class="ack-name">Allison Weinberg, CCP, MHA</div>

          </section>

          <section class="ack-section">
            <h2 class="ack-title">Contributing Authors</h2>
            <div class="ack-name">Darryl Abrams, MD</div>
            <div class="ack-name">Cara Agerstrand, MD</div>
            <div class="ack-name">Huda Alfoudri, MD</div>
            <div class="ack-name">Nada Aljassim, MD</div>
            <div class="ack-name">Catalina Alvarado, PCC</div>
            <div class="ack-name">Gail Annich, MD, FELSO</div>
            <div class="ack-name">Jutta Arens, PhD</div>
            <div class="ack-name">Eduard Argudo, MD</div>
            <div class="ack-name">Jana Assy, MD</div>
            <div class="ack-name">Mohammed Azzam, MD</div>
            <div class="ack-name">Jenelle Badulak, MD</div>
            <div class="ack-name">Nicholas Barrett, MBBS</div>
            <div class="ack-name">Robert Bartlett, MD, FELSO</div>
            <div class="ack-name">Jan Belohlavek, MD, PhD</div>
            <div class="ack-name">Erika Berman Rosenzweig, MD</div>
            <div class="ack-name">Zach Brennan, DO</div>
            <div class="ack-name">Lars Mikael Broman, MD, PhD, FELSO</div>
            <div class="ack-name">Stephanie Brown, MBBS, MS</div>
            <div class="ack-name">Georgia Brown, MBBS</div>
            <div class="ack-name">Nina Buchtele, MD, PhD</div>
            <div class="ack-name">Hergen Buscher, MD</div>
            <div class="ack-name">Lisa Carson-Price, BSc, RGN</div>
            <div class="ack-name">Kevin Charette, CCP</div>
            <div class="ack-name">Hwa Jin Cho, MD</div>
            <div class="ack-name">Jessica Cornman, DPT</div>
            <div class="ack-name">Goeto Dantes, MD</div>
            <div class="ack-name">Gerdy Debeucklaere, EBCP, MS</div>
            <div class="ack-name">Matteo Di Nardo, MD</div>
            <div class="ack-name">Sharon Einav, MSc, MD</div>
            <div class="ack-name">Christian Fajardo</div>
            <div class="ack-name">David Faraoni, MD, PhD</div>
            <div class="ack-name">Gail Faulkner, RGN, RSCN</div>
            <div class="ack-name">Alex Fox, MHSA</div>
            <div class="ack-name">Whitney Gannon, MSN, ACNP-BC</div>
            <div class="ack-name">Dafna Garcia, MD</div>
            <div class="ack-name">Marco Giani, MD</div>
            <div class="ack-name">Rene Gomez, MD</div>
            <div class="ack-name">Les Gordon, MD</div>
            <div class="ack-name">Venkat Goyal, MD</div>
            <div class="ack-name">Giacomo Grasselli, MD</div>
            <div class="ack-name">Anne-Marie Guerguerian, MD, PhD</div>
            <div class="ack-name">Yigit Guner, MD</div>
            <div class="ack-name">Jumana Haji, MD</div>
            <div class="ack-name">Fraser Hanks, PharmD</div>
            <div class="ack-name">Shintaro Hara, MD</div>
            <div class="ack-name">Matthew Harting, MD</div>
            <div class="ack-name">Ibrahim Hassan, MD</div>
            <div class="ack-name">Carol Hodgson, PhD, Mphil</div>
            <div class="ack-name">Osami Honjo, MD, PhD</div>
            <div class="ack-name">Aparna Hoskote, MBBS, MRCP</div>
            <div class="ack-name">Xiaotong Hou, MD, PhD</div>
            <div class="ack-name">Kasia Hryniewicz, MD</div>
            <div class="ack-name">Lauren Igneri, PharmD</div>
            <div class="ack-name">Josh Ihle, MD, MBA</div>
            <div class="ack-name">Jeffrey Jacobs, MD</div>
            <div class="ack-name">Sarah Juhasz, BSN, CCRN</div>
            <div class="ack-name">Jae-Seung Jung, MD, PhD</div>
            <div class="ack-name">Christian Karagiannidis, MD</div>
            <div class="ack-name">Alberto Javier Kattan Said, MD</div>
            <div class="ack-name">Steven Keller, MD, PhD</div>
            <div class="ack-name">Kirstin Kooda, PharmD</div>
            <div class="ack-name">Yuki Kotani, MD</div>
            <div class="ack-name">Mike Kotwas, CCP, LP</div>
            <div class="ack-name">Peter Lai, RN</div>
            <div class="ack-name">Jennifer Le, PharmD</div>
            <div class="ack-name">Jennifer Lee, MD</div>
            <div class="ack-name">Jerrold Levy, MD</div>
            <div class="ack-name">Lisa Lima, MD</div>
            <div class="ack-name">Christina Maratta, MD</div>
            <div class="ack-name">Phil Mason, MD</div>
            <div class="ack-name">Tim Maul, PhD, CCP</div>
            <div class="ack-name">Marc Maybauer, MD, PhD</div>
            <div class="ack-name">Michael McMullan, MD, FELSO</div>
            <div class="ack-name">Anne Meier, ACNP</div>
            <div class="ack-name">Colleen Mitchell, RN</div>
            <div class="ack-name">Diana Morales Castro, MD</div>
            <div class="ack-name">Melissa Moulton</div>
            <div class="ack-name">Katie Moynihan, MBBS</div>
            <div class="ack-name">Dana Mullin, MS, CCP</div>
            <div class="ack-name">Bernhard Nagler, MD</div>
            <div class="ack-name">Wallace Ngai, MD</div>
            <div class="ack-name">Chris Nickson, MBChB, BSc</div>
            <div class="ack-name">George Ntoumenopoulos, PhD, BSc</div>
            <div class="ack-name">Shinichiro Ohshimo, MD, PhD</div>
            <div class="ack-name">Pranay Oza, MD</div>
            <div class="ack-name">Matthew Paden, MD, FELSO</div>
            <div class="ack-name">Renee Potera, MD, MBA</div>
            <div class="ack-name">Karla Resendiz, PharmD</div>
            <div class="ack-name">Jordi Riera, MD</div>
            <div class="ack-name">Natalie Rintoul, MD</div>
            <div class="ack-name">Jason Roberts, MBBS</div>
            <div class="ack-name">Peter Rycus, MPH, FELSO</div>
            <div class="ack-name">Leonardo Salazar, MD, MSc</div>
            <div class="ack-name">Pablo Sanchez, MD, PhD</div>
            <div class="ack-name">Steve Schwartz, MD</div>
            <div class="ack-name">Dave Selewski, MD, MS</div>
            <div class="ack-name">Kiran Shekar, MBBS, PhD</div>
            <div class="ack-name">Jayne Sheldrake, MSc, BSc</div>
            <div class="ack-name">Simon Sin, MBBS, MRCP</div>
            <div class="ack-name">Rebecca Stark, MD</div>
            <div class="ack-name">Joanne Starr, MD</div>
            <div class="ack-name">Christine Stead, MHSA</div>
            <div class="ack-name">Gideon Stitt, PharmD</div>
            <div class="ack-name">Yuriy Stukov, MD</div>
            <div class="ack-name">Alex Supady, MD</div>
            <div class="ack-name">Denise Suttner, MD</div>
            <div class="ack-name">Monika Tukacs, MS, RN</div>
            <div class="ack-name">Marlice Van Dyk, MBChB</div>
            <div class="ack-name">Christophe Vandenbriele, MD</div>
            <div class="ack-name">Caleb Varner, MBA, CCP</div>
            <div class="ack-name">Ricky Wai Kit Chan</div>
            <div class="ack-name">Patrick Wieruszewski, PharmD</div>
            <div class="ack-name">Justin Young, BS</div>
            <div class="ack-name">Mohsin Zaidi, MD, MS</div>
            <div class="ack-name">Bishoy Zakhary, MD</div>
            <div class="ack-name">Vasileios Zochios, MD</div>
            
          </section>
          

          
        </div>

        <div class="scroll-fade absolute lx-0 bx-8 pointer-none"></div>
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

    .ack-section {
      margin: 0 0 1rem 0;

      .ack-name:first-of-type {
        margin: 0 0 0.5rem 0;
      }
      .ack-name + .ack-name {
        margin: 0 0 0.5rem 0;
      }
    }
    
    .ack-title {
      color: $sixth-color;
      font-weight: 500;
      font-size: 20px;
      margin: 0 0 0.5rem 0;
    }
    
    .ack-name {
      // color: $sixth-color;
      font-weight: 300;
      font-size: 18px;
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