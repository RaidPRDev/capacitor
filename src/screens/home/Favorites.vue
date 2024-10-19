<script lang="ts">
export default {
  inheritAttrs: false
}   
const DEBUG = false;
</script>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, reactive, ref, shallowRef } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from 'pinia';

import { 
  BOTTOM_HEADER_NAV_HEIGHT, 
  GLOBAL_PADDING, 
  JSON_DATA_TYPE_CHECKLISTS,
  JSON_DATA_TYPE_MEDICATIONS,
  JSON_DATA_TYPE_CALCULATORS,
  JSON_DATA_TYPE_EQUIPMENT,
  // JSON_DATA_TYPE_PANIC,
  JSON_DATA_TYPE_CHECKLIST_ITEM,
} from "@/Constants";

import { APP_ID } from '@/App.vue';
import { IApp } from '@/ui/types';

import AppAlertPanel from '@/components/panels/AppAlertPanel.vue';
import BasePanel from '@/ui/panels/BasePanel.vue';
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import BaseButton from '@/ui/controls/BaseButton.vue';
import BaseList from '@/ui/controls/BaseList.vue';

import { getBranchQueryByUID } from '@/components/branching/tools/DataTools';
import { IBaseScreenSlotProps } from "@/ui/types";

import PulseRateLoader from '@/components/PulseRateLoader.vue';
import useFavoritesStore from "@/store/favorites.module";
import useToasterService from '@/ui/notifications/toaster/AppToastService';

import NoFavoritesHeadIcon from '@/assets/icons/favorites-no-heading-icon.svg';
import FavoritesHeadStarIcon from '@/assets/icons/favorites-star-line-icon.svg';
import UpRightArrowIcon from '@/assets/icons/up-right-arrow-icon.svg';
import TrashIcon from '@/assets/icons/trash-icon.svg';
import { IFavoriteDataItem } from "@/store/types/StoreTypes";

const router = useRouter();

const favoritesStore = useFavoritesStore();
const { getItem, removeItem } = favoritesStore;
const { data: favoritesData } = storeToRefs(favoritesStore);

const toasterService = useToasterService();
const { addToast } = toasterService;

// Component Props Setup
const props = withDefaults(defineProps<IBaseScreenSlotProps>(), {}) 

interface IFavoriteListItem {
  type?: string;
  id?: string;
  index?: number;
  label?: string;
  data?: any;
  toggled?: boolean;
}

const getInitialItems = () => Object.entries(favoritesData.value).map((item) => {
  
  return ({ 
    id: item[1].data.id, 
    label: item[1].data.title, 
    type: item[1].type,
    toggled: false,
  });
})
const handleList = ref<IFavoriteListItem[]>(getInitialItems())

// Component State Setup
interface IState {
  showList?: boolean;
  isEdit?: boolean;
  isDeleteActive?: boolean;
  icon?: any;
  iconProps?: any;
}

const state:IState = reactive({
  showList: true,
  isEdit: false,
  isDeleteActive: false,
  icon: null,
  iconProps: {}
})

const app = inject<IApp>(APP_ID) as IApp;
const timeoutInput = shallowRef<ReturnType<typeof setTimeout>>();
const timeoutRemove = shallowRef<ReturnType<typeof setTimeout>>();
const loading = ref<boolean>(true);
const selectedItemsRef = ref<Array<IFavoriteListItem>>([]);

onMounted(async () => {
  setTimeout(() => { 
    if (handleList.value.length === 0) state.showList = false;
    loading.value = false; 
  }, 750);
})

const panelStyles = computed(() => {
  let adjustedWidth = 0;
  let adjustedHeight = 0;
  adjustedHeight += BOTTOM_HEADER_NAV_HEIGHT;
  adjustedWidth = app.device.width;  

  return {
    width: `calc(${adjustedWidth}px - 0px)`,
    height: `calc(100% - ${adjustedHeight}px)`
  };
})

const listItemStyles = computed(() => {
  let adjustedWidth = 0;

  adjustedWidth = app.device.width;
  adjustedWidth -= (GLOBAL_PADDING + GLOBAL_PADDING);

  return {
    width: `calc(${adjustedWidth}px - 0px)`,
  };
})

