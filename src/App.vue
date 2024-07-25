<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useDevice } from "@/plugins/Device";

// init device
const device = useDevice();
const renderCount = ref(false);

onMounted(() => { 
  device?.init(); 
  if (!renderCount.value) renderCount.value = true;
});

function onEnter(el:Element, done:() => void) {
  if (false) console.log(el);
  if (!renderCount.value) renderCount.value = true;
  done();
}

const wrapperStyles = computed(() => {
  if (!device?.isMobile()) {
    
    // non mobile devices
    return { 
      backgroundColor: `#f5f5f5`,
      width: `375px`, 
      height: `812px`,
      borderRadius: `47px`,
      overflow: `hidden`
    }
  }

  const res = device?.state.resolution
  return { width: `${res.width}px`, height: `${res.height}px` }
});


</script>

<template>
  <div class="app-wrapper relative" :style="{...wrapperStyles}">
    <router-view v-slot="{ Component, route }">
      <transition :name="route.meta.transition" @enter="onEnter" :duration="550">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped lang="scss"></style>

<style lang="scss">
#app {
  @include renderPhoneTemplate();
}
</style>