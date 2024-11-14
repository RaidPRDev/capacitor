<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchHTML"
}

const DEBUG = false;
</script>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { IBranchTypeProps } from '@/types';
import { loadHTMLFile } from '@/utils/FileTools';
import HtmlParserComponent from '@/ui/parsers/HtmlParserComponent.vue';
import { IHtmlParserDataProps } from '@/ui/types';
// import { APP_ID } from '@/_core/Constants';

const props = withDefaults(defineProps<IBranchTypeProps>(), {
  showTitle: false
});

// error TS6133: 'emit' is declared but its value is never read.
/** @ts-ignore */
const emit = defineEmits<{
  (e: 'navigate', branchTo: string | null): void;
  (e: 'triggered', dataProps?: IHtmlParserDataProps): void;
}>();

// const app = inject<IApp>(APP_ID) as IApp;

const htmlContent = ref<string>("");

onMounted(async () => {
  const rawHtml = await loadHTMLFile(`/assets/data/app/html/${props?.view?.content}`);
  htmlContent.value = rawHtml;
})

function handleTriggered(data: { dataProps?: IHtmlParserDataProps }) {
  if (DEBUG) console.log('BranchHTML.handleTriggered', data?.dataProps);
  if (DEBUG) console.log('Triggered event received with data:', data?.dataProps);
  if (DEBUG) console.log('Triggered event received with data:', data?.dataProps?.['data-id']);

  emit("triggered", data?.dataProps);
}

</script>

<template>
  <h2 v-if="props?.showTitle && props?.view?.title?.length! > 0" class="transform-z">{{ `${props?.view?.title}` }}</h2>
  <HtmlParserComponent :htmlString="`${htmlContent}`" @triggered="handleTriggered" />
</template>

<style scoped lang="scss">
// .html-parser {
//   :deep(.data-content) {
//     opacity: 1;
//   }
// }
</style>