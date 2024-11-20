<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchDefault"
}   
</script>

<script setup lang="ts">
import { CSSProperties, onMounted, onUnmounted, ref } from 'vue';
import { IBranchTypeProps } from '@/types';
import { loadHTMLFile } from '@/utils/FileTools';
import { parseAndReplaceCurlyBraceContent } from '@/components/branching/data/DataTools';

const props = withDefaults(defineProps<IBranchTypeProps>(), {
  showTitle: false
});

// error TS6133: 'emit' is declared but its value is never read.
/** @ts-ignore */
const emit = defineEmits<{
  (e: 'navigate', branchTo: string | null): void;
  (e: 'triggered', dataProps?: any): void;
}>();

const htmlContent = ref<string>("");
const content = ref<HTMLElement>();
const contentStyles = ref<CSSProperties>({});

/** @ts-ignore */
const callback = function(mutationList:any, observer:any) {
  for (const mutation of mutationList) {
    if (mutation.type === 'childList') {
      updateTableColumnWidth();
    }
    else if (mutation.type === 'attributes') {
      // console.log(`The ${mutation.attributeName} attribute was modified.`);
    }
  }
}
const observer = new MutationObserver(callback);

function updateTableColumnWidth() {
  const tableHeader = document?.getElementById('tableHeaders')?.querySelector('thead');
  const tableHeaderColElements = tableHeader?.querySelectorAll("th");
  if (!tableHeaderColElements) return;
  
  const tableHeaderColumns = [].slice.apply(tableHeaderColElements) as HTMLElement[];
  const tableBodyHeader = document?.getElementById('tableBody')?.querySelector('thead');
  const tableBodyHeaderColumns = [].slice.apply(tableBodyHeader?.querySelectorAll("th")) as HTMLElement[];

  let totalTableWidth = 0;
  tableBodyHeaderColumns?.forEach((bodyColumn, bodyColIndex) => {
    // console.log("offsetWidth", tableHeaderColumns[bodyColIndex].offsetWidth)
    // if (tableHeaderColumns[bodyColIndex]?.offsetWidth) bodyColumn.style.width = tableHeaderColumns[bodyColIndex].offsetWidth + 'px';
    bodyColumn.style.width = tableHeaderColumns[bodyColIndex]?.style?.width;
    // console.log("width", bodyColumn.style.width)
    
    totalTableWidth += parseInt(bodyColumn.style.width, 10);

    // experiment
    // bodyColumn.style.width = tableHeaderColumns[bodyColIndex]?.style?.width;
    // bodyColumn.setAttribute("width", bodyColumn.style.width);
    // tableHeaderColumns[bodyColIndex].setAttribute("width", bodyColumn.style.width);
  })

  const headTable = document?.getElementById('tableHeaders')?.querySelector('table') as HTMLTableElement;
  const bodyTable = document?.getElementById('tableBody')?.querySelector('table') as HTMLTableElement;
  headTable.style.width = `${totalTableWidth}px`;
  bodyTable.style.width = `${totalTableWidth}px`;
}

// Refs for the zoomable div and scale
// const scale = ref<number>(1);
// const minScale = 0.5; // Minimum allowed scale factor
// const maxScale = 3;   // Maximum allowed scale factor

// // Variables for pinch and pan tracking
// let initialDistance: number = 0;
// let initialScale: number = 1;
// let isPanning = false;
// let startX = 0;
// let startY = 0;
// let translateX = ref<number>(0);
// let translateY = ref<number>(0);

// // Handle the touch start event
// const handleTouchStart = (event: TouchEvent): void => {
//   if (event.touches.length === 2) {
//     // Pinch start
//     const [touch1, touch2] = event.touches;
//     initialDistance = Math.hypot(
//       touch2.clientX - touch1.clientX,
//       touch2.clientY - touch1.clientY
//     );
//     initialScale = scale.value;
//   } else if (event.touches.length === 1) {
//     // Pan start
//     isPanning = true;
//     startX = event.touches[0].clientX - translateX.value;
//     startY = event.touches[0].clientY - translateY.value;
//   }
// };

// // Handle the touch move event
// const handleTouchMove = (event: TouchEvent): void => {
//   if (event.touches.length === 2) {
//     // Handle pinch zoom
//     const [touch1, touch2] = event.touches;
//     const newDistance = Math.hypot(
//       touch2.clientX - touch1.clientX,
//       touch2.clientY - touch1.clientY
//     );

//     // Calculate new scale and clamp it between minScale and maxScale
//     const scaleChange = newDistance / initialDistance;
//     scale.value = Math.max(minScale, Math.min(maxScale, initialScale * scaleChange));

//     // Apply the transform to the div
//     if (content.value) {
//       content.value.style.transform = `scale(${scale.value}) translate(${translateX.value}px, ${translateY.value}px)`;
//     }
//   } else if (event.touches.length === 1 && isPanning) {
//     // Handle pan with reduced sensitivity when scaled in
//     const scaleAdjustment = scale.value > 1 ? 1 / scale.value : 1; // Reduce panning when zoomed in
//     translateX.value = (event.touches[0].clientX - startX) * scaleAdjustment;
//     translateY.value = (event.touches[0].clientY - startY) * scaleAdjustment;

//     // Apply the transform to the div
//     if (content.value) {
//       content.value.style.transform = `scale(${scale.value}) translate(${translateX.value}px, ${translateY.value}px)`;
//     }
//   }
// };

// // Handle the touch end event to stop panning
// const handleTouchEnd = (): void => {
//   isPanning = false;
// };

// @touchstart="handleTouchStart"
// @touchmove="handleTouchMove"
// @touchend="handleTouchEnd"

onMounted(async () => {
  observer.observe(content?.value!, { attributes: true, childList: true, subtree: true });
  htmlContent.value = await loadHTMLFile(`/assets/data/app/html/${props?.view?.content}`);
  // console.log("htmlContent", htmlContent.value)
  // console.log("htmlContent", parseAndReplaceCurlyBraceContent(htmlContent.value))
  htmlContent.value = parseAndReplaceCurlyBraceContent(htmlContent.value);


})

onUnmounted(() => {
  observer.disconnect();
})

</script>

<template>
  <h2 v-if="props?.showTitle && props?.view?.title?.length! > 0" class="transform-z">{{ `${props?.view?.title}` }}</h2>
  <div 
    ref="content" 
    class="content-default transform-z" 
    :style="contentStyles" 
    v-html="htmlContent"
    
  ></div>
</template>

<style scoped lang="scss">
.content-default {
  touch-action: pan-x pan-y pinch-zoom;
}
</style>