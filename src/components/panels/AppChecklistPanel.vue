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
  if (element.classList.contains("disabled")) return;
            
  const data = element.dataset.link;
  const pData = data?.split?.('##') as any[];
  // console.log("element", element);
  // console.log("pData", pData);

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
    showClose: false,
    action: (index:number) => {
      if (index === 0) return;
      console.log("queryParams", queryParams)
      // need to close self panel before pushing
      app.drawers.bottom.open = !app.drawers.bottom.open;
      switch (queryParams?.type) {
        case 'PANIC':
          router.push({ name: `Panic`, query: queryParams });
          break;
        case 'CHECKLIST':
          router.push({ name: `Checklists`, query: queryParams });
          break;
        case 'MEDICATIONS':
          router.push({ name: `Medication`, query: queryParams });
          break;
        case 'CALCULATORS':
          router.push({ name: `Calculators`, query: queryParams });
          break;
        case 'EQUIPMENT':
          router.push({ name: `Equipment`, query: queryParams });
          break;
        default:
      }
    }
  }
  app.alert.options.open = !app.alert.options.open;
}

function processItemLabel(item:any) {

  let label = item.label;

  if (item.type === "ul-list-comment") {
    if (item.items && Array.isArray(item.items) && item.items.length > 0) {
      label = "<div class='ul-list-comment'>";
      if (item.hasOwnProperty("title") && item.title) {
        label = `<div>${item.title}</div>`;  
      }
      label = `${label}<ul>`;
      item.items.map((__label: string) => {
        label = `${label}<li>${__label}</li>`;
      })
      label = `${label}</ul>`;
      label = `${label}</div>`;
    }
  }
  
  return label;
}

</script>

<template>
<BasePanel class="relative">
  <div class="side-content pxlr-0 pt-6 pxb-20 relative">
    
    <BaseHeader class="header-panel mxlr-20 pxb-8 mxb-8 pxr-20 height-auto align-center">
      <template v-slot:headerLeft>
        <div v-if="props?.title" class="title" v-html="props?.title"></div>
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
            ['list-heading']: data.item.type === 'list-heading',
            ['list-comment']: data.item.type === 'list-comment',
            ['ul-list-comment']: data.item.type === 'ul-list-comment',
            ['no-checkbox']: !dataList?.[data.item.index].hasOwnProperty(`checked`),
          }]" 
          :hasInternalLinks="true"
          :innerClassName="`pxtb-18 justify-start align-start gapx-10`"
          :bodyClassName="`text-left`"
          :label="processItemLabel(data.item)"
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
  // width: calc(100% - 0px);
  height: calc(100% - (71px + #{$reset-btn-height}px));
  font-size: 16px;
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
      transition: transform 425ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
      will-change: transform;

      &.note {
        .inner-base-button {
          background-color: aliceblue;
          padding: 0.95em;
          // margin: 0.75rem 0 1.1rem;
          margin: 1rem 0 1rem;
          border-radius: 0.428em;

          .ui-body > .ui-label {
            font-size: 16px;
          }
        }
      }

      &.list-section {
        .ui-body {
          .ui-label {
            font-weight: 600;
          }
        }
      }

      &.sub-item {
        padding-left: 2rem;
      }
      
      &.sub-level-2 {
        padding-left: 2rem;
      }
      
      &.sub-level-3 {
        padding-left: 3rem;
      }
      
      &.sub-level-4 {
        padding-left: 4rem;
      }

      &.no-checkbox, &.comment, &.list-comment {
        pointer-events: none;

        a {
          pointer-events: all;
        }

        .ui-icon {
          display: none;
        }
      }

      &.list-heading {
        border-bottom: 1px solid transparent;
      }

      &.ul-list-comment {
        &.sub-level-1 {
          .inner-base-button {
            padding-top: 0  ;
          }
          .ul-list-comment {
            opacity: 1;
            > ul {
              margin-left: 2rem;
            }
          }
        }
        .inner-base-button {
          padding-bottom: 0;
        }
      }

      &.list-comment {
        padding-left: 1.75rem;
        margin-bottom: 0.7rem;
        border-bottom: 1px solid transparent;

        .inner-base-button {
          padding: 0 2rem 0 0;
          .ui-body > .ui-label > ul {
            margin: 0.1rem 0 0.9rem;
          }
        }

        &.bullet {
          padding-left: 3rem;

          &:after {
            content: "•";
            font-size: 1.35rem;
            position: absolute;
            left: 2rem;
            line-height: 1;
            top: 0;
          }

          &.hollow {
            &:after {
              content: "◦";
            }
          }
        }
        

        &.sub-level-4 {
          .inner-base-button {
            .ui-body > .ui-label > ul {
              margin: 0.1rem 0 0.5rem;
              padding: 0 0px 0 3.3rem;
              list-style-type: circle;
            }
          }
        }

        &.end-list-0 {
          border-bottom: 1px solid #BEBEBE;
          padding-bottom: 1.35rem;
          margin-left: 0;
          margin-bottom: 0;
          .inner-base-button {
            padding-left: 3rem;
          }

          &.bullet {
            padding-left: 0;
          }
        }

        &.end-list-1 {
          border-bottom: 1px solid #BEBEBE;
          padding-bottom: 1.35rem;
          margin-left: 0;
          margin-bottom: 0;
          .inner-base-button {
            padding-left: 3rem;
          }

          &.bullet {
            padding-left: 0;
            &:after {
              left: 3rem;
            }
            .inner-base-button {
              padding-left: 4rem;
            }
          }           
        }
        
        &.end-list-2 {
          border-bottom: 1px solid #BEBEBE;
          padding-bottom: 1.35rem;
          margin-left: 0;
          margin-bottom: 0;
          .inner-base-button {
            padding-left: 3rem;
          }

          &.bullet {
            padding-left: 0;
            &:after {
              left: 4rem;
            }
            .inner-base-button {
              padding-left: 5rem;
            }
          }           
        }
      }

      .ui-label {
        font-weight: 400;
      }

      &.custom-list {
        .inner-base-button {
          padding: 0;
        }
      }

      ul {
        padding-left: 20px;
        
        li {
          margin-bottom: 16px;

          ul {
            margin-top: 16px;
          }
        }
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