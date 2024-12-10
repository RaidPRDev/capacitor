<script lang="ts">
export default {
  inheritAttrs: true,
  name: "GuideTemplate"
}   
</script>

<script setup lang="ts">
import { ComponentPublicInstance, computed, ref, VueElement } from "vue";
import { RouteLocationGeneric } from "vue-router";
import { IAppScreenProps } from "@/types";

import BaseScreen from "@/ui/panels/BaseScreen.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";

// Component Props Setup
const props = withDefaults(defineProps<IAppScreenProps>(), {}) 

// Reference Setup
const headerRef = ref<ComponentPublicInstance<typeof BaseHeader>>()
const bodyRef = ref<ComponentPublicInstance<typeof VueElement>>()
const footerRef = ref<ComponentPublicInstance<typeof BaseHeader>>()


const bodyProps = computed(() => {
  if (!headerRef?.value) return {}
  if (!bodyRef?.value) return {}
  if (!footerRef?.value) return {}

  const headerEl = headerRef?.value?.elRef() as HTMLElement;
  const headerBnds = headerEl?.getBoundingClientRect();
  const footerEl = footerRef?.value?.elRef() as HTMLElement;
  const footerBnds = footerEl?.getBoundingClientRect();
  const topPadding = 40;
  const bottomPadding = 0;
  const diff = (footerBnds.top - headerBnds.bottom) - ( topPadding + bottomPadding );

  return {
    styles: {
      height: `${diff}px`
    }
  }
})

function onAfterEnter(el:Element, route:RouteLocationGeneric) {
  if (false) console.log("onAfterEnter", el, route);
}

function onAfterLeave(el:Element) {
  if (false) console.log("onAfterLeave", el);
}

</script>

<template>
<BaseScreen 
  :className="[`guide-template`,  props?.class, props?.drawerOpen ? `drawer-open` : ``].join(` `)"
  :headerSlotProps="{ class: `z-index-1` }">
  
  <template v-slot:bodySlot>
    <div class="inner-body" v-bind="{ style: { ...bodyProps?.styles } }" >
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'scale-slide'" @after-leave="onAfterLeave" @after-enter="(el) => onAfterEnter(el, route)">
        <component ref="bodyRef" :is="Component" v-bind="{ styles: { ...bodyProps?.styles } }" />
      </transition>
    </router-view>
    </div>
  </template>  
</BaseScreen>
</template>

<style scoped lang="scss">
.guide-template {
  :deep(.inner-screen) {
    > .screen-body {
      top: 0;
      padding: 0;
      height: 100%;
      overflow-y: auto;
    }
  }  
}

.screen-header, .screen-footer {
  .center-container {
    :deep(.inner-base-header) {
      background-color: $white;
      box-shadow: $header-shadow-props $header-shadow-color;
    }
  }
}

.screen-header {
  .center-container {
    :deep(.inner-base-header) {
      border-radius: $header-border-radius;
    }
  }
}

.screen-footer {
  .center-container {
    :deep(.inner-base-header) {
      width: 100%;
      border-radius: $footer-border-radius;
      .inner-button-group {
        justify-content: space-around;
      }
    }
  }
}

.button-group {
  :deep(.menu-button) {
    color: $primary-color;

    .ui-label {
      @include getFontSize('small');
    }

    &:hover:not(.active) {
      color: $secondary-blue;
    }

    &.active {
      color: $secondary-blue;
    }
  }
}


</style>