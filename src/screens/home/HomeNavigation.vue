<script lang="ts">
export default {
  inheritAttrs: false
}   
</script>

<script setup lang="ts">
import BaseButton from '@/ui/controls/BaseButton.vue';

import MedicalIcon from '@/assets/icons/homeMenu/medical-icon.svg';
import MedicalBedIcon from '@/assets/icons/homeMenu/medical-bed-icon.svg';
import StatsIcon from '@/assets/icons/homeMenu/stats-icon.svg';
import TimePillIcon from '@/assets/icons/homeMenu/time-pill-icon.svg';
import WrenchIcon from '@/assets/icons/homeMenu/wrench-icon.svg';
import StethoscopeIcon from '@/assets/icons/homeMenu/stethoscope-icon.svg';
// import { IBaseScreenSlotProps } from '@/ui/types';

// Component Props Setup
// const props = withDefaults(defineProps<IBaseScreenSlotProps>(), {}) 

const menuItems = [
  { label: "Determine<br>ECMO<br>Eligibility", icon: MedicalIcon },
  { label: "Transport<br>Patient", icon: MedicalBedIcon },
  { label: "Fix<br>Equipment", icon: StatsIcon },
  { label: "Check<br>Patient<br>Condition", icon: TimePillIcon },
  { label: "Adjust<br>Medication", icon: WrenchIcon },
  { label: "Other", icon: StethoscopeIcon },
];

function onMenuTriggered(index:number) {
  console.log("onMenuTriggered", menuItems[index]);

  switch (index) {
    case 0:
    break;
    case 1:
    break;
    case 2:
    break;
    case 3:
    break;
    case 4:
    break;
    case 5:
    break;
  }
}

</script>

<template>
  <div class="grid grid-50 gapx-20 pxl-20 pxr-20 width-100">
    <template v-for="(item, index) in menuItems">
      <BaseButton 
        class="menu-button" 
        :v-bind:key="`home-menu-nav-${index}`"
        :innerClassName="`flex-column`" 
        :icon="item.icon" 
        :label="item.label"
        :iconClassName="`absolute tx-12 rx-12`" 
        :bodyClassName="`absolute bx-12 lx-12 text-left`" 
        @triggered="() => onMenuTriggered(index)"
      />
    </template>
  </div>  
</template>

<style scoped lang="scss">
.menu-button {
  background: $blue-gradient;
  color: $white;
  border-radius: $global-radius;
  box-shadow: 2px 10px 40px -13px #0B247ACC;
  height: 150px;

  :deep(.inner-base-button) {
    position: relative;
    height: 100%;

    .ui-background {
      transition: opacity $btn-transition-ms $btn-transition-ease;
      background: $blue-light-gradient;
      border-radius: $global-radius;
      opacity: 0;
    }
    .ui-body {
      font-size: 20px;
    }
    // .ui-icon {}
  }

  &:hover {
    :deep(.inner-base-button) {
      .ui-background {
        opacity: 1;
      }
    }
  }
}
</style>