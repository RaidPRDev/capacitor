<script lang="ts">
export default {
  inheritAttrs: false,
  name: "AppAlertPanel"
}   
</script>

<script setup lang="ts">
import { computed, inject } from 'vue';
import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import ButtonGroup from "@/ui/controls/ButtonGroup.vue";

import { APP_ID } from '@/_core/Constants';
import { IApp } from '@/types';

import CloseIcon from '@/assets/icons/close-icon.svg';
  
interface IAppAlertProps {
  title?: string;
  content?: string;
  labels?: Array<string>;
  showClose?: boolean;
  // action?: Array<string>;
  action?: (index: number, data?: any) => void,
  data?: Record<string, any>
}

// Component Props Setup
const props = withDefaults(defineProps<IAppAlertProps>(), {});
  
const app = inject<IApp>(APP_ID) as IApp;

const labels = computed(() => {
  const list = props?.labels?.map((label) => {
    return { label, class: "" }
  })
  return list as any;
})

</script>

<template>
<BasePanel class="alert-wrapper relative" inner-class="flex align-start justify-center">
  <div class="alert-panel px-20 relative">
    
    <BaseHeader class="alert-header mxlr-0 pxb-8 mxb-8 height-auto">
      <template v-slot:headerCenter>
        <div v-if="props?.title" class="title">{{ props?.title }}</div>
      </template>
      <template v-slot:headerRight>
        <BaseButton 
          v-if="showClose"
          :class="`close-button`" 
          :icon="CloseIcon"
          @triggered="() => {
            app.alert.options.open = !app.alert.options.open;
          }"
        />
      </template>
    </BaseHeader>

    <div v-if="props?.content" class="content" v-html="props?.content"></div>
    
    <BaseHeader class="alert-footer pxlr-20 mxb-6 height-auto" centerClassName="width-100">
      <template v-slot:headerCenter>
        <ButtonGroup 
          :class="`width-100 mxt-26`"
          :innerClassName="`gapx-16`"
          :role="`contentinfo`"
          :defaultButtonProps="{ 
            elementClassName: `variant-red small`, 
            innerClassName: `pxlr-13 pxtb-9` 
          }"
          :dataProvider="labels" 
          @triggered="(selected) => {
            app.alert.options.open = !app.alert.options.open;
            props?.action && props?.action(selected.index, selected?.data)
          }"
        ></ButtonGroup>
      </template>
    </BaseHeader>
  </div>
  
</BasePanel>
</template>

<style scoped lang="scss">
.alert-wrapper {
  margin-top: 60%;
}

.alert-panel {
  background-color: white;
  width: calc(100% - 40px);
  border-radius: $global-radius;
}

.content {
  font-size: 20px;
  color: $primary-color;
  font-weight: 500;
}

.close-button {
  color: lightgray;
}
</style>