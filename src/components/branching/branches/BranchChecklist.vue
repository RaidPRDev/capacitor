<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchChecklist"
}   
</script>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import BaseButton from '@/ui/controls/BaseButton.vue';
import BaseToggle from '@/ui/controls/BaseToggle.vue';
import BaseList from '@/ui/controls/BaseList.vue';
import { BranchItem, BranchViewData, IBranchTypeProps } from '@/ui/navigation/branching/types';
import { IApp, IAppDrawerComponents, IBaseListItemData } from '@/ui/types';
import AppChecklistPanel from "@/components/panels/AppChecklistPanel.vue";

import { APP_DRAWERS_ID, APP_ID } from '@/App.vue';
import { useRoute } from 'vue-router';

type CheckListItemType = IBaseListItemData & Partial<BranchItem> & { toggle?: boolean };
type CheckListDataType = IBaseListItemData & Partial<BranchViewData>;

const props = withDefaults(defineProps<IBranchTypeProps>(), {
  showTitle: false
});

const route = useRoute();
const itemID = route?.query?.id;
const childID = parseInt(route?.query?.childId! as string);
// console.log("itemID", itemID);
// console.log("childID", childID);

const app = inject<IApp>(APP_ID) as IApp;
const drawerComponents = inject<IAppDrawerComponents>(APP_DRAWERS_ID) as IAppDrawerComponents;

const emit = defineEmits<{
  (e: 'navigate', branchTo: string | null): void;
  (e: 'action', data: BranchViewData): void;
  (e: 'triggered', dataProps?: any): void;
}>();

function navigate(branchTo: string | null) {
  emit('navigate', branchTo);
}

const mounted = ref(false)

onMounted(() => {
  setTimeout(() => mounted.value = true, 75);

  // when running of query
  if (itemID && !isNaN(childID)) {
    const branchData = props?.view?.items?.[childID]!;
    branchData.parentId = props.view?.id as string;
    
    drawerComponents.bottom = AppChecklistPanel;
    app.drawers.bottom.props = { 
      id: branchData?.id, 
      title: branchData?.label, 
      parentID: branchData?.parentId, 
      items: branchData?.items,
      data: branchData,
      parentData: props?.view,
    };
    app.drawers.bottom.open = !app.drawers.bottom.open;
  }
})

const computedList = computed(() => {
  if (mounted.value) return props.view?.items as IBaseListItemData[]
  return null;
})
</script>

<template>
  <h2 v-if="props?.showTitle && props?.view?.title?.length! > 0" class="title transform-z">{{ `${props?.view?.title}` }}</h2>
  <div v-if="props?.view?.content" v-html="props?.view?.content" class="text-content mb-1 transform-z"></div>
  
  <BaseList class="gapx-16" listItemClass="blue-menu-item" :dataProvider="computedList">
    <template v-slot:listItemSlot="data">
      <BaseButton 
        :class="[`variant-blue ignore-icon width-100`, {
          ['is-comment']: data.item.type === 'comment'
        }]" 
        :disabled="data.item.class ? data.item.class?.indexOf(`disabled`) > 0 : false"
        :innerClassName="`px-20 justify-between`"
        :bodyClassName="`text-left`"
        :label="data.item.label"
        :accessoryIcon="BaseToggle"
        :accessoryIconProps="{ 
          modelValue: null,
          label: ``, 
          class: `pointer-none hide`, 
        }"
        :triggerCallback="() => {
          const bView = data.item as CheckListItemType;
          if (!bView?.branchTo) return;

          navigate(bView?.branchTo!);
        }"
        @triggered="() => {
          if (data?.item?.class?.indexOf('disabled')! >= 0) return;

          const listData = data.item as CheckListDataType;

          const branchData = props?.view?.items?.[data.item.index]!;
          branchData.parentId = props.view?.id as string;
          branchData.id =  listData.id!;
          
          drawerComponents.bottom = AppChecklistPanel;
          app.drawers.bottom.props = { 
            id: branchData?.id, 
            title: branchData?.label, 
            parentID: branchData?.parentId, 
            items: branchData?.items,
            data: branchData,
            parentData: props?.view,
          };
          app.drawers.bottom.open = !app.drawers.bottom.open;
        }"
      >
      </BaseButton>
    </template>
  </BaseList>
</template>

<style scoped lang="scss">
.hidden {
  display: none;
}
.title {
  font-size: 18px;
  font-weight: 500;
}
.text-content {
  font-size: 16px;
}

.base-list {
  :deep(.list-item) {
    .base-button {
      &.is-comment {
        opacity: 1;
      }
      
      box-shadow: 2px 10px 40px -13px #0B247ACC;
      .ui-label {
        @include getFontSize('medium');
      }
    }
  }
}
</style>