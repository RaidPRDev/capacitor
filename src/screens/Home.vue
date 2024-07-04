<script lang="ts">
export default {
  inheritAttrs: true,
  name: "Home"
}   
</script>

<script setup lang="ts">
import Greet from "../components/Greet.vue";
import FullLayout from "../components/layout/FullLayout.vue";
import BaseButton from "../components/ui/controls/BaseButton.vue";
</script>

<template>
<FullLayout className="home">
  
  <template v-slot:headerSlot>
    <h1>Header</h1>
  </template>
  
  <template v-slot:bodySlot>
    
    <div class="text-center">
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="logo vite" alt="Vite logo" />
      </a>
      <a href="https://tauri.app" target="_blank">
        <img src="/tauri.svg" class="logo tauri" alt="Tauri logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="../assets/vue.svg" class="logo vue" alt="Vue logo" />
      </a>
    </div>

    <BaseButton :label="`Button`" />

    <p>Click on the Tauri Vite, and Vue logos to learn more.</p>

    <Greet />
  </template>
  
  <template v-slot:footerSlot>
    <h1>Footer</h1>
  </template>
 
</FullLayout>

</template>

<style scoped lang="scss">
// .home {
//   background-color: black;
// }
</style>