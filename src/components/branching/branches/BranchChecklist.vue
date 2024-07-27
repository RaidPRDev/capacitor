<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchChecklist"
}   
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import BaseButton from '@/ui/controls/BaseButton.vue';
import BaseToggle from '@/ui/controls/BaseToggle.vue';
import BaseList from '@/ui/controls/BaseList.vue';
import { BranchItem, BranchViewData } from '@/ui/navigation/branching/types';
import { IBaseListItemData } from '@/ui/types';

type CheckListItemType = IBaseListItemData & Partial<BranchItem> & { toggle?: boolean };

const props = defineProps<{
  view: BranchViewData | null;
}>();

const emit = defineEmits<{
  (e: 'navigate', branchTo: string | null): void;
}>();

function navigate(branchTo: string | null) {
  emit('navigate', branchTo);
}

const mounted = ref(false)

onMounted(() => {
  setTimeout(() => mounted.value = true, 75)
})

const computedList = computed(() => {
  if (mounted.value) return props.view?.items as IBaseListItemData[]
  return null;
})
</script>

<template>
  <h1 class="transform-z">{{ `${props?.view?.title}` }}</h1>
  <div v-if="props?.view?.content" v-html="props?.view?.content" class="mb-1 transform-z"></div>
  
  <BaseList :dataProvider="computedList">
    <template v-slot:listItemSlot="data">
      <BaseButton 
        :class="`variant-blue ignore-icon width-100`" 
        :innerClassName="`px-20 justify-between`"
        :bodyClassName="`text-left`"
        :label="data.item.label"
        :accessoryIcon="BaseToggle"
        :accessoryIconProps="{ 
          modelValue: null,
          label: ``, 
          class: `pointer-all`, 
          triggerCallback:(toggled:boolean) => {
            console.log(`BaseToggleCallback`, toggled);
            (data.item as CheckListItemType).toggle = !toggled;
          }
        }"
        :triggerCallback="() => {
          const bView = data.item as CheckListItemType;
          if (!bView?.branchTo) return;

          navigate(bView?.branchTo!);
        }"
      >
      </BaseButton>
    </template>
  </BaseList>
</template>

<style scoped lang="scss"></style>