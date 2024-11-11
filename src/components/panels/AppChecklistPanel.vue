<script lang="ts">
export default {
  inheritAttrs: false,
  name: "AppChecklistPanel"
}   
</script>

<script setup lang="ts">
import { computed, inject, nextTick, shallowRef } from 'vue';
import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseList from '@/ui/controls/BaseList.vue';
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import BaseToggle from '@/ui/controls/BaseToggle.vue';

import { APP_ID } from '@/_core/Constants';
import { IApp, IBaseListItemData } from '@/ui/types';
import AppAlertPanel from '@/components/panels/AppAlertPanel.vue';
import FavoriteAddedToast from "@/components/toasts/FavoriteAddedToast.vue";
import { BranchItem, BranchViewData } from '@/ui/navigation/branching/types';
import { iterateArray } from '@/utils/ObjectTools';

import useChecklistStore from "@/store/checklist.module";
import useFavoritesStore from "@/store/favorites.module";
import useToasterService from '@/ui/notifications/toaster/AppToastService';
import { storeToRefs } from 'pinia';

import CloseIcon from '@/assets/icons/close-icon.svg';
import FavoritesDefaultIcon from '@/assets/icons/favorites-default-icon.svg';
import CheckboxDefaultIcon from '@/assets/icons/checkbox-default-icon.svg';
import CheckboxActiveIcon from '@/assets/icons/checkbox-active-icon.svg';
import { useRouter } from 'vue-router';


const toasterService = useToasterService();
const { addToast } = toasterService;

const router = useRouter();

const checklistStore = useChecklistStore();
// const { setChecklistItem } = checklistStore;
const favoritesStore = useFavoritesStore();
const { getItem, setItem, removeItem } = favoritesStore;
const { data: checklistData } = storeToRefs(checklistStore);
// const { data: favoritesData } = storeToRefs(favoritesStore);

type CheckListItemType = IBaseListItemData & Partial<BranchItem> & { checked?: boolean };
  
interface IAppChecklistBottomPanelProps {
  id?: string;
  title?: string;
  parentID?: string;
  items?: Array<BranchViewData>;
  data?: BranchViewData;
  parentData?: BranchViewData;
}

// Component Props Setup
const props = withDefaults(defineProps<IAppChecklistBottomPanelProps>(), {});
  
// Component State Setup
// interface IState {}
// const state:IState = reactive({})

const app = inject<IApp>(APP_ID) as IApp;

const dataList = computed(() => {
  if (!props?.items) return [];

  return updateAllCheckLists();
})

function updateAllCheckLists() {

  let list = [] as BranchViewData[];

  /** @ts-ignore */
  iterateArray(props.items, null, (item:any, index:number, parent:any) => {
    if (checklistData.value?.hasOwnProperty(item.id!)) {
      if (item.hasOwnProperty('checked')) {
        item.checked = checklistData.value?.[item.id!];
      }
      else if (item?.layout === "checklist" && item.hasOwnProperty('items')) {
        item.checked = checklistData.value?.[item.id!];
      }
    }
    if (parent?.type === "subchecklist") {
      item.type = "sublistitem"
    }
    list.push(item);
  });

  return list;
}

function updateCheckData(data: CheckListItemType, toggled?: boolean) {

  const itemID = data.id as string;
  checklistData.value[itemID] = !toggled!;
  checklistStore.$patch({
    data: checklistData.value
  });
}

function resetCheckData() {
  
  // reset checklist items

  /** @ts-ignore */
  iterateArray(props.items, null, (item:any, index:number, parent:any) => {
    if (checklistData.value?.hasOwnProperty(item.id!)) {
      if (item.hasOwnProperty('checked')) {
        item.checked = false;
        if (!checklistData) return;
        checklistData.value[item.id!] = false;
      }
    }
  });

  // update store
  checklistStore.$patch({
    data: checklistData.value
  });
}

</script>

