<script lang="ts">
export default {
  inheritAttrs: false,
  name: "AppSearchPanel"
}   
</script>

<script setup lang="ts">
import { computed, inject, reactive, ref, shallowRef, watch } from 'vue';
import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseList from '@/ui/controls/BaseList.vue';
import BaseInput from '@/ui/controls/BaseInput.vue';

import { APP_ID } from '@/App.vue';
import { IApp } from '@/ui/types';

// import Logo from '/assets/elso_logo.png';
import CloseIcon from '@/assets/icons/close-icon.svg';
import SearchIcon from '@/assets/icons/search-icon.svg';
import UpRightArrowIcon from '@/assets/icons/up-right-arrow-icon.svg';

interface IAppSearchBottomPanelProps {
  items?: any;
}

// Component Props Setup
const props = withDefaults(defineProps<IAppSearchBottomPanelProps>(), {});

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

const app = inject<IApp>(APP_ID) as IApp;
const timeoutInput = shallowRef<ReturnType<typeof setTimeout>>();
const timeoutSearch = shallowRef<ReturnType<typeof setTimeout>>();
const searchList = ref<any[]>([]);
const searchValue = reactive({ text: "" });

watch(props, () => {
  console.log("watch.props", props)
})

const searchData = [
  { label: "Equipment A", icon: UpRightArrowIcon },
  { label: "Equipment B", icon: UpRightArrowIcon },
  { label: "Equipment C", icon: UpRightArrowIcon },
  { label: "Test A", icon: UpRightArrowIcon },
  { label: "Test B", icon: UpRightArrowIcon },
  { label: "Test C", icon: UpRightArrowIcon },
];

function findSubstring(search:string, label: string) {
  const position = label.toLowerCase().indexOf(search.toLowerCase()) > -1;
  return position;
}

function onInput(value: number | string)
{
  state.isTyping = true;
  state.isSearching = false;
  if (Array.isArray(searchList.value) && searchList.value.length > 0) {
    searchList.value = [];
  }

  if (timeoutSearch.value) clearTimeout(timeoutSearch.value);
  if (timeoutInput.value) clearTimeout(timeoutInput.value);
  
  timeoutInput.value = setTimeout(() => {
    state.isTyping = false;
    searchItems(value as string);
  }, 750);
}

async function searchItems(term:string)
{
  if (state.isSearching) return ;
  if (timeoutSearch.value) clearTimeout(timeoutSearch.value);

  state.isSearching = true;
  
  const result = searchData?.filter((item) => {
    if (term?.length === 0) return false;
    return findSubstring(term, item.label);
  })

  timeoutSearch.value = setTimeout(() => {
    searchList.value = result;
    state.isSearching = false;
  }, 400)
}

const fetchResults = computed(() => 
{
  return searchList.value;
})

const resultLabel = computed(() => 
{
  if (state.isSearching || state.isTyping) return 'Searching...';
  else return `${fetchResults.value.length} result(s) found`;
  
})

</script>

<template>
<BasePanel class="relative">
  <div class="side-content pxlr-16 pxt-90 pxb-20 relative">
    
    <BaseInput 
      :modelValue="searchValue.text" 
      :icon="SearchIcon" 
      placeholder="enter test or equip"
      innerClass="gapx-10" 
      elementClass="pxlr-16 pxtb-10"
      @input="onInput"
    />
    
    <div class="status mxt-20 mxb-20">{{resultLabel}}</div>

    <BaseList 
      :dataProvider="fetchResults" 
      :class="[
        `gapx-16`, 
        state.isSearching || state.isTyping 
        ? `fade-out` : `` ].join(` `)"
    >
      <template v-slot:listItemSlot="data">
        <BaseButton 
          :class="`variant-blue width-100`" 
          :innerClassName="`px-20 justify-start gapx-20`"
          :bodyClassName="`text-left`"
          :label="data.item.label"
          :icon="UpRightArrowIcon"
        >
        </BaseButton>
      </template>
    </BaseList>
  </div>
  <BaseButton class="close-button absolute tx-20 rx-20" :innerClassName="`flex-column`" :icon="CloseIcon" @triggered="() => {
    app.drawers.bottom.open = !app.drawers.bottom.open;
  }" />
</BasePanel>
</template>

<style scoped lang="scss">
.base-panel {
  :deep(.inner-panel) {
    background-color: rgba(white, .95);
  }

  // Does not work in chrome
  html:not(.desktop) & {
    :deep(.inner-panel) {
      background-color: rgba(white, .85);
      backdrop-filter: blur(10px);
    }
  }
}
.side-content {
  height: calc(100% - 0px);
}
.base-input {
  opacity: 1;
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
  transition: opacity 300ms ease;

  &.fade-out {
    opacity: 0;
  }
}
</style>