<script lang="ts">
export default {
  inheritAttrs: false,
  name: "BaseList"
}
</script>
<script setup lang="ts">
import { ref, useAttrs } from 'vue';
import BaseButton from '@/ui/controls/BaseButton.vue';
import { IBaseListProps, IBaseTransitionProps } from '../types';

const props = withDefaults(defineProps<IBaseListProps>(), {
  transitionEnabled: true,
  transitionDelayedStart: 0,
  transitionAppear: true,
  transitionProps: {
    name: "list-default-fade-in",
    tag: "div", 
    transitionDelay: 0.15,
  } as IBaseTransitionProps as any
});

// Attributes and Slots Setup
const attrs = useAttrs();

const elementRef = ref<HTMLElement>();

// Expose Definitions
defineExpose({
  elementRef: () => elementRef.value as HTMLElement
})


// const computedList = computed(() => {
//   if (Array.isArray(props?.dataProvider) && props?.dataProvider?.length === 0) return [];

//   const listItems = props?.dataProvider?.map((item) => {
//     return item;
//   })

//   return listItems;
// })

const hasTransitioned = ref<boolean>(false);

const setTransitionStyles = (index: number, isTransition?: boolean) => {
  
  const { 
    transitionDelayedStart
  } = props;

  const delay = !isTransition ? { transitionDelay: index === 0 
      ? (transitionDelayedStart + props?.transitionProps?.transitionDelay!) + 's'
      : (transitionDelayedStart) + (props?.transitionProps?.transitionDelay! * (index + 1)) + 's'
  } : {};

  return {
    ...delay,
    ...props?.listItemStyles
  };

}
</script>


<template>
<transition-group 
  role="list"  
  ref="elementRef"
  :class="['base-list flex flex-column', props?.class]"  
  :name="!hasTransitioned ? props?.transitionProps?.name : `list-delete`"
  :tag="props?.transitionProps?.tag"
  :css="props?.transitionEnabled"  
  :appear="props?.transitionAppear"
  v-bind="{
    ...attrs
  }"
  @after-enter="(element) => { 
    const elIdx = parseInt((element as HTMLElement).dataset.index!);
    if (props?.dataProvider?.length === elIdx + 1) {
      hasTransitioned = true;
    }
  }"
>
  <div 
    v-for="(item, index) in props?.dataProvider" :key="item.label"  
    :class="[`list-item`, props?.listItemClass]"  
    :data-index="index"
    :data-group-header="item?.groupType === `GroupHeader` ? true : null"
    :style="setTransitionStyles(index, hasTransitioned)"
  >
    <slot name="listItemSlot" :item="{ ...item, index: index }">
      <BaseButton 
        role="listitem"
        :class="`variant-blue width-100`" 
        :innerClassName="`px-20 justify-between`"
        :bodyClassName="`text-left`"
        :v-bind="buttonProps"  
        iconClassName=""
        accessoryIconClassName=""
      >
        <template v-slot:iconSlot:{d} v-if="item?.icon">
          <component 
            v-if="typeof(item?.icon) === 'object'" 
            :is="item?.icon" 
            :v-bind="item?.iconProps">
          </component>
        </template>

        <template v-slot:bodySlot v-if="item.label">
          {{ item?.label }}
        </template>

        <template v-slot:accessorySlot v-if="item?.accessoryIcon">
          <component 
            v-if="typeof(item?.accessoryIcon) === 'object'" 
            :is="item?.accessoryIcon" 
            :v-bind="item?.accessoryIconProps">
          </component>
        </template>
      </BaseButton>
    </slot>
  </div>
</transition-group>
</template>

<style scoped lang="scss">
// .base-list {}
</style>