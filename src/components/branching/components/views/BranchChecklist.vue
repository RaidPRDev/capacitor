<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchChecklist"
}   
</script>

<script setup lang="ts">
import { computed, inject, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';

import { APP_DRAWERS_ID, APP_ID } from '@/_core/Constants';
import { 
  IApp, 
  IAppDrawerComponents, 
  BranchItem, 
  BranchViewData, 
  IBranchTypeProps 
} from '@/types';
import { IBaseListItemData } from '@/ui/types';

import useAppStore from '@/store/app.module';
import useChecklistStore from '@/store/checklist.module';

import BaseButton from '@/ui/controls/BaseButton.vue';
import BaseList from '@/ui/controls/BaseList.vue';
import ChecklistBadge from '@/components/branching/components/ChecklistBadge.vue';
import AppChecklistPanel from "@/components/panels/AppChecklistPanel.vue";
import { ChecklistCountType, checklistItemCountCompleteCheck } from '@/utils/ObjectTools';

type CheckListItemType = IBaseListItemData & Partial<BranchItem> & { toggle?: boolean };
type CheckListDataType = IBaseListItemData & Partial<BranchViewData>;

const props = withDefaults(defineProps<IBranchTypeProps>(), {
  showTitle: false
});

const appStore = useAppStore();
const route = useRoute();
const itemID = route?.query?.id;
const childID = parseInt(route?.query?.childId! as string);

const app = inject<IApp>(APP_ID) as IApp;
const drawerComponents = inject<IAppDrawerComponents>(APP_DRAWERS_ID) as IAppDrawerComponents;

const checklistStore = useChecklistStore();
const { data: checklistData } = storeToRefs(checklistStore);

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

  // if we have am incoming query with a child route, replace route...
  if (itemID && !isNaN(childID)) {
    const branchData = props?.view?.items?.[childID]!;
    branchData.parentId = props.view?.id as string;
    
    // update current id
    appStore.setCurrentID(branchData?.id!);

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
  if (mounted.value) {
    
    const thisData = props.view?.items?.map((item) => {
      let counterCompletion:ChecklistCountType = {
        completed: 0,
        total: 0
      }
      counterCompletion.total = 0;
      counterCompletion.completed = 0;

      // control if items are empty
      if (!item.items) {
        item.data = {
          totalChecks: 0,
          totalCompleted: 0,
        }      

        return item;
      }

      counterCompletion= checklistItemCountCompleteCheck(item.items, counterCompletion, checklistData);
      
      item.data = {
        totalChecks: counterCompletion.total,
        totalCompleted: counterCompletion.completed,
      }      

      return item;
    })
    
    return thisData;
  }
  return null;
})

</script>

<template>
  <h2 v-if="props?.showTitle && props?.view?.title?.length! > 0" class="title head-content transform-z">{{ `${props?.view?.title}` }}</h2>
  <div v-if="props?.view?.content" v-html="props?.view?.content" class="text-content mb-1 transform-z"></div>
  
  <BaseList class="gapx-16" listItemClass="blue-menu-item" :dataProvider="computedList">
    <template v-slot:listItemSlot="data">
      
      <BaseButton 
        :data-completed="computedList?.[data.item.index].data.totalCompleted"
        :data-total="computedList?.[data.item.index].data.totalChecks"
        :class="[`variant-blue ignore-icon width-100`, {
          ['is-comment']: data.item.type === 'comment'
        }]" 
        :disabled="data.item.class ? data.item.class?.indexOf(`disabled`) >= 0 : false"
        :bodyClassName="`text-left`"
        :label="data.item.label"
        :accessoryIcon="ChecklistBadge"
        :accessoryIconProps="{ 
          completed: computedList?.[data.item.index].data.totalCompleted,
          total: computedList?.[data.item.index].data.totalChecks,
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
            name: `checklist-panel`,
            id: branchData?.id, 
            title: branchData?.label, 
            parentID: branchData?.parentId, 
            items: branchData?.items,
            data: branchData,
            parentData: props?.view,
          };
          app.drawers.bottom.open = !app.drawers.bottom.open;
        }"
      />
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

.base-list {
  :deep(.list-item) {
    .base-button {
      will-change: transform;
      
      &.is-comment {
        opacity: 1;
      }
      
      box-shadow: 2px 10px 40px -13px #0B247ACC;
      .ui-label {
        @include getFontSize('medium');
      }

      .ui-accessory-icon {
        width: auto;
      }
    }
  }
}
</style>