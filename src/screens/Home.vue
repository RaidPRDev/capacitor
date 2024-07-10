<script lang="ts">
export default {
  inheritAttrs: true,
  name: "Home"
}   
</script>

<script setup lang="ts">
import { computed } from "vue";
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
import PanicIcon from '@/assets/icons/panic-icon.svg';

const router = useRouter();
const session = useSession();

const footerMenuGroup = [
  { label: "Home", icon: HomeIcon, route: "Home" },
  { label: "Patient", icon: PatientIcon, route: "Patient" },
  { label: "Setup", icon: SetupIcon, route: "Setup" },
  { label: "Panic", icon: PanicIcon, route: "Panic" },
];

const sectionIndex = computed(() => {
  const index = footerMenuGroup.findIndex((item) => item.route === router.currentRoute.value.name);
  session?.setCurrentIndex(index);
  return index;
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
    <BaseHeader class="center-container pxlr-20" :innerClassName="`pxl-20 pxr-20`">
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
  
  <template v-slot:bodySlot="screenBodyProps">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition || 'scale-slide'" @after-leave="onAfterLeave" @after-enter="(el) => onAfterEnter(el, route)">
        <component :is="Component" v-bind="screenBodyProps" />
      </transition>
    </router-view>
  </template>
  
  <template v-slot:footerSlot>
    <BaseHeader class="center-container pxlr-20">
      <template v-slot:headerCenter>
        <ButtonGroup 
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
      border-radius: $footer-border-radius;
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