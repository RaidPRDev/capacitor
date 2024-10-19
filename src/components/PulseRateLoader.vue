<script lang="ts">
export default {
  inheritAttrs: true,
  name: "PulseRateLoader"
}   
</script>

<script setup lang="ts"></script>

<template>
  <div class="loader">
    <!-- cleaned up in https://svgomg.net/ -->
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170.69 108.61"><path pathLength="1" id="pulse-line" d="M5.32 78.13c.96-.01 5-8.5 5.54-8.54.58-.05 6.1 8.51 7.1 8.51 3.66 0 9.29.06 10.71.05 2.53-.01 4.82-72.88 4.82-72.88l4.76 97.28 3.97-24.45 20.45-.22C64 77.86 77.1 63.66 78.36 63.8c1.31.15 6.68 14.08 7.94 14.07 2.3-.03 33.32.04 35.76.02.96 0 5-8.5 5.53-8.53.59-.05 6.1 8.51 7.1 8.5 3.66 0 9.3.07 10.72.06 2.53-.02 4.81-72.89 4.81-72.89l4.77 97.28 3.97-24.44s83.34-3.33 74.69 7.67"/></svg>
  </div>
</template>

<style scoped lang="scss">
.loader {
  width: 140px;
}

svg {
  overflow: visible;
  width: 100%;
  transform: scaleX(1.25);
}
svg path#pulse-line {
  fill: none;
  stroke: $primary-color;
  stroke-width: 2;
  stroke-linecap: butt;
  stroke-linejoin: round;
  stroke-miterlimit: 4;
  stroke-dasharray:none;
  stroke-opacity: 1;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: dash 2.5s ease-out infinite;
  animation-delay: 0.25s;
}

@keyframes dash {
  0% {
    stroke-dashoffset: 1;
  }
  80% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes blink {
  0% {
    opacity: 0;
    transform: scale(0);
  }
  60% {
    opacity: 0;
    transform: scale(0);
  }
  70% {
    opacity: 1;
    transform: scale(1.2);
  }
  75% {
    opacity: 1;
    transform: scale(1.0);
  }
  80% {
    opacity: 1;
    transform: scale(1.2);
  }
  85% {
    opacity: 1;
    transform: scale(1.0);
  }
  100% {
    opacity: 0;
    transform: scale(1.0);
  }
}
</style>