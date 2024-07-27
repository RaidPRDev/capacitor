<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchInput"
}   
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import BaseButton from '@/ui/controls/BaseButton.vue';
import BaseList from '@/ui/controls/BaseList.vue';
import { BranchItem, BranchViewData } from '@/ui/navigation/branching/types';
import { IBaseInputProps, IBaseListItemData } from '@/ui/types';
import BaseInput from '@/ui/controls/BaseInput.vue';

type InputListItemType = IBaseListItemData & Partial<BranchItem> & { 
  inputProps?: IBaseInputProps; 
};

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
  if (mounted.value) return props.view?.items as InputListItemType[]
  return null;
})
</script>

<template>
  <h1 v-if="props?.view?.title" class="transform-z">{{ `${props?.view?.title}` }}</h1>
  <div v-if="props?.view?.content" v-html="props?.view?.content" class="mb-1 transform-z"></div>
  
  <BaseList :dataProvider="computedList">
    <template v-slot:listItemSlot="data">
      <BaseButton 
        :class="`variant-blue width-100`" 
        :innerClassName="`px-20 justify-between`"
        :bodyClassName="`text-left`"
        :label="data.item.label"
        :accessoryIcon="BaseInput"
        :accessoryIconClassName="`width-100`"
        :accessoryIconProps="{ 
          placeholder: `Enter value`,
          ...(data?.item as InputListItemType).inputProps,
          containerClass: `variant-calc pointer-all width-inherit ${(data?.item as InputListItemType)?.inputProps?.containerClass}`, 
          elementClass: `base-control px-12 ${(data?.item as InputListItemType)?.inputProps?.elementClass}`,
          triggerCallback:(toggled:boolean) => {
            console.log(`BaseToggleCallback`, toggled);
            // (data.item as InputListItemType).toggle = !toggled;
          }
        }"
        :triggerCallback="() => {
          const bView = data.item as InputListItemType;
          
          if (!bView?.branchTo) return;

          navigate(bView?.branchTo!);
        }"
      >
      </BaseButton>
    </template>
  </BaseList>
</template>

<style scoped lang="scss">


</style>