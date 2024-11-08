<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchList"
}   
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import BaseButton from '@/ui/controls/BaseButton.vue';
import { IBranchTypeProps } from '@/ui/navigation/branching/types';
import UpRightArrowIcon from '@/assets/icons/up-right-arrow-icon.svg';
import classnames from 'classnames'

const props = withDefaults(defineProps<IBranchTypeProps>(), {
  showTitle: false
});

const emit = defineEmits<{
  (e: 'navigate', branchTo: string | null): void;
  (e: 'triggered', dataProps?: any): void;
}>();

function navigate(branchTo: string | null) {
  emit('navigate', branchTo);
}

const mounted = ref<boolean>(false);

onMounted(() => {
  setTimeout(() => mounted.value = true, 75);
})

const computedList = computed(() => {
  if (mounted.value) return props.view?.items
  return null;
})
</script>

<template>
  <h2 v-if="props?.showTitle && props?.view?.title?.length! > 0" class="title transform-z mxb-16">{{ `${props?.view?.title}` }}</h2>
  <div v-if="props?.view?.content" v-html="props?.view?.content" class="text-content mb-1 transform-z"></div>
  
  <transition-group name="list-scale-fade-in" tag="div" class="flex flex-column gapx-16">
    <div v-for="(item, index) in computedList" :key="`item-${index}` " class="blue-menu-item" :style="{ transitionDelay: 0.15 * index + 's' }">
      <BaseButton 
        :class="classnames(`variant-blue width-100`, item.class)" 
        :disabled="item.class?.indexOf(`disabled`) > 0"
        innerClassName="px-20 justify-between align-start"
        bodyClassName="text-left mxr-20"
        accessoryIconClassName="base-control"
        :label="item.label"
        @triggered="() => {
          if (item.class?.indexOf(`disabled`) >= 0) return;
          navigate(item.branchTo);
        }"
      >
        <template v-slot:accessorySlot v-if="UpRightArrowIcon">
          <component v-if="typeof(UpRightArrowIcon) === 'object'" :is="UpRightArrowIcon"></component>
        </template>
      </BaseButton>
    </div>
  </transition-group>
</template>

<style scoped lang="scss">
.title {
  font-size: 18px;
  font-weight: 500;
}
.text-content {
  font-size: 16px;
}

.item {
  :deep(.base-button) {
    box-shadow: 2px 10px 40px -13px #0B247ACC;

    &.disabled {
      opacity: 1;
      .inner-base-button {
        background: $fourth-color;
      }
    }

    // .inner-base-button {}
    .ui-label {
      @include getFontSize('medium');
      font-weight: 300;
    }
    .ui-accessory-icon {
      width: 19px;
    }
  }
}
</style>