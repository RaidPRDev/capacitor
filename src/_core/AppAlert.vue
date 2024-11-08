<script lang="ts">
export default {
  inheritAttrs: false,
  name: "AppAlert"
}   
</script>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { IApp } from '@/ui/types';
import { APP_ID, APP_ALERT_ID } from '@/_core/Constants';

interface IAppAlertProps {
  id?: string;
}

// Component Props Setup
const props = withDefaults(defineProps<IAppAlertProps>(), {
  id: APP_ALERT_ID.toLowerCase()
}) 

// Reference App
const app = inject<IApp>(APP_ID) as IApp;

const isAlertOpen = computed(() =>
{
  return app.alert.options.open
})

function onBackdrop() {
  if (app.drawers.closeOutside) {
    if (app.drawers.left.open) {
      app.drawers.left.open = false;
    }
    
    if (app.drawers.right.open) {
      app.drawers.right.open = false;
    }
    
    if (app.drawers.top.open) {
      app.drawers.top.open = false;
    }
    
    if (app.drawers.bottom.open) {
      app.drawers.bottom.open = false;
    }
  }
  
  if (app.alert.closeOutside) {
    if (app.alert.options.open) {
      app.alert.options.open = false;
    }
  } 
}

function onAfterEnter() {}
function onAfterLeave() {}

</script>

<template>
  <div :id="props?.id" class="abs-fs">
    <transition :name="'fade'" @after-enter="onAfterEnter" @after-leave="onAfterLeave">
      <div class="backdrop width-inherit height-inherit absolute pointer-all z-index-1" v-if="isAlertOpen" @click="onBackdrop"></div>
    </transition>
    <transition :name="'slide-in-from-bottom'" @after-enter="onAfterEnter" @after-leave="onAfterLeave">
      <component class="alert-module" v-if="app.alert.options.open" :is="app.alert.component" v-bind="app?.alert?.options?.props"></component>
    </transition>
  </div>
</template>

<style scoped lang="scss">
// .app-alert {}
.backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>