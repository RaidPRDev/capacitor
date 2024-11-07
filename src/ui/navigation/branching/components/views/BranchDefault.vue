<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchDefault"
}   
</script>

<script setup lang="ts">
import { CSSProperties, onMounted, onUnmounted, ref } from 'vue';
import { IBranchTypeProps } from '@/ui/navigation/branching/types';
import { loadHTMLFile } from '@/utils/FileTools';
import { parseAndReplaceCurlyBraceContent } from '../../utils/DataTools';

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
  <div ref="content" class="transform-z" :style="contentStyles" v-html="htmlContent"></div>
</template>

<style scoped lang="scss"></style>