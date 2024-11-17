<script lang="ts">
export default {
  inheritAttrs: false,
  name: "AppSearchPanel"
}   
</script>

<script setup lang="ts">
import { ComponentPublicInstance, computed, inject, nextTick, onMounted, reactive, ref, shallowRef } from 'vue';
import { useRouter } from "vue-router";
import { JSONParser } from "@streamparser/json-whatwg";

import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseList from '@/ui/controls/BaseList.vue';
import BaseInput from '@/ui/controls/BaseInput.vue';

import { APP_ID, BOTTOM_HEADER_NAV_HEIGHT, COMPILED_DATA_PATH } from '@/_core/Constants';
import { BranchViewData, IApp, ISearchData } from '@/types';
import { sortItemsByProperty, sortObjectByKeys } from "@/utils/ObjectTools";

// import Logo from '/assets/elso_logo.png';
import CloseIcon from '@/assets/icons/close-icon.svg';
import SearchIcon from '@/assets/icons/search-icon.svg';
import UpRightArrowIcon from '@/assets/icons/up-right-arrow-icon.svg';
import { BaseListGroupType } from '@/ui/types';
import { capitalizeFirstLetter } from '@/utils/StringTools';

// Component State Setup
interface IState {
  isSearching: boolean;
  isTyping: boolean;
  inputValue: string;  
}

const state:IState = reactive({
  isSearching: false,
  isTyping: false,
  inputValue: "",
})

interface ISearchDataItem {
  type: string;
  data: BranchViewData;
  parentData: BranchViewData;
}

interface ISearchItemRender {
  id?: string;
  groupType: BaseListGroupType;
  label?: string; 
  type?: string;
  path?: string;
  data?: any;
}
type ISearchFlatDataItem = ISearchDataItem & { id?:string, groupType?: "GroupHeader" | "GroupItem" }

const app = inject<IApp>(APP_ID) as IApp;
const timeoutInput = shallowRef<ReturnType<typeof setTimeout>>();
const timeoutSearch = shallowRef<ReturnType<typeof setTimeout>>();
const timeoutMount = shallowRef<ReturnType<typeof setTimeout>>();
const searchList = ref<Record<string, ISearchFlatDataItem>>({});
const searchValue = reactive({ text: "" });
const searchInputRef = ref<ComponentPublicInstance<typeof BaseInput>>()

let __searchDataIsLoaded: boolean = false;
let __internalSearchDataV2: Record<string, any> = {};

const router = useRouter();

function onInput(value: number | string) {
  state.isTyping = true;
  state.isSearching = false;

  if (Array.isArray(searchList.value) && searchList.value.length > 0) {
    searchList.value = {};
  }

  if (timeoutSearch.value) clearTimeout(timeoutSearch.value);
  if (timeoutInput.value) clearTimeout(timeoutInput.value);
  
  timeoutInput.value = setTimeout(() => {
    state.isTyping = false;
    searchItems(value as string);
  }, 750);
}

async function searchItems(term:string) {
  // console.info("searchItems", term);

  if (state.isSearching) return ;
  if (timeoutSearch.value) clearTimeout(timeoutSearch.value);

  state.isSearching = true;

  if (term?.length < 3) return;

  if (!__searchDataIsLoaded) await loadSearchData();
 
  // console.info("__searchData", __searchData);
  // console.info("__internalSearchDataV2", __internalSearchDataV2);

  timeoutSearch.value = setTimeout(() => {
    let filteredSearchData:Record<string, ISearchFlatDataItem> = {}
    for (let key in __internalSearchDataV2) {
      if (__internalSearchDataV2[key].data.keywords.indexOf(term?.toLowerCase()) > -1) {
        filteredSearchData[key] = __internalSearchDataV2[key];
      }
    }

    searchList.value = filteredSearchData;
    state.isSearching = false;

  }, 400);
}

const fetchResults = computed(() => {
  const result = groupAndFlattenItemsByType(searchList.value).map((item) => {
    const routePath = item.groupType === "GroupItem" ? item.data?.path : ""
    return ({ 
      id: item.id, 
      label: item.label, 
      type: item.type,
      groupType: item.groupType,
      path: routePath,
    });
  })
  
  return result;
})

const resultLabel = computed(() => {
  if (state.isSearching || state.isTyping) return 'Searching...';
  else {
    const searchResults = fetchResults.value.filter((item) => {
      return (item.groupType === "GroupItem") 
    })

    return `${searchResults.length} result(s) found`;
  }
})

function groupAndFlattenItemsByType(data:Record<string, ISearchFlatDataItem>) {
  const grouped:Record<string, ISearchFlatDataItem[]> = {};
  
  // Group items by their type
  for (const key in data) {
    const item = data[key] as ISearchDataItem;
    if (!grouped[item.type]) {
      grouped[item.type] = [];
    }
    grouped[item.type].push({ ...item, id: key });
  }

  const result:ISearchItemRender[] = [];

  // // Build flattened array with Group Header and Group Item Types
  let countIdx = 0;

  const sortedGroup = sortObjectByKeys(grouped) as Record<string, ISearchFlatDataItem[]>;

  for (const type in sortedGroup) {
    const ts = Date.now();
    // Add Group Header Type
    result.push({ groupType: "GroupHeader", label: capitalizeFirstLetter(type), id: `${type}_${ts}_${countIdx}` });
    countIdx++;
    
    sortItemsByProperty(sortedGroup[type] as ISearchFlatDataItem[], "title", "asc");

    // Add Group Item Types
    sortedGroup[type].forEach(item => {
      result.push({ ...item, groupType: "GroupItem", label: item.data.title });
    });
  }
  
  // console.log("result", result)
  return result;
}

