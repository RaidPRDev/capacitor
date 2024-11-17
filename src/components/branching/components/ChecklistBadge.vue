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

const CIRCLE_SIZE = 30;
const CIRCLE_CENTER = CIRCLE_SIZE / 2;
const CIRCLE_RADIUS = 82;

const percent = computed(() => {
  return ((props?.completed / props?.total));
})

</script>

<template>
  <div class="checklist-badge flex align-center pointer-none width-auto">
    <div class="checklist-progress relative">
      <svg :height="CIRCLE_SIZE" :width="CIRCLE_SIZE">
	      <circle class="circle" :cx="CIRCLE_CENTER" :cy="CIRCLE_CENTER" r="12" stroke="#ffffff" stroke-width="5" fill-opacity="0" />
      </svg>
      <svg :height="CIRCLE_SIZE" :width="CIRCLE_SIZE">
	      <circle :style="{ strokeDasharray: CIRCLE_RADIUS, strokeDashoffset: CIRCLE_RADIUS * percent }" class="circle" :cx="CIRCLE_CENTER" :cy="CIRCLE_CENTER" r="12" stroke="#0B247A" stroke-width="6" fill-opacity="0" />
      </svg>
    </div>
  </div>
</template>

<style scoped lang="scss">
.checklist-progress {
  width: 30px;
  height: 30px;
  transform: translate3d(0, 0, 0);
}
svg {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%,-50%) rotateZ(-90deg);
}
.circle {
  stroke-dasharray: 82;
  stroke-dashoffset: 0;
}
</style>