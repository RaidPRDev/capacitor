<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchList"
}   
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import classnames from 'classnames'
import BaseButton from '@/ui/controls/BaseButton.vue';
import { IBranchTypeProps } from '@/types';
import UpRightArrowIcon from '@/assets/icons/up-right-arrow-icon.svg';
import { sortItemsByClassDisabled } from '@/utils/ObjectTools';
import useAppStore from '@/store/app.module';

const props = withDefaults(defineProps<IBranchTypeProps>(), {
  showTitle: false,
  showDebug: true
});

const emit = defineEmits<{
  (e: 'navigate', branchTo: string | null): void;
  (e: 'triggered', dataProps?: any): void;
}>();

const appStore = useAppStore();
const router = useRouter();

function navigate(branchTo: string | null) {
  // We need to add support for external pages
  // from a CheckList.
  const fromSectionID = appStore.getCurrentID!;
  const toSectionID = branchTo!;

  // console.log("fromSectionID", fromSectionID);
  // console.log("toSectionID", toSectionID);

  // Check if we are on a checklist and allow the panic branch
  if (fromSectionID.indexOf("CHKLST") > -1) {
    if (toSectionID.indexOf("PANIC") > -1) {
      router.push(`/home/panic/${toSectionID}`);
      return;
    }
  }
  
  emit('navigate', branchTo);
}

const mounted = ref<boolean>(false);

onMounted(() => {
  setTimeout(() => mounted.value = true, 75);
})

function onContentTrigger(e:MouseEvent) {
  e.preventDefault();
  
  


  const target = e.target as HTMLElement;
  console.log("onContentTrigger", target.dataset.hasOwnProperty("link"))

  if (target.dataset.hasOwnProperty("link")) {
    console.log("onContentTrigger", e)
    emit("triggered", { ['data-link']: target.dataset.link });
  }
}

const computedList = computed(() => {
  if (mounted.value) {
    let items = props?.view?.items;
    if (props?.view?.sort) {
      switch (props?.view?.sort) {
        case "ByActive": {
          sortItemsByClassDisabled(items);
        }
      }
    }
    return items;
  }
  return null;
})
</script>

<template>
  <h2 v-if="props?.showTitle && props?.view?.title?.length! > 0" v-html="props?.view?.title" class="title transform-z mxb-16"></h2>
  <div @click="onContentTrigger" v-if="props?.view?.content" v-html="props?.view?.content" class="text-content mb-1 transform-z"></div>
  
  <transition-group name="list-scale-fade-in" tag="div" class="flex flex-column gapx-16">
    <div v-for="(item, index) in computedList" :key="`item-${index}` " class="" :style="{ transitionDelay: 0.15 * index + 's' }">
      <BaseButton 
        :class="classnames(`variant-blue width-100`, item.class)" 
        :disabled="item.class?.indexOf(`disabled`) > 0"
        innerClassName=""
        bodyClassName=""
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

        <template v-slot:optionalSlot v-if="showDebug">
          <div class="debug-layer" :data-id="JSON.stringify(item)">
            <div class="debug-label">{{item.branchTo}}</div>
          </div>
        </template>
      </BaseButton>
    </div>
  </transition-group>
</template>

<style scoped lang="scss">
// .title {
//   font-size: 18px;
//   font-weight: 500;
// }
// .text-content {
//   font-size: 16px;
// }

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