<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchDefault"
}   
</script>

<script setup lang="ts">
import { onMounted } from 'vue';
import { BranchViewData } from '@/ui/navigation/branching/types';

const props = defineProps<{
  view: BranchViewData | null;
}>();

const emit = defineEmits<{
  (e: 'navigate', branchTo: string | null): void;
}>();

onMounted(() => {})

</script>

<template>
  <h1 class="transform-z">{{ `${props?.view?.title}` }}</h1>
  <div class="transform-z" v-html="props?.view?.content"></div>
</template>

<style scoped lang="scss"></style>