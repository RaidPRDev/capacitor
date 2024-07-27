<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchList"
}   
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import BaseButton from '@/ui/controls/BaseButton.vue';
import { BranchViewData } from '@/ui/navigation/branching/types';
import UpRightArrowIcon from '@/assets/icons/up-right-arrow-icon.svg';

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
  if (mounted.value) return props.view?.items
  return null;
})
</script>

<template>
  <h1 class="transform-z">{{ `${props?.view?.title}` }}</h1>
  <div v-if="props?.view?.content" v-html="props?.view?.content" class="mb-1 transform-z"></div>
  
  <transition-group name="list-scale-fade-in" tag="div" class="flex flex-column gapx-16">
    <div v-for="(item, index) in computedList" :key="`item-${index}` " class="item" :style="{ transitionDelay: 0.15 * index + 's' }">
      <BaseButton 
        class="variant-blue width-100" 
        innerClassName="px-20 justify-between"
        bodyClassName="text-left"
        accessoryIconClassName="base-control"
        :label="item.label"
        @triggered="() => navigate(item.branchTo)"
      >
        <template v-slot:accessorySlot v-if="UpRightArrowIcon">
          <component v-if="typeof(UpRightArrowIcon) === 'object'" :is="UpRightArrowIcon"></component>
        </template>
      </BaseButton>
    </div>
  </transition-group>
</template>

<style scoped lang="scss">
.item {
  :deep(.base-button) {
    box-shadow: 2px 10px 40px -13px #0B247ACC;

    // .inner-base-button {}
    .ui-label {
      @include getFontSize('medium');
    }
    .ui-accessory-icon {
      width: 19px;
    }
  }
}
</style>