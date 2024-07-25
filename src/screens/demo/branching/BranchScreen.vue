<script lang="ts">
export default {
  inheritAttrs: false
}   
</script>

<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue';

import ScreenView from "@/screens/base/ScreenView.vue";
import Branching from '@/ui/navigation/branching/Branching.vue';
import DefaultBranch from './branches/DefaultBranch.vue';
import BranchList from './branches/BranchList.vue';

import { IBaseScreenSlotProps } from '@/ui/types';
import { BranchViewData } from '@/ui/navigation/branching/types';
import { loadJSONFile } from '@/utils/FileTools';

const props = withDefaults(defineProps<IBaseScreenSlotProps>(), {}) 
const loading = ref<boolean>(true);
const views = shallowRef<BranchViewData[]>([]);

onMounted(() => {
  loadData('views.json');
})

async function loadData(url: string) {
  const data = await loadJSONFile(`/assets/data/${url}`) as BranchViewData[];

  views.value = data.map((dataItem) => {
    const viewData = dataItem;
    switch (viewData.layout) {
      case "list":
        viewData.component = BranchList;
      break;
      
      default:
        viewData.component = DefaultBranch;
      break;
    }
    return viewData;
  });

  setTimeout(() => { loading.value = false; }, 750);
}

</script>

<template>
  <ScreenView v-bind="props">
    <transition name="fade" mode="out-in">
      <div v-if="loading" class="flex justify-center align-center height-100">Loading</div>
      <Branching v-else :views="views" viewClassName="pxlr-20 pxb-20" :useNavigation="true"></Branching>
    </transition>
  </ScreenView>
</template>

<style scoped lang="scss"></style>