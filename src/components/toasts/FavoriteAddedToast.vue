<script lang="ts">
export default {
  inheritAttrs: true,
  name: "FavoriteToast"
}   
</script>

<script lang="ts" setup>
import FavoritesStarIcon from '@/assets/icons/favorites-star-line-icon.svg';

interface IFavoriteToastProps {
  label: string;
}

// Component Props Setup
const props = withDefaults(defineProps<IFavoriteToastProps>(), {});

</script>

<template>
  <div :class="[`flex-center`]">
    <div class="icon relative mxlr-10">
      <div class="icon-fx"><FavoritesStarIcon /></div>
      <div class="icon-trans absolute tx-0 lx-0 flex-center"><FavoritesStarIcon /></div>
    </div>
    <div class="label">{{ props.label }}</div>
  </div>
</template>

<style lang="scss" scoped>
.icon {
  color: white;

  .icon-fx, .icon-trans {
    width: 48px;
    svg { width: 100%; height: 100%; }
  }
}

// first star scale in
$star-scale-duration: 0.75s;
$star-scale-delay: 0.15s;

// second star fade in
$star-fade-duration: 0.75s;
$star-fade-delay: ($star-scale-duration + $star-scale-delay) - 0.5s;

// label fade in
$star-label-duration: 0.75s;
$star-label-delay: $star-scale-duration;

.icon-fx {
  opacity: 0;
  animation: starFadeIn $star-fade-duration linear $star-fade-delay 1 normal forwards;
}

.icon-trans {
  opacity: 0;
  animation: starScaleIn $star-scale-duration ease-out $star-scale-delay 1 normal forwards;
  // width: 24px;
  // height: 24px;
  // svg {
  //   width: 100%;
  //   height: 100%;
  // }
  // animation-name: starScaleIn;
  // animation-duration: $star-scale-duration;
  // animation-timing-function: ease-out;
  // animation-delay: $star-scale-delay;
  // animation-iteration-count: 1;
  // animation-direction: normal;
  // animation-fill-mode: forwards;
}

.label {
  color: white;
  font-size: 16px;
  font-weight: 400;

  opacity: 0;
  animation: labelFadeIn $star-label-duration ease-out $star-label-delay 1 normal forwards;
}

@keyframes starScaleIn {
  0% {
    opacity: 0;
    transform: scale(1.5) rotateZ(-180deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 1;
    transform: scale(0.95) rotateZ(0deg);
  }
}

@keyframes starFadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: scale(1.3);
  }
}

@keyframes labelFadeIn {
  0% {
    opacity: 0;
  }
  50% {
    
  }
  100% {
    opacity: 1;
  }
}
</style>