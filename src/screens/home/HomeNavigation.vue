<script lang="ts">
export default {
  inheritAttrs: false
}   
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';
import { useRouter } from 'vue-router';
import classNames from 'classnames';

import BaseButton from '@/ui/controls/BaseButton.vue';

import MedicalBedIcon from '@/assets/icons/homeMenu/medical-bed-icon.svg';
import ChecklistIcon from '@/assets/icons/homeMenu/checklist-icon.svg';
import TimePillIcon from '@/assets/icons/homeMenu/time-pill-icon.svg';
import WrenchIcon from '@/assets/icons/homeMenu/wrench-icon.svg';
import FavoritesIcon from '@/assets/icons/favorites-star-line-icon.svg';
import CalculatorIcon from '@/assets/icons/homeMenu/calculator-icon.svg';

// Component Props Setup
const attrs = useAttrs();
const router = useRouter();

const menuItems = [
  { label: "ECMO<br>Candidacy", icon: MedicalBedIcon, class: "disabled" },
  { label: "Calculators", icon: CalculatorIcon, class: "" },
  { label: "Equipment", icon: WrenchIcon, class: "" },
  { label: "Medication", icon: TimePillIcon, class: "" },
  { label: "Checklists", icon: ChecklistIcon, class: "" },
  { label: "Favorites", icon: FavoritesIcon, class: "" },
];

function onMenuTriggered(index:number) {
  switch (index) {
    case 0:   // Ecmo Candadacy
      // router.push({ name:"Branching" });
    break;
    case 1:   // Calculators
      router.push({ name: "Calculators" });
    break;
    case 2:   // Equipment
      router.push({ name: "Equipment" })
    break;
    case 3:   // Medication
      router.push({ name: "Medication" });
    break;
    case 4:   // Checklists
      router.push({ name: "Checklists" });
    break;
    case 5:   // Favorites
      router.push({ name: "Favorites" });
    break;
  }
}

</script>

<template>
  <div class="width-100">
    <div class="title mxl-26 mxb-18">ECMO Bedside Assistant</div>
    <div class="subtitle mxl-26 mxb-14">Select a tile that fits your needs.</div>
    <div class="grid grid-50 gapx-20 width-100 pxl-20 pxr-20 width-100"  v-bind="{ ...attrs }">
    <template v-for="(item, index) in menuItems" :key="`home-menu-nav-${index}`">
      <BaseButton 
        :class="classNames(`menu-button variant-blue`, item.class)" 
        :innerClassName="`flex-column`" 
        :icon="item.icon" 
        :label="item.label"
        :iconClassName="`absolute tx-12 rx-12`" 
        :bodyClassName="`absolute bx-12 lx-12 text-left`" 
        @triggered="() => onMenuTriggered(index)"
      />
    </template>
  </div>
  </div>
</template>

<style scoped lang="scss">
.title {
  font-size: 24px;
  color: $primary-color;
  font-weight: 500;
}
.subtitle {
  font-size: 18px;
  color: $primary-color;
  font-weight: 400;
}
.menu-button {
  box-shadow: 2px 10px 40px -13px #0B247ACC;
  height: 150px;

  &.base-button {
    &.disabled {
      opacity: 1;
      box-shadow: 2px 10px 40px -13px #adadadcc;

      :deep(.inner-base-button) {
        background: $fourth-color;
      }
    }
    :deep(.inner-base-button) {
      .ui-label {
        @include getFontSize('medium');
        font-weight: 300;
      }
    }
  }
}
</style>