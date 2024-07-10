<script lang="ts">
export default {
  inheritAttrs: true,
  name: "Home"
}   
</script>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { IButtonGroupSelected } from "@/ui/types";
import FullScreen from "@/ui/panels/FullScreen.vue";
import ButtonGroup from "@/ui/controls/ButtonGroup.vue";
import ActionButton from '@/components/ActionButton.vue';
import useSession from "@/store/session.module";

import Logo from '/assets/elso_logo.png';
import MicIcon from '@/assets/icons/mic-icon.svg';

const router = useRouter();
const session = useSession();

const menuGroupItems = [
  { label: "Create Patient Profile", route: "Patient" },
  { label: "Start", route: "Home" },
];

function onMenuTriggered(selected: IButtonGroupSelected) {
  
  switch (selected.index) {
    case 0:
    break;

    case 1:
      session.$patch({ currentIndex: 0 })
    break;
  }

  router.push({ name:selected.data.route });
}

</script>

<template>
<FullScreen 
  className="splash" 
  innerClassName="inner-splash"
  :bodySlotProps="{ class: 'splash-body flex align-center justify-center px-20' }" 
>
  <template v-slot:bodySlot>
    <div class="width-inherit height-100 flex flex-column justify-between ptb-3">
      <div class="flex justify-center"><img :src="Logo" width="120" height="89" /></div>
      <div class="flex justify-center">
        <div>
          <div class="splash-icon"><MicIcon /></div>
          <div class="splash-title">Bedside<br>Assistant v0.0.1</div>
        </div>
      </div>
      <div>
        <ButtonGroup 
          class="mt-2"
          innerClassName="flex flex-column gapx-30"
          :buttonComponent="ActionButton"
          :defaultButtonProps="{ 
            elementClassName: `width-100`, 
            innerClassName: `pxlr-30 pxtb-18` 
          }"
          :dataProvider="menuGroupItems" @triggered="onMenuTriggered"
        ></ButtonGroup>
      </div>

    </div>
  </template>
  
</FullScreen>
</template>

<style scoped lang="scss">
.splash {
  :deep(.inner-splash) {
    background: linear-gradient(-104deg, $secondary-blue 10%, $primary-color 100%);

    .button-group {
      .action-button {
        
        .inner-base-button {
          background: #DB0330;
        }
        
        .ui-background {
          background: $red-gradient;
        }

        .ui-label {
          font-size: 21px;
          font-weight: 700;
          line-height: 21.6px;
        }
      }
    }
  }

  .splash-icon {
    color: white;
  }

  .splash-title {
    color: white;
    font-size: 64px;
    font-weight: 300;
    line-height: 77px;
  }
}
</style>