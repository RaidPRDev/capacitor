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

<style scoped lang="scss"></style>