<template>
<BasePanel class="relative">
  <div class="side-content pxlr-0 pxt-90 pxb-20 relative">
    
    <BaseHeader class="header-panel mxlr-20 pxb-8 mxb-8 height-auto align-center">
      <template v-slot:headerLeft>
        <div v-if="props?.title" class="title">{{ props?.title }}</div>
      </template>
      <template v-slot:headerRight>
        <BaseButton 
          :class="[
            `favorites-head-button`,
            {
              ['added']: getItem(props?.id!) ?? false
            }
          ]" 
          :icon="FavoritesDefaultIcon"
          @triggered="() => {

            if (getItem(props?.id!)) {
              removeItem(props?.id!);
              nextTick(() => addToast({ label: `Removed from favorites.` }));
              return;
            }

            setItem({
              type: 'checklists',
              data: {
                id: props?.data?.id!,
                title: props?.title!,
              },
              parentData: {
                id: props?.parentData?.id!,
                title: props?.parentData?.title!,
              },
            });
            nextTick(() => addToast({ 
              component: shallowRef(FavoriteAddedToast),
              componentProps: {
                label: `Added to favorites.` 
              }
            }));
          }"
        />
      </template>
    </BaseHeader>
    
    <BaseList 
      :dataProvider="dataList" 
      :class="[
        `list-container`, 
        `gapx-0 pxlr-20`].join(` `)"
    >
      <template v-slot:listItemSlot="data">
        <BaseButton 
          :class="[`list-button-item width-100`, {
            ['sub-item']: data.item.type === 'sublistitem',
            ['comment']: data.item.type === 'comment',
          }]" 
          :hasInternalLinks="true"
          :innerClassName="`pxtb-18 justify-start align-start gapx-10`"
          :bodyClassName="`text-left`"
          :label="data.item.label"
          :icon="BaseToggle"
          :iconProps="{ 
            modelValue: (data.item as BranchViewData).checked,
            label: ``, 
            class: `pointer-all`, 
            defaultIcon: CheckboxDefaultIcon,
            activeIcon: CheckboxActiveIcon,
            triggerCallback:(toggled:boolean) => {
              updateCheckData(data.item, !toggled);
            }
          }"
          :triggerCallback="() => {
            const toggled = (data.item as BranchViewData).checked;
            updateCheckData(data.item, toggled);
          }"
          @internalLink="(element) => {
            if (!element?.hasAttribute('data-link')) return;
            
            const data = element.dataset.link;
            const pData = data?.split?.('##') as any[];

            let queryParams: { 
              type: string,
              id: string,
              childId?: string,
            } = { type: '', id: '', childId: '' };

            queryParams.type = pData[0];
            queryParams.id = pData[1];

            // check for child id
            if (pData?.length === 3) {
              queryParams.childId = pData[2];
            }

            app.alert.component = shallowRef(AppAlertPanel);
            app.alert.options.props = {
              title: '',
              content: `Are you sure you want to leave this checklist?`,
              labels: ['No', 'Yes'],
              action: (index:number) => {
                if (index === 0) return;

                // need to close self panel before pushing
                app.drawers.bottom.open = !app.drawers.bottom.open;
                switch (queryParams?.type) {
                  case 'CHECKLIST':
                    router.push({ name: `Checklists`, query: queryParams });
                    break;
                  default:
                }
              }
            }
            app.alert.options.open = !app.alert.options.open;
          }"
        >
        </BaseButton>
      </template>
    </BaseList>
    <BaseHeader class="footer-panel pxlr-20 height-auto" centerClassName="width-100">
      <template v-slot:headerCenter>
          <BaseButton 
            class="reset-button variant-red small" 
            :innerClassName="`pxlr-13 pxtb-9`" 
            :label="`Reset`" 
            @triggered="() => {
              app.alert.component = shallowRef(AppAlertPanel);
              app.alert.options.props = {
                title: '',
                content: 'Are you sure you want to reset this checklist?',
                labels: ['No', 'Yes'],
                action: (index:number) => {
                  if (index === 0) return;
                  resetCheckData();
                }
              }

              // close window
              app.alert.options.open = !app.alert.options.open;
            }"
          />
      </template>
    </BaseHeader>
  </div>
  <BaseButton class="close-button absolute tx-20 rx-20" :innerClassName="`flex-column`" :icon="CloseIcon" @triggered="() => {
    app.drawers.bottom.open = !app.drawers.bottom.open;
    app.drawers.bottom.props = {};
  }" />
  
</BasePanel>
</template>

<style scoped lang="scss">
.list-container {
  $reset-btn-height: 80;
  overflow: hidden scroll;
  height: calc(100% - (71px + #{$reset-btn-height}px));
  @include use-scroller-styles();
}

.header {
  border-bottom: 1px solid $fourth-color;
}

.title {
  font-size: 24px;
  font-weight: 500;
  color: $sixth-color;
}

.base-panel {
  :deep(.inner-panel) {
    // background-color: rgba(white, .95);
    background-color: white;
  }

  // Does not work in chrome
  // html:not(.desktop) & {
  //   :deep(.inner-panel) {
  //     background-color: rgba(white, .85);
  //     backdrop-filter: blur(10px);
  //   }
  // }
}
.side-content {
  height: calc(100% - 0px);
}
.base-list {
  transition: opacity 300ms ease;

  :deep(.list-item) {
    .list-button-item {
      border-bottom: 1px solid $fourth-color;

      &.sub-item {
        padding-left: 2rem;
      }

      &.comment {
        pointer-events: none;

        a {
          pointer-events: all;
        }

        .ui-icon {
          display: none;
        }
      }

      .ui-label {
        font-weight: 400;
      }
    }
    .toggle-switch {
      border: 0px solid;
    }
  }

  &.fade-out {
    opacity: 0;
  }
}

.footer-panel {
  height: 70px;
}
</style>