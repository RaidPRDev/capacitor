<script lang="ts">
export default {
  inheritAttrs: false,
  name: "BaseList"
}
</script>
<script setup lang="ts">
import { computed } from 'vue';
import BaseButton from '@/ui/controls/BaseButton.vue';
import { IBaseListProps } from '../types';

const props = withDefaults(defineProps<IBaseListProps>(), {
  transitionEnabled: true,
  transitionProps: {
    name: "list-scale-fade-in", 
    tag: "div", 
    class: "flex flex-column gapx-16",
    transitionDelay: 0.15
  }
});

const computedList = computed(() => {
  if (Array.isArray(props?.dataProvider) && props?.dataProvider?.length === 0) return [];

  const listItems = props?.dataProvider?.map((item) => {
    return item;
  })

  return listItems;
})

</script>


<template>
<transition-group 
  role="list"  
  :class="['base-list', props?.transitionProps?.class]"  
  :name="props?.transitionProps?.name"
  :tag="props?.transitionProps?.tag"
  :transitionDelay="props?.transitionProps?.transitionDelay"
  :css="props?.transitionEnabled"  
>
  <div 
    v-for="(item, index) in computedList" :key="`item-${index}`"  
    :class="[`list-item`, props?.listItemClass]"  
    :style="{ transitionDelay: props?.transitionProps?.transitionDelay * index + 's' }"
  >
    <slot name="listItemSlot" :item="{ ...item, index }">
      <BaseButton 
        role="listitem"
        :data-list-item="index"
        :v-bind="buttonProps"  
        :class="`variant-blue width-100`" 
        :innerClassName="`px-20 justify-between`"
        :bodyClassName="`text-left`"
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

<style scoped lang="scss"></style>