function onFavoritesAction(data:{ item: IFavoriteListItem }) {
  if (timeoutInput.value) clearTimeout(timeoutInput.value);

  const selIdx = data.item.index as number;

  selectedItemsRef.value = [handleList.value[selIdx]];
  showAlert();
}

function removeSelectedItem(item: IFavoriteListItem) {
  const i = handleList.value.indexOf(item)
  if (i > -1) {
    handleList.value.splice(i, 1);
  }
}

function onDeleteItems() {
  if (timeoutInput.value) clearTimeout(timeoutInput.value);
  if (timeoutRemove.value) clearTimeout(timeoutRemove.value);

  selectedItemsRef.value.forEach((selItem) => {
    removeSelectedItem(selItem);
    
    if (getItem(selItem?.id!)) {
      nextTick(() => { 
        removeItem(selItem?.id!); 
        
        if (handleList.value.length === 0) {
          state.isEdit = false;
          state.showList = false;
        }
        else {
          state.isEdit = false;
        }
      })
    }
  });

  nextTick(() => addToast({ label: "Removed from favorites." }));

  nextTick(() => {
    selectedItemsRef.value = [];
  });
}

function showAlert() {
  
  const totalSelected = selectedItemsRef.value.length;
  
  let message = "Are you sure you want to delete ";
  if (totalSelected > 1) {
    message += "these items?";
  }
  else message += "this item?";

  app.alert.component = shallowRef(AppAlertPanel);
  app.alert.options.props = {
    title: '',
    content: `${message}`,
    labels: ['No', 'Yes'],
    action: (index:number) => {
      if (index === 0) return;

      onDeleteItems();
    }
  }
  app.alert.options.open = !app.alert.options.open;
}

function goToSection(data:{ item: IFavoriteListItem }) {
  if (state.isEdit) return;

  nextTick(() => {
    const listData = data.item as IFavoriteListItem;
    const branchQuery = getBranchQueryByUID(listData?.id!, listData?.type!);

    if (DEBUG) console.log("Favorites.goToSection.listData", listData)
    if (DEBUG) console.log("Favorites.goToSection.query", branchQuery)
    
    let dataType = branchQuery?.type, dataId = branchQuery?.id;

    if (DEBUG) console.log("Favorites.goToSection.listData?.type", listData?.type)
    if (listData?.type === JSON_DATA_TYPE_CHECKLISTS) {
      dataId = listData?.id as string;
      dataType = JSON_DATA_TYPE_CHECKLIST_ITEM;

      if (DEBUG) console.log("Favorites.goToSection.dataId", dataId)
      if (DEBUG) console.log("Favorites.goToSection.dataType", dataType)
    }

    const favItem = getItem(dataId) as IFavoriteDataItem ;
    if (DEBUG) console.log("Favorites.goToSection.favItem", favItem)

    switch (dataType) {
      case JSON_DATA_TYPE_CHECKLIST_ITEM:
      if (DEBUG) console.log("Favorites.goToSection.HEY")
        dataType = JSON_DATA_TYPE_CHECKLISTS;
        router.push({ path: `${dataType}/${branchQuery.id}`, query: branchQuery });
      break;
      case JSON_DATA_TYPE_MEDICATIONS:
      case JSON_DATA_TYPE_CALCULATORS:
      // case JSON_DATA_TYPE_PANIC:
      case JSON_DATA_TYPE_EQUIPMENT:
        
        let routeName = "";
        if (favItem.data.id !== favItem.parentData.id) {
          routeName = `${dataType}/${favItem.parentData.id}/${favItem.data.id}`;
        }
        else routeName = `${dataType}/${favItem.data.id}`;
        router.push({ path: `${routeName}` });
      break;
    }
  })
}

onUnmounted(() => {
  if (timeoutInput.value) clearTimeout(timeoutInput.value);
  if (timeoutRemove.value) clearTimeout(timeoutRemove.value);
})
</script>

<template>
<BasePanel v-bind="props" class="pxl-0 pxr-0" >
  <transition name="fade" appear mode="out-in">
    <div v-if="loading" class="loading flex justify-center align-center height-100">
      <PulseRateLoader />
    </div>
    <div v-else class="height-inherit">
      <BaseHeader :rightProps="{ gap: 10 }" class="screen-heading pxlr-20 pxb-10 mxb-0 height-auto sticky tx-0 z-index-1">
        <template v-slot:headerLeft>
          <h1 class="title">{{`Favorites`}}</h1>
        </template>
        <template v-slot:headerRight>
          <FavoritesHeadStarIcon/>
        </template>
      </BaseHeader>
      
      <BaseList 
        v-if="state.showList"
        class="list-container relative pxlr-20 pxt-10 pxb-60 overflow-v-scroll width-100" 
        :style="panelStyles"
        listItemClass="blue-menu-item"
        :listItemStyles="listItemStyles"
        :dataProvider="handleList">
        <template v-slot:listItemSlot="data">
          <BaseButton 
            :asSubControl="true"
            :useLongPressedState="true"
            :class="[`list-button variant-blue ignore-icon width-100`, {
              ['edit-mode pointer-none transform-none sub-control-active']: state.isEdit,
            }]" 
            :innerClassName="`px-20 justify-between gapx-10 relative`"
            :bodyClassName="`text-left`"
            :label="data.item.label"
            
            @longPressed="() => onFavoritesAction(data)"
            @triggered="() => goToSection(data)"
          >
            <template v-slot:accessorySlot>
              <BaseButton 
                :asSubControl="true"
                :class="`remove-button`" 
                :icon="TrashIcon" 
                :innerClassName="`px-0 mxr-10 justify-between gapx-10 relative`"  
                :triggerCallback="() => {
                  selectedItemsRef = [handleList[data.item.index]]
                  showAlert();
                }"
              />
              <div class="flex"><UpRightArrowIcon /></div>
            </template>
          </BaseButton>
        </template>
      </BaseList>
      <div v-if="!state.showList" class="no-list-panel flex align-center justify-center width-100">
        <div class="flex align-center justify-center flex-column">
          <div class="no-list-icon"><NoFavoritesHeadIcon/></div>
          <div class="no-list-label mxt-20">No favorite items added.</div>
        </div>
      </div>
    </div> 
  </transition>
</BasePanel>
</template>

<style scoped lang="scss">
.title {
  font-family: $secondary-font-family;
}

.screen-heading {
  background-color: rgb(245, 245, 245);
}

.edit-label {
  font-size: 14px;
  font-weight: 600;
}

.remove-button {
  :deep(.inner-base-button) {
    background: none!important;

    .ui-background {
      background: none!important;
    }
  }
}

// BASE LIST
.list-container {
  @include use-scroller-styles();
  display: block;
  flex-direction: unset;

  :deep(.list-item) {
    + .list-item {
      margin-top: 1rem;
    }
    
    .list-button {
      > .inner-base-button {
        width: 100%;
        transition: clip-path 350ms ease-in-out;
        clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);

        .ui-body {
          width: calc(100% - 66px);
        }

        .ui-accessory-icon {
          width: auto!important;
          align-items: center;
        }
      }
      
      &.edit-mode {
        .optional-item {
          z-index: -1;

          &.active-state {
            z-index: 0;
          }
        }

        > .inner-base-button {
          clip-path: polygon(0 0, 80% 0, 80% 100%, 0% 100%);
        }
      }
    }
  }
}

// OPTIONAL ITEM / BASE SWITCH
.optional-item {
  top: 50%;
  transform: translateY(-50%);
  z-index: -1;
  width: 67px;
  box-shadow: none;

  .toggle-switch {
    pointer-events: all;  
    background-color: rgba(0, 0, 0, 0.021);
    border-radius: 0px 10px 10px 0;

    :deep(.toggle) {
      margin-left: 0;
    }
  }
}

// DELETE HEAD BUTTON
.delete-button {
  display: none;

  &.edit-mode {
    display: block;
  }

  &.disabled-mode {
    pointer-events: none;
    :deep(.inner-base-button) {
      background: $fourth-color;
    }
  }
}

// NO ITEMS 
// .no-list-panel {}
.no-list-icon {
  width: 180px;
  opacity: 0.04;
  @include grayscale();
  svg { width: 100%; }
}
.no-list-label {
  font-family: $secondary-font-family;
  font-weight: 700;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.2);
}
</style>