<script lang="ts">
export default {
  inheritAttrs: false,
  name: "AppNavigator"
}   
</script>

<script setup lang="ts">
import { APP_ID, APP_NAV_ID } from '@/_core/Constants';

interface IAppNavigatorProps {
  id?: string;
  drawerOpen?: boolean;
}

// Component Props Setup
const props = withDefaults(defineProps<IAppNavigatorProps>(), {
  id: APP_NAV_ID.toLowerCase()
}) 

// Emission Event Setup
const emit = defineEmits<{
  (e: 'onTransitionEnter', el:Element, done:() => void): void;
}>()

function onTransitionEnter(el:Element, done:() => void) {
  emit("onTransitionEnter", el, done);
}

</script>

<template>
  
  <router-view v-slot="{ Component, route}" :key="`${APP_ID}`">
    <div :id="props?.id" class="rel-inherit">
      <transition :name="route.meta.transition" @enter="onTransitionEnter" :duration="550">
          <component :is="Component" v-bind="{ drawerOpen: props?.drawerOpen }" />
      </transition>
    </div>
  </router-view>

</template>

<style scoped lang="scss"></style>