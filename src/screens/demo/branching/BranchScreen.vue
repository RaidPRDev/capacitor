<script lang="ts">
export default {
  inheritAttrs: false,
  name: "BranchScreen"
}   
</script>

<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue';

import BasePanel from '@/ui/panels/BasePanel.vue';
import Branching from '@/ui/navigation/branching/Branching.vue';
import PulseRateLoader from '@/components/PulseRateLoader.vue';

import { IBaseScreenSlotProps } from '@/ui/types';
import { BranchViewData } from '@/ui/navigation/branching/types';
import { loadViewData } from '@/components/branching/tools/DataTools';

const props = withDefaults(defineProps<IBaseScreenSlotProps>(), {}) 
const loading = ref<boolean>(true);
const views = shallowRef<BranchViewData[]>([]);

onMounted(async () => {
  await loadViewData('template/branching.json', views);

  setTimeout(() => { loading.value = false; }, 750);
})

</script>

<template>
  <BasePanel v-bind="props" class="overflow-hidden">
    <transition name="fade" mode="out-in">
      <div v-if="loading" class="loading flex justify-center align-center height-100">
        <PulseRateLoader />
      </div>
      <Branching v-else :views="views" viewClassName="pxlr-20 pxb-20" :useNavigation="true"></Branching>
    </transition>
  </BasePanel>
</template>

<style scoped lang="scss">
.loading {
  .loader {
    width: 140px;
  }
  
  svg {
    overflow: visible;
    width: 100%;
    transform: scaleX(1.25);
  }
  svg path#line {
    fill: none;
    stroke: $primary-color;
    stroke-width: 2;
    stroke-linecap: butt;
    stroke-linejoin: round;
    stroke-miterlimit: 4;
    stroke-dasharray:none;
    stroke-opacity: 1;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: dash 2.5s ease-out infinite;
    animation-delay: 0.25s;
  }

  @keyframes dash {
    0% {
      stroke-dashoffset: 1;
    }
    80% {
      stroke-dashoffset: 0;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }

  @keyframes blink {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    60% {
      opacity: 0;
      transform: scale(0);
    }
    70% {
      opacity: 1;
      transform: scale(1.2);
    }
    75% {
      opacity: 1;
      transform: scale(1.0);
    }
    80% {
      opacity: 1;
      transform: scale(1.2);
    }
    85% {
      opacity: 1;
      transform: scale(1.0);
    }
    100% {
      opacity: 0;
      transform: scale(1.0);
    }
  }
}
</style>