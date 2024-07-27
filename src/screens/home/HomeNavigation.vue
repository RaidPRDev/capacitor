<script lang="ts">
export default {
  inheritAttrs: false
}   
</script>

<script setup lang="ts">
// import { useRouter } from 'vue-router';
// import { IBaseScreenSlotProps } from '@/ui/types';
import BaseButton from '@/ui/controls/BaseButton.vue';

import MedicalIcon from '@/assets/icons/homeMenu/medical-icon.svg';
import MedicalBedIcon from '@/assets/icons/homeMenu/medical-bed-icon.svg';
import StatsIcon from '@/assets/icons/homeMenu/stats-icon.svg';
import TimePillIcon from '@/assets/icons/homeMenu/time-pill-icon.svg';
import WrenchIcon from '@/assets/icons/homeMenu/wrench-icon.svg';
import FavoritesIcon from '@/assets/icons/homeMenu/favorites-icon.svg';
import { useAttrs } from 'vue';

// Component Props Setup
// const props = withDefaults(defineProps<IBaseScreenSlotProps>(), {}) 
const attrs = useAttrs();
// const router = useRouter();

const menuItems = [
  { label: "ECMO<br>Candidacy", icon: MedicalBedIcon, class: "" },
  { label: "Calculators", icon: MedicalIcon, class: "" },
  { label: "Equipment", icon: WrenchIcon, class: "" },
  { label: "Medication", icon: TimePillIcon, class: "" },
  { label: "Checklists", icon: StatsIcon, class: "" },
  { label: "Favorites", icon: FavoritesIcon, class: "" },
];

function onMenuTriggered(index:number) {
  // console.log("onMenuTriggered", menuItems[index]);

  switch (index) {
    case 0:
      // router.push({ name:"Branching" });
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
  <div class="grid grid-50 gapx-20 width-100 pxl-20 pxr-20 width-100"  v-bind="{ ...attrs }">
    <template v-for="(item, index) in menuItems" :key="`home-menu-nav-${index}`">
      <BaseButton 
        class="menu-button variant-blue" 
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
  box-shadow: 2px 10px 40px -13px #0B247ACC;
  height: 150px;

  :deep(.inner-base-button) {
    .ui-label {
      @include getFontSize('medium');
    }
  }
}
</style>