function loadSearchData() {
  
  return new Promise<any>((resolve) => {

    fetch(`/assets/data/${COMPILED_DATA_PATH}/search_compiled.json`).then(
      async response => {
        const jsonParser = new JSONParser();
        const reader = response?.body?.pipeThrough(jsonParser).getReader();
        // console.info("reader");
        // console.info(reader);

        while (true) {
          const { done, value } = await reader?.read() as { done: any, value: any };
          const obj = value?.value;
          if (done) break;
          if (obj) {
            
            // Process the received object
            // the second to last object is the item data set
            // the last object is the entire list items data set as an array
            // we only want the 2nd to last object 
            if (typeof obj === 'object' && !Array.isArray(obj)) {
              // store search data
              const data = obj as ISearchData;
              __internalSearchDataV2[`${data.id}`] = {
                type: data.category,
                data: data,
                parentData: data,
              };
            }
          }
        }

        __searchDataIsLoaded = true;

        resolve(true);
      }
    );
  }) 
}

const IOS_PADDING = import.meta.env.IOS ? 20 : 0;

const panelStyles = computed(() => {
  let adjustedWidth = 0;
  let adjustedHeight = 0;
  adjustedHeight += BOTTOM_HEADER_NAV_HEIGHT(IOS_PADDING) + 20;
  adjustedWidth = app.device.width;

  return {
    width: `calc(${adjustedWidth}px - 0px)`,
    height: `calc(100% - ${adjustedHeight}px)`,
    paddingLeft: `20px`,
    paddingRight: `12px`,
    paddingBottom: `80px`,
  };
})

function goToSection(data:{ item: ISearchItemRender }) {
  // console.log("goToSection")
  nextTick(() => {
    app.drawers.bottom.open = !app.drawers.bottom.open;
    app.drawers.bottom.props = {};
  })
  
  setTimeout(() => {
    router.push({ path: `/home/${data.item.path}`,  });
  }, 450);  
}

onMounted(() => {

  if (timeoutMount.value) clearTimeout(timeoutMount.value);

  if (searchInputRef?.value) {
    timeoutMount.value = setTimeout(() => {
      searchInputRef?.value?.inputRef()?.focus();
    }, 650);  
  }
})

</script>

<template>
<BasePanel class="search-panel relative">
  <div class="side-content pxlr-0 pxb-20 relative">
    
    <BaseInput 
      ref="searchInputRef"
      :modelValue="searchValue.text" 
      :icon="SearchIcon" 
      placeholder="enter keyword(s)"
      innerClass="gapx-10" 
      elementClass="pxlr-16 pxtb-10"
      containerClass="pxlr-20"
      @input="onInput"
    />
    
    <div class="status mxt-20 mxb-20 pxlr-20">{{resultLabel}}</div>

    <BaseList 
      :dataProvider="fetchResults" 
      :style="panelStyles"
      :class="[
        `list-container`, 
        `gapx-16`, 
        `overflow-v-scroll`, 
        state.isSearching || state.isTyping 
        ? `fade-out` : `` ].join(` `)"
    >
      <template v-slot:listItemSlot="data">
        <div v-if="data.item.groupType === `GroupHeader`" class="group-header">
          {{ data.item.label }}
        </div>
        <BaseButton v-else
          :class="`variant-blue width-100`" 
          :innerClassName="`px-20 justify-between gapx-20`"
          :bodyClassName="`text-left`"
          :label="data.item.label"
          :accessory-icon="UpRightArrowIcon"
          @triggered="() => goToSection(data as any)"
        />
      </template>
    </BaseList>
  </div>
  <BaseButton class="close-button absolute tx-20 rx-20" :innerClassName="`flex-column`" :icon="CloseIcon" @triggered="() => {
    app.drawers.bottom.open = !app.drawers.bottom.open;
    app.drawers.bottom.props = {};
  }" />
</BasePanel>
</template>

<style scoped lang="scss">
.base-panel {
  :deep(.inner-panel) {
    background-color: white;
  }
}

.side-content {
  height: calc(100% - 0px);
  padding-top: 90px;
}

.base-input {
  :deep(.ui-input-field) {
    background-color: white;
    border-radius: $global-radius;
    border: 2px solid $secondary-blue;
  }
  :deep(.ui-input-element) {
    background-color: transparent;
  }
}
.menu-item {
  border-radius: $global-radius;
  border: 2px solid $secondary-blue;
}
.base-list {
  @include use-scroller-styles();

  transition: opacity 300ms ease;

  &.fade-out {
    opacity: 0;
  }
}
.group-header {
  font-size: 16px;
  font-weight: 600;
}
</style>