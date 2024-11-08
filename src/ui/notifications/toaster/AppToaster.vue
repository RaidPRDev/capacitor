<script lang="ts">
export default {
  name: "AppToaster"
}   
</script>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import useToasterService from '@/ui/notifications/toaster/AppToastService';
import AppToasterItem from './AppToasterItem.vue';
import { IAppToaster, IToaster } from './types';
import { APP_TOASTER_ID } from '@/_core/Constants';

// Component Props Setup
const props = withDefaults(defineProps<IAppToaster>(), {
  id: APP_TOASTER_ID.toLowerCase(),
  enabled: true,
});

const toasterService = useToasterService();
const { removeToast } = toasterService;
const { toasts, positions } = storeToRefs(toasterService);

onMounted(() => {})

const __toasts = computed(() => {
  let list: Array<IToaster> = [];
  if (!props?.enabled) return list;

  for (let i = positions?.value?.length!; i >= 0; i--) {
    const item = toasts?.value?.filter((item) => item.index === positions?.value?.[i]);
    if (!item || item.length === 0) continue;
    
    list.push(item[0]);
  }

  return list;
})

function onToastRemove(data: IToaster) {
  removeToast(data);
}

</script>

<template>

<div :id="props?.id" class="abs-fs z-index-3">
  <div class="inner-toaster flex flex-column justify-end width-100 height-100 mxlr-10 mxtb-20 relative">
    <TransitionGroup tag="div" data-transition name="toaster-slide-up" mode="out-in" type="transition">
        <template v-for="(item) in __toasts" :key="`toaster-item-${item.id}`">
          <AppToasterItem v-bind="item" @complete="onToastRemove" />  
        </template>
    </TransitionGroup>
  </div>
</div>

</template>

<style scoped lang="scss">
.inner-toaster {
  width: calc(100% - 20px);
  height: calc(100% - 40px);
}

.toaster-in-move,
.toaster-in-enter-active,
.toaster-in-leave-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 0.975);
}

.toaster-in-enter-from {
  transform: translate(120%, 0);
}
.toaster-in-leave-to {
  transform: translate(120%, 0);
}

.toaster-in-leave-active {
  position: absolute;
}

.toaster-slide-up-move,
.toaster-slide-up-enter-active {
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 0.975);
}

.toaster-slide-up-leave-active {
  transition: all 0.85s cubic-bezier(0.175, 0.885, 0.32, 0.975);
}

.toaster-slide-up-enter-from {
  transform: translate(0, 120%);
}
.toaster-slide-up-leave-to {
  transform: translate(0, 120%);
}

.toaster-slide-up-leave-active {
  position: absolute;
}
</style>