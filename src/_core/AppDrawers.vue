<script lang="ts">
export default {
  inheritAttrs: false,
  name: "AppDrawers"
}   
</script>

<script setup lang="ts">
import { computed, inject } from 'vue';
import { IApp, IAppDrawerComponents } from '@/ui/types';
import { APP_ID, APP_DRAWERS_ID } from '@/Constants';

interface IAppDrawersProps {
  id?: string;
  components: IAppDrawerComponents;
}

// Component Props Setup
const props = withDefaults(defineProps<IAppDrawersProps>(), {
  id: APP_DRAWERS_ID.toLowerCase()
}) 

// Reference App
const app = inject<IApp>(APP_ID) as IApp;

const isDrawerOpen = computed(() =>
{
  return app.drawers.left.open 
  || app.drawers.right.open
  || app.drawers.top.open
  || app.drawers.bottom.open
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

function onDrawerAfterEnter() {}
function onDrawerAfterLeave() {}

</script>

<template>
  <div :id="props?.id" ref="element" class="abs-fs">
    <div class="inner-panel width-inherit height-inherit">
      <div class="app-drawer-item abs-fs">
        
        <transition :name="'fade'" @after-enter="onDrawerAfterEnter" @after-leave="onDrawerAfterLeave">
          <div class="drawer-backdrop abs-fs" v-if="isDrawerOpen" @click="onBackdrop"></div>
        </transition>
        <transition :name="'slide-right'" @after-enter="onDrawerAfterEnter" @after-leave="onDrawerAfterLeave">
          <component class="drawers drawer-left" v-if="app.drawers.left.open" :is="props?.components.left"></component>
        </transition>
        <transition :name="'slide-left'" @after-enter="onDrawerAfterEnter" @after-leave="onDrawerAfterLeave">
          <div class="drawers drawer-right" v-if="app.drawers.right.open"></div>
        </transition>

      </div>
      <div class="app-drawer-item absolute lx-0 tx-0 width-100 height-inherit pointer-none">
        
        <transition :name="'slide-in-from-bottom'" @after-enter="onDrawerAfterEnter" @after-leave="onDrawerAfterLeave">
          <component class="drawers drawer-bottom" v-if="app.drawers.bottom.open" :is="props?.components.bottom" v-bind="app?.drawers?.bottom?.props"></component>
        </transition>

      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
.drawer-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
.app-drawer-item {
  
  &.hidden {
    pointer-events: none;
    visibility: hidden;
  }
}
.drawers {
  position: absolute;
  pointer-events: all;
  height: inherit;
}
.drawer-left {
  left: 0;
  width: 316px;
}
.drawer-right {
  right: 0;
  width: 316px;
}
.drawer-top {
  top: 0;
  left: 0;
  width: 316px;
}
.drawer-bottom {
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>