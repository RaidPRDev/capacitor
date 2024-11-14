<script lang="ts">
export default {
  inheritAttrs: true,
  name: "ChecklistBadge"
}

// const DEBUG = false;
</script>

<script setup lang="ts">
import { computed } from 'vue';

interface IChecklistBadgeProps {
  completed: number;
  total: number;
}

const props = withDefaults(defineProps<IChecklistBadgeProps>(), {});

const percent = computed(() => {
  return ((props?.completed / props?.total) * 100).toFixed(1);
})

</script>

<template>
  <div class="checklist-badge flex align-center pointer-none">
    <div class="checklist-percent" v-html="`${percent}%`"></div>
  </div>
</template>

<style scoped lang="scss">
.checklist-badge {
  width: auto;
}
.checklist-percent {
  font-size: 14px;
  line-height: 1;
  color: white;
}
</style>