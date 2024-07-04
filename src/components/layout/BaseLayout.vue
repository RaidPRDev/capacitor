<script lang="ts">
export default {
  inheritAttrs: false,
  name: "BaseLayout"
}   
</script>

<script setup lang="ts">
import type { IBaseLayoutProps } from './layoutTypes';

// Component Props Setup
const props = withDefaults(defineProps<IBaseLayoutProps>(), {}) 

</script>

<template>
<div class="base-layout" :v-bind="props">
  <slot name="bodySlot">
    <div>Body</div>
  </slot>
</div>
</template>

<style scoped lang="scss">
.base-layout {
  background-color: white;
}
</style>