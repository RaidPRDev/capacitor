<script lang="ts">
export default {
  inheritAttrs: true,
  name: "ChecklistBadge"
}

// const DEBUG = false;
</script>

<script setup lang="ts">
import { computed } from 'vue';
import ProgressBG from '@/assets/icons/progress/progress-circle-bg.svg';

interface IChecklistBadgeProps {
  completed: number;
  total: number;
}

const props = withDefaults(defineProps<IChecklistBadgeProps>(), {});

const CIRCLE_RADIUS = 76;

const percent = computed(() => {
  return ((props?.completed / props?.total));
})

</script>

<template>
  <div class="checklist-badge flex align-center pointer-none width-auto">
    <div class="checklist-progress relative">
      <svg height="29" width="29">
	      <circle class="circle" cx="14.5" cy="14.5" r="12" stroke="#ffffff" stroke-width="4" fill-opacity="0" />
      </svg>
      <svg height="29" width="29">
	      <circle :style="{ strokeDasharray: CIRCLE_RADIUS, strokeDashoffset: CIRCLE_RADIUS * percent }" class="circle" cx="14.5" cy="14.5" r="12" stroke="#0B247A" stroke-width="5" fill-opacity="0" />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
.checklist-progress {
  width: 29px;
  height: 29px;
  transform: translate3d(0, 0, 0);
}
svg {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%) rotateZ(-90deg);
}
.circle {
  stroke-dasharray: 76;
  stroke-dashoffset: 0;
}
</style>