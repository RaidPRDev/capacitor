<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchHTML"
}

const DEBUG = false;
</script>

<script setup lang="ts">
import { onMounted, inject, ref, nextTick, onUnmounted } from 'vue';
import { IApp, IAppDrawerComponents, IBranchTypeProps } from '@/types';
import { loadHTMLFile } from '@/utils/FileTools';
import HtmlParserComponent from '@/ui/parsers/HtmlParserComponent.vue';
import { IHtmlParserDataProps } from '@/ui/types';
import { APP_DRAWERS_ID, APP_ID } from '@/_core/Constants';
import ImagePreviewPanel from '@/components/panels/ImagePreviewPanel.vue';

const props = withDefaults(defineProps<IBranchTypeProps>(), {
  showTitle: false
});

// error TS6133: 'emit' is declared but its value is never read.
/** @ts-ignore */
const emit = defineEmits<{
  (e: 'navigate', branchTo: string | null): void;
  (e: 'triggered', dataProps?: IHtmlParserDataProps | any): void;
}>();


const app = inject<IApp>(APP_ID) as IApp;
const drawerComponents = inject<IAppDrawerComponents>(APP_DRAWERS_ID) as IAppDrawerComponents;
const htmlContent = ref<string>("");
const content = ref<HTMLElement>();

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


/**
 * Preview Images
 * 
 */

const previewItems = ref<HTMLElement[]>([]);

function onPreviewTriggered(e:Event) {
  const target = e?.target as HTMLImageElement;

  drawerComponents.bottom = ImagePreviewPanel;
  app.drawers.bottom.closeOutside = false;
  app.drawers.bottom.open = !app.drawers.bottom.open;
  app.drawers.bottom.props = { source: target.src }
}

function addPreviewEvents() {
  previewItems.value?.forEach((item) => {
    item.addEventListener("click", onPreviewTriggered);
  });
}

function removePreviewEvents() {
  previewItems.value?.forEach((item) => {
    item.removeEventListener("click", onPreviewTriggered);
  });

  previewItems.value = [];
}


/**
 * Table Mouse Drag/Scroll Support
 * 
 */

const tableItems = ref<HTMLElement[]>([]);
const tableHeader = ref<HTMLTableElement>();
const tableBody = ref<HTMLTableElement>();

let isDragging = false;
let startX = 0;
let startY = 0;
let scrollLeft = 0;
let scrollTop = 0;

function onTableMouseDown(e: MouseEvent) {
  if (!tableHeader.value || !tableBody.value) return;

  isDragging = true;
  startX = e.pageX;
  startY = e.pageY;
  scrollLeft = tableBody.value.scrollLeft;
  scrollTop = tableBody.value.scrollTop;
  document.addEventListener("mousemove", onTableMouseMove);
  document.addEventListener("mouseup", onTableMouseUp);
}

function onTableMouseMove(e: MouseEvent) {
  if (!isDragging) return;
  if (!tableHeader.value || !tableBody.value) return;

  const dx = e.pageX - startX;
  const dy = e.pageY - startY;
  tableBody.value.scrollLeft = scrollLeft - dx;
  tableBody.value.scrollTop = scrollTop - dy;
  tableHeader.value.scrollLeft = tableBody.value.scrollLeft; // Horizontal sync
}

function onTableMouseUp() {
  isDragging = false;
  document.removeEventListener("mousemove", onTableMouseMove);
  document.removeEventListener("mouseup", onTableMouseUp);
}

function addTableEvents() {
  tableItems.value?.forEach((item) => {
    tableHeader.value = item.querySelector("#tableHeaders") as HTMLTableElement;
    tableBody.value = item.querySelector("#tableBody") as HTMLTableElement;
    tableBody.value.addEventListener("mousedown", onTableMouseDown);
  });
}

function removeTableEvents() {
  tableItems.value?.forEach(() => {
    if (!tableHeader.value || !tableBody.value) return;
    
    document.addEventListener("mousemove", onTableMouseDown);
    document.addEventListener("mouseup", onTableMouseUp);
    tableBody.value.addEventListener("mousedown", onTableMouseDown);
  });

  tableItems.value = [];
}

function handleTriggered(data: { dataProps?: IHtmlParserDataProps }) {
  if (DEBUG) console.log('BranchHTML.handleTriggered', data?.dataProps);
  if (DEBUG) console.log('Triggered event received with data:', data?.dataProps);
  if (DEBUG) console.log('Triggered event received with data:', data?.dataProps?.['data-id']);

  emit("triggered", data?.dataProps);
}

onMounted(async () => {
  observer.observe(content?.value!, { attributes: true, childList: true, subtree: true });
  const rawHtml = await loadHTMLFile(`/assets/data/app/html/${props?.view?.content}`);
  htmlContent.value = rawHtml;

  // Here we are checking if we have any interactable elements.
  // For now we only have support for image preview via [data-preview]
  nextTick(() => {
    if (content.value) {
      // collect all elements tagged by the data-preview attribute
      // and set clickable events
      const previewItemsElRaw = content.value.querySelectorAll(`[data-preview]`);
      previewItems.value = [].slice.apply(previewItemsElRaw) as HTMLElement[];
      addPreviewEvents();

      // enables table mouse scroll. 
      // only add for non touch devices
      const isTouch = document.querySelector("html")?.classList.contains("touch");
      if (!isTouch) {
        const tablesElRaw = content.value.querySelectorAll(`.table-body`);
        tableItems.value = [].slice.apply(tablesElRaw) as HTMLElement[];
        addTableEvents();
      }
    }
  });  
})

onUnmounted(() => {
  observer.disconnect();

  removePreviewEvents();
  removeTableEvents();
})

</script>

<template>
  <h2 v-if="props?.showTitle && props?.view?.title?.length! > 0" v-html="props?.view?.title" class="transform-z"></h2>
  <div ref="content">
    <HtmlParserComponent :htmlString="`${htmlContent}`" @triggered="handleTriggered" />
  </div>
  
</template>

<style scoped lang="scss">
// .html-parser {
//   :deep(.data-content) {
//     opacity: 1;
//   }
// }
</style>