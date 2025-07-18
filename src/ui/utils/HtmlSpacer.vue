<script lang="ts">
export default {
  inheritAttrs: false,
  name: "HtmlSpacer"
}   
</script>

<script setup lang="ts">
import { computed, CSSProperties } from 'vue';

interface IHtmlSpacerProps {
  amount?: number;
}

// Component Props Setup
const props = withDefaults(defineProps<IHtmlSpacerProps>(), {
  amount: 4
});

const styles = computed<CSSProperties>(() => {
  const { amount } = props;
  
  return {
    display: "inline-block",
    width: `${amount}px`
  };
})

</script>

<template>

<span :style="styles"></span>

</template>

<style scoped lang="scss"></style>