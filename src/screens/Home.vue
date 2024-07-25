<script lang="ts">
export default {
  inheritAttrs: true,
  name: "Home"
}   
</script>

<script setup lang="ts">
import { ComponentPublicInstance, computed, ref, VueElement } from "vue";
import { RouteLocationGeneric, useRouter } from "vue-router";
import { IButtonGroupSelected } from "@/ui/types";

import BaseScreen from "@/ui/panels/BaseScreen.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import ButtonGroup from "@/ui/controls/ButtonGroup.vue";
import useSession from '@/store/session.module';

import Logo from '/assets/elso_logo.png';
import MenuIcon from '@/assets/icons/menu-icon.svg';
import SearchIcon from '@/assets/icons/search-icon.svg';

import HomeIcon from '@/assets/icons/home-icon.svg';
import PatientIcon from '@/assets/icons/patient-icon.svg';
import SetupIcon from '@/assets/icons/setup-icon.svg';
import PanicIcon from '@/assets/icons/panic-red-icon.svg';

const router = useRouter();
const session = useSession();

// Reference Setup
const headerRef = ref<ComponentPublicInstance<typeof BaseHeader>>()
const bodyRef = ref<ComponentPublicInstance<typeof VueElement>>()
const footerRef = ref<ComponentPublicInstance<typeof BaseHeader>>()

const footerMenuGroup = [
  { label: "Home", icon: HomeIcon, route: "Home", class: "" },
  { label: "Patient", icon: PatientIcon, route: "Patient", class: "" },
  { label: "Setup", icon: SetupIcon, route: "Setup", class: "" },
  { label: "Panic", icon: PanicIcon, route: "Panic", class: "" },
];

const sectionIndex = computed(() => {
  const index = footerMenuGroup.findIndex((item) => item.route === router.currentRoute.value.name);
  session?.setCurrentIndex(index);
  return index;
})

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

function onFooterMenuTriggered(selected: IButtonGroupSelected) {
  if (sectionIndex.value === selected.index) return;

  // session?.setCurrentIndex(selected.index);
  session.$patch({ currentIndex: selected.index })

  router.push({ name:selected.data.route });
}

function onAfterEnter(el:Element, route:RouteLocationGeneric) {
  if (false) console.log("onAfterEnter", el, route);
}

function onAfterLeave(el:Element) {
  if (false) console.log("onAfterLeave", el);
}

</script>

<template>
<BaseScreen className="home">
  
  <template v-slot:headerSlot>
    <BaseHeader ref="headerRef" class="center-container pxlr-20" :innerClassName="`pxl-20 pxr-20`">
      <template v-slot:headerLeft>
        <BaseButton class="menu-button" :innerClassName="`flex-column`" :icon="MenuIcon" />
      </template>
      <template v-slot:headerCenter>
        <img :src="Logo" width="81" height="60" class="absolute bx--20" />
      </template>
      <template v-slot:headerRight>
        <BaseButton class="menu-button" :innerClassName="`flex-column`" :icon="SearchIcon" />
      </template>
    </BaseHeader>
  </template>
  
  <template v-slot:bodySlot>
    <div class="inner-body" v-bind="{ style: { ...bodyProps?.styles } }" >
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'scale-slide'" @after-leave="onAfterLeave" @after-enter="(el) => onAfterEnter(el, route)">
        <component ref="bodyRef" :is="Component" v-bind="{ styles: { ...bodyProps?.styles } }" />
      </transition>
    </router-view>
    </div>
  </template>
  
  <template v-slot:footerSlot>
    <BaseHeader ref="footerRef" class="center-container pxlr-20" centerClassName="width-100">
      <template v-slot:headerCenter>
        <ButtonGroup 
          :class="`footer width-100`"
          :role="`contentinfo`"
          :selectedIndex="sectionIndex"
          :defaultButtonProps="{ elementClassName: `menu-button mxlr-10`, innerClassName: `flex-column` }"
          :dataProvider="footerMenuGroup" @triggered="onFooterMenuTriggered"
        ></ButtonGroup>
      </template>
    </BaseHeader>
  </template>
 
</BaseScreen>
</template>

<style scoped lang="scss">

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
    transition: color $btn-transition-ms $btn-transition-ease;

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