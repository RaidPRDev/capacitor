<script lang="ts">
export default {
  inheritAttrs: false,
  name: "AppChecklistPanel"
}   
</script>

<script setup lang="ts">
import { computed, inject, nextTick, ref, shallowRef } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseList from '@/ui/controls/BaseList.vue';
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import BaseToggle from '@/ui/controls/BaseToggle.vue';

import { APP_ID } from '@/_core/Constants';
import { IBaseListItemData } from '@/ui/types';
import { IApp } from '@/types';
import { BranchItem, BranchViewData } from '@/types';
import { flattenChecklist } from '@/utils/ObjectTools';

import AppAlertPanel from '@/components/panels/AppAlertPanel.vue';
import FavoriteAddedToast from "@/components/toasts/FavoriteAddedToast.vue";

import useChecklistStore from "@/store/checklist.module";
import useFavoritesStore from "@/store/favorites.module";
import useToasterService from '@/ui/notifications/toaster/AppToastService';

import CloseIcon from '@/assets/icons/close-icon.svg';
import CheckboxDefaultIcon from '@/assets/icons/checkbox-default-icon.svg';
import CheckboxActiveIcon from '@/assets/icons/checkbox-active-icon.svg';
import FavoritesSmallIcon from '@/assets/icons/favorites-small-icon.svg';
import RestartIcon from '@/assets/icons/restart-icon.svg';

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

  list = flattenChecklist(props.items, 1, checklistData) as BranchViewData[];

  // list.forEach((item) => {
  //   console.log("item.label", item.label)
  //   console.log("item", item)
  // })

  return list;
}

function updateCheckData(data: CheckListItemType, toggled?: boolean) {

  // console.log("data", data)

  const itemID = data.id as string;
  checklistData.value[itemID] = !toggled!;

  // console.log("checklistData", checklistData)


  checklistStore.$patch({
    data: checklistData.value
  });
}

function resetCheckData() {
  
  // reset checklist items

  let list = [] as BranchViewData[];

  list = flattenChecklist(props.items, 1, checklistData) as BranchViewData[];

  list.forEach((item) => {
    console.log("item.label", item.label)
    console.log("item", item)

    if (checklistData.value?.hasOwnProperty(item.id!)) {
      if (item.hasOwnProperty('checked')) {
        item.checked = false;
        if (!checklistData) return;
        checklistData.value[item.id!] = false;
      }
    }
  })

  // update store
  checklistStore.$patch({
    data: checklistData.value
  });
}

const isAdded = getItem(props?.id!);

const isFavoritesEnabled = ref<boolean>(isAdded ? false : true);
const isFavoritesShowing = ref<boolean>(true);

function addToFavorites() {
  
  isFavoritesEnabled.value = false;

  if (getItem(props?.id!)) {
    removeItem(props?.id!);
    nextTick(() => addToast({ label: `Removed from favorites.` }));
    isFavoritesEnabled.value = true;
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
}

function onInternalLink(element: HTMLElement) {
  if (!element?.hasAttribute('data-link')) return;
            
  const data = element.dataset.link;
  const pData = data?.split?.('##') as any[];
  console.log("pData", pData);

  let queryParams: { 
    type: string,
    id: string,
    childId?: string,
  } = { type: '', id: '', childId: '' };

  queryParams.type = pData[0];
  queryParams.id = pData[1];

  // check CHECKLIST TYPE for child id
  if (pData?.length === 3) {
    queryParams.childId = pData[2];
  }
  // check URL LINK TYPE
  else if (pData?.length === 1 && pData[0].indexOf("http") > -1) {
    window.open(pData[0], "_blank");
    return;
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
}

</script>

<template>
<BasePanel class="relative">
  <div class="side-content pxlr-0 pxt-90 pxb-20 relative">
    
    <BaseHeader class="header-panel mxlr-20 pxb-8 mxb-8 pxr-20 height-auto align-center">
      <template v-slot:headerLeft>
        <div v-if="props?.title" class="title">{{ props?.title }}</div>
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
          :class="[`list-button-item width-100`, data.item.class, {
            ['comment']: data.item.type === 'comment',
            ['no-checkbox']: !dataList?.[data.item.index].hasOwnProperty(`checked`),
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
            console.log('sadsd', element)
            onInternalLink(element);
          }"
        >
        </BaseButton>
      </template>
    </BaseList>

    <BaseHeader class="footer-panel pxlr-20 height-auto" centerClassName="width-100">
      <template v-slot:headerLeft>
        <BaseButton 
            class="reset-button variant-red small" 
            :innerClassName="`pxlr-13 pxtb-9 justify-between gapx-6`" 
            :label="`Reset`" 
            :icon="RestartIcon"
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
      <template v-slot:headerRight>
          
          <transition 
            name="fade" 
            mode="out-in"
            :appear="isFavoritesShowing"
          >
            <BaseButton 
              v-if="isFavoritesEnabled"
              class="add-favorites-btn variant-red small" 
              innerClassName="pxlr-13 pxtb-9 justify-between gapx-6"
              bodyClassName="text-left"
              :label="`Add To Favorites`"
              :icon="FavoritesSmallIcon"
              @triggered="addToFavorites"
            />
            <BaseButton 
              v-else
              class="remove-favorite-btn variant-blue small" 
              innerClassName="pxlr-13 pxtb-9 justify-between gapx-6"
              bodyClassName="text-left"
              :label="`Remove`"
              :icon="FavoritesSmallIcon"
              @triggered="addToFavorites"
            />
          </transition>
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

.remove-favorite-btn {
  :deep(.inner-base-button) {
    .ui-label {
      font-size: 14px;
      line-height: 15px;
      text-transform: uppercase;
      font-weight: 600;
    }
  }
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
      
      &.sub-level-2 {
        padding-left: 2rem;
      }
      
      &.sub-level-3 {
        padding-left: 3rem;
      }

      &.no-checkbox, &.comment {
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