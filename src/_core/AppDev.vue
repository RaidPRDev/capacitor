<script lang="ts">
export default {
  inheritAttrs: false,
  name: "AppDev"
}   
</script>

<script setup lang="ts">
import { inject, nextTick, reactive, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { APP_ID } from '@/Constants';
import useAppStore from '@/store/app.module';
import useToasterService from '@/ui/notifications/toaster/AppToastService';
import { IApp } from '@/ui/types';
import { copyToClipboard } from '@/utils/StringTools';

interface IAppDevProps {
  id?: string;
}

// Component Props Setup
const props = withDefaults(defineProps<IAppDevProps>(), {
  id: "__app_dev__",
  enabled: true
}) 

const timeoutCopy = shallowRef<ReturnType<typeof setTimeout>>();
const state = reactive<{ isCopying?: boolean }>({
  isCopying: false
})

const app = inject<IApp>(APP_ID) as IApp;
const appStore = useAppStore();
const toasterService = useToasterService();
const { addToast } = toasterService;
const route = useRoute();

watch(route, () => {
  let routePathID = route.path?.split("/").pop();
  appStore.setCurrentID(routePathID!.toUpperCase());
}, { flush: "pre" })

watch(app.drawers, () => {
  const isDrawerOpen = app.drawers.bottom.open || app.drawers.left.open || app.drawers.top.open || app.drawers.right.open;

  let drawerName = "";
  if (app.drawers.top.props?.name) {
    drawerName = app.drawers.top.props?.name as string;
  }
  else if (app.drawers.bottom.props?.name) {
    drawerName = app.drawers.bottom.props?.name as string;
  }
  else if (app.drawers.left.props?.name) {
    drawerName = app.drawers.left.props?.name as string;
  }
  else if (app.drawers.right.props?.name) {
    drawerName = app.drawers.right.props?.name as string;
  }

  if (isDrawerOpen && drawerName?.length > 0) {
    switch (drawerName) {
      case "checklist-panel":
        appStore.setCurrentID(app.drawers.bottom.props?.id!);
      break;

      default: 
        appStore.setCurrentID(drawerName?.toUpperCase());
    }
  }
  else {
    let routePathID = route.path?.split("/").pop();
    appStore.setCurrentID(routePathID!.toUpperCase());
  }
})

async function onCopy() {
  if (state.isCopying) return;
  clearTimeout(timeoutCopy.value);
  state.isCopying = true;
  
  await copyToClipboard(`${appStore?.$state.currentViewID}`);

  timeoutCopy.value = setTimeout(() => state.isCopying = false, 1000);
  nextTick(() => addToast({ label: `ID copied to clipboard.` }));
}

</script>

<template>
  <div :id="props?.id" ref="element" class="abs-fs z-index-4">
    <div class="width-inherit height-inherit px-10">
      <div class="_id text-center relative">{{ appStore?.$state.currentViewID }}
        <div class="_hit-area absolute width-100 height-100 tx-0 lx-0 pointer-all" @click="onCopy"></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
._id {
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
  color: grey;
  user-select: none;
}
._hit-area {
  cursor: pointer;
  left: -7.5px;
  top: -7.5px;
  width: calc(100% + 15px);
  height: calc(100% + 15px);
  user-select: none;
  // background-color: rgba(0, 0, 0, 0.1);
}
</style>