<script lang="ts">
export default {
  inheritAttrs: true,
  name: "Breadcrumbs"
}   
const DEBUG = false;
</script>

<script setup lang="ts">
import { IBaseBreadcrumbProps, IBreadcrumbItem } from '@/ui/navigation/branching/types';
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';

import { IApp } from '@/ui/types';
import { APP_ID } from '@/App.vue';

import DividerIcon from '@/assets/icons/breadcrumb-div-icon.svg';

// Component Props Setup
const props = withDefaults(defineProps<IBaseBreadcrumbProps>(), {
  useTruncate: true,
  padding: 40 // 20 each side
});

// Component State Setup
interface IState {
  hidden?: boolean;
  truncate?: boolean;
}

const state:IState = reactive({
  truncate: false,
  hidden: true
})


// Emission Event Setup
const emit = defineEmits<{
  (e: 'triggered', data: IBreadcrumbItem): void
}>()

// Reference App
const app = inject<IApp>(APP_ID) as IApp;

// Reference Setup
const element = ref<InstanceType<typeof HTMLElement>>()
const elementContent = ref<InstanceType<typeof HTMLElement>>()

/**
 * This triggers post render - { flush: "post" }
 */
watch(props, (() => {
  if (DEBUG) console.log("Breadcrumbs.watch.items", props?.items)
  update();
}), { flush: "post" })

const historyList = computed(() => {
  const len = props?.items?.length! - 1;
  /** @ts-ignore */
  return props?.items?.filter((item, index) => index < len);
})

const activeItem = computed(() => {
  if (props?.items?.length === 1) return "";
  const item = props?.items?.[props?.items?.length -1]?.title || props?.items?.[props?.items?.length -1]?.heading
  /** @ts-ignore */
  return item;
})

/**
 * 
 * @param index 
 */
function onBreadcrumbItem(index: number) {

  const data = props?.items?.[index];
  if (!data) return;

  emit("triggered", data);
}

/**
 * Truncate breadcrumb item labels
 * 
 * truncate items to fit screen
 */
function truncateLables() {
  const rectContent = elementContent?.value?.getBoundingClientRect();
  const screenPadding = props?.padding;  

  let rectWidth = rectContent?.width!;

  // calc total screen width including padding and breadcrumb content
  const totalWidth = rectWidth + screenPadding;

  // truncate items to fit screen
  state.truncate = totalWidth > app.device.width;
}

/**
 * update
 */
function update() {
  // if we only have one item, hide
  const len = props?.items?.length as number;
  state.hidden = len <= 1;

  // do we need to truncate?
  if (props?.useTruncate) {
    truncateLables();
  }
}

onMounted(() => {
  update();
})

</script>

<template>
  <div 
    ref="element"
    :class="[
      'breadcrumbs pxt-4',
      'overflow-hidden',
      {
        ['hidden']: state.hidden
      }
    ]"
    :style="{ width: `calc(${app.device.width}px - ${app.device.margin * 2}px)` }"
  >
    <div class="bread-content flex align-center height-auto" ref="elementContent">
      <template v-for="(item, index) in historyList">
        <div :class="['bread-item', 'nowrap']" role="link" @click="() => onBreadcrumbItem(index)">
          {{ (item.title || item.heading) }}
        </div>
        <div class="divider mxlr-6" v-if="historyList?.length !== index" ><DividerIcon/></div>
      </template>
    </div>
    <div class="bread-item active">{{ activeItem }}</div>
  </div>
</template>

<style scoped lang="scss">
.breadcrumbs {
  height: 56px;
  transition: height 450ms ease-out, 
              opacity 250ms ease-out,
              padding 250ms ease-out,
              margin-bottom 250ms ease-out;

  &.hidden {
    height: 0;
    opacity: 1;
    padding: 0;
    margin-bottom: 0!important;
  }
}
.bread-item {
  font-size: 14px;
  font-weight: 400;
  transition: color 350ms ease-out;
  cursor: pointer;

  @include ellipses();

  &:hover:not(.active) {
    color: $sixth-color;
  }

  &.active {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.01rem;
    cursor: not-allowed;
  }
}
</style>