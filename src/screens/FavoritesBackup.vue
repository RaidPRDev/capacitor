<script lang="ts">
export default {
  inheritAttrs: false
}   
</script>

<script setup lang="ts">
import { computed, inject, nextTick, onMounted, onUnmounted, reactive, ref, shallowRef } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from 'pinia';
import { BOTTOM_HEADER_NAV_HEIGHT, GLOBAL_PADDING } from "@/_core/Constants";
import { APP_ID } from '@/_core/Constants';
import { IApp } from '@/types';

import AppAlertPanel from '@/components/panels/AppAlertPanel.vue';
import BasePanel from '@/ui/panels/BasePanel.vue';
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import BaseButton from '@/ui/controls/BaseButton.vue';
import BaseList from '@/ui/controls/BaseList.vue';
import BaseToggle from "@/ui/controls/BaseToggle.vue";

import { getBranchQueryByUID } from '@/components/branching/data/DataTools';
import { IBaseScreenSlotProps } from "@/ui/types";
import { BranchViewData } from "@/types";

import PulseRateLoader from '@/components/pulserateloader/PulseRateLoader.vue';
import useFavoritesStore from "@/store/favorites.module";
import useToasterService from '@/ui/notifications/toaster/AppToastService';

import FavoritesHeadIcon from '@/assets/icons/favorites-heading-icon.svg';
import NoFavoritesHeadIcon from '@/assets/icons/favorites-no-heading-icon.svg';
import UpRightArrowIcon from '@/assets/icons/up-right-arrow-icon.svg';

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
  label?: string;
  data?: any;
  toggled?: boolean;
}

const getInitialItems = () => Object.entries(favoritesData.value).map((item) => {
  return ({ 
    id: item[1].data.id, 
    label: item[1].data.title, 
    type: "item",
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

const IOS_PADDING = import.meta.env.IOS ? 20 : 0;

const panelStyles = computed(() => {
  let adjustedWidth = 0;
  let adjustedHeight = 0;
  adjustedHeight += BOTTOM_HEADER_NAV_HEIGHT(IOS_PADDING);
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

function onFavoritesAction() {
  if (timeoutInput.value) clearTimeout(timeoutInput.value);

  // hold a ref, while we update
  const isEdit = state.isEdit = !state.isEdit;

  if (!isEdit) {
    // reset toggle items
    selectedItemsRef.value.map((selItem) => {
      selItem.toggled = false;
    })
    state.isDeleteActive = false;
    selectedItemsRef.value = [];
    return;
  }

  // delay while list items are transitioning in
  timeoutInput.value = setTimeout(() => {
    state.isDeleteActive = true;
  }, 750);
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
    // router.push({ name: `Checklists`, query: branchQuery });
    // console.log("branchQuery", branchQuery)
    router.push({ path: `checklists/${branchQuery.id}`, query: branchQuery });
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
          <Transition name="fade" :duration="450" mode="out-in">
            <BaseButton v-if="state.isEdit"
              :class="[
                'delete-button variant-red small relative', 
                { 
                  ['edit-mode']: state.isEdit,
                  ['disabled-mode']: selectedItemsRef?.length === 0,
                }
              ]" 
              innerClassName="pxlr-13 pxtb-9 justify-between"
              bodyClassName="width-100"
              labelClassName="width-100 text-center"
              :label="`Delete`"
              @triggered="showAlert"
            />
            <div v-else :class="[ 'edit-label relative' ]">Edit</div>
          </Transition>
          <BaseButton 
          :class="[
            `favorites-head-button edit-button`,
            {
              ['edit-mode']: state.isEdit,
              ['disabled']: handleList?.length === 0
            }
          ]" 
          :icon="FavoritesHeadIcon"
          @triggered="onFavoritesAction"
        />
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
            :accessoryIcon="UpRightArrowIcon"
            @longPressed="onFavoritesAction"
            @triggered="() => goToSection(data)"
          >
            <template v-slot:optionalSlot>
              <span :class="[
                `optional-item absolute tx-0 rx-0 height-100`, 
                { 
                  ['active-state']: state.isDeleteActive 
                }]">
                <BaseToggle 
                  v-model:modelValue="handleList[data.item.index].toggled"
                  :class="`height-100`"
                  :triggerCallback="(toggled) => {
                    if (!data?.item) return;

                    if (toggled) {
                      selectedItemsRef.push(handleList[data.item.index]);
                    }
                    else {
                      selectedItemsRef = selectedItemsRef?.filter((item) => {
                        const dataItem = data.item as BranchViewData
                        return (item.id !== dataItem.id);
                      })
                    }
                  }"
                />
              </span>
              
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

<style lang="scss">
//////////
/// Favorites Heading Button
.favorites-head-button {
  width: 50px;
  height: 50px;
  background-color: white;
  box-shadow: 0px 3.69px 3.69px 0px #00000040;
  border-radius: 50%;
  border: 1px solid $transparent-color;
  transition: #{$base-button-transition}, 
    border-color 350ms ease-out;

  &:hover:not(.edit-button) {
    border: 2px solid $seven-color;
  }

  &.edit-button {
    //border: 2px solid $seven-color;
    &:hover {
      border: 2px solid $teniary-color;
    }
  }
  
  &.added {
    color: $seven-color;

    &:hover {
      border: 2px solid $teniary-color;
    }
  }
  
  &.edit-mode {
    color: $seven-color;
    border: 2px solid $teniary-color;

    &:hover, &.pressed, &.selected {
      border: 2px solid $teniary-color;
    }
  }

  &.disabled {
    @include grayscale();
    pointer-events: none;

    svg { opacity: 0.75 }
  }
}
</style>
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