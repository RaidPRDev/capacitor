<script lang="ts">
export default {
  inheritAttrs: false
}   
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, shallowRef } from "vue";
import { IBaseScreenSlotProps } from "@/ui/types";
import { BRANCH_HEADER_HEIGHT, GLOBAL_PADDING } from "@/_core/Constants";
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import BaseTextArea from "@/ui/controls/BaseTextArea.vue";
import useNotesStore from "@/store/notes.module";

import NotesIcon from '@/assets/icons/homeMenu/notes-icon.svg';

// Component Props Setup
/** @ts-ignore */
const props = withDefaults(defineProps<IBaseScreenSlotProps>(), {
  class: ""
});
const loading = ref<boolean>(true);

const notesStore = useNotesStore();
const { getItem, setItem } = notesStore;

// Component State Setup
interface IState {
  id: string;
  textBlock: string;
  isTyping: boolean;
  isSaving: boolean;
  hasSaved: boolean;
}

const noteBlock = getItem("UID_NOTE##000");

const state:IState = reactive({
  id: noteBlock?.id!,
  textBlock: `Loading notes...`,
  isTyping: false,
  isSaving: false,
  hasSaved: false
})

const timeoutInput = shallowRef<ReturnType<typeof setTimeout>>();
const timeoutSaveLabel = shallowRef<ReturnType<typeof setTimeout>>();
const saveInterval = shallowRef<ReturnType<typeof setInterval>>();
const textBlockRef = ref<string>("");

/** @ts-ignore */
function save() {
  if (state.isTyping) return;

  if (textBlockRef.value === state.textBlock) return;
  state.isSaving = true;

  setItem({
    id: state.id,
    textBlock: state.textBlock,
  });

  clearInterval(timeoutSaveLabel?.value);
  state.hasSaved = true;
  
  nextTick(() => {
    timeoutSaveLabel.value = setTimeout(() => {
      state.hasSaved = false;
      textBlockRef.value = state.textBlock;
    }, 2000);
  })
  
  nextTick(() => state.isSaving = false)
}

function startSavingInterval() {
  saveInterval.value = setInterval(save, 5000);
}

function stopSavingInterval() {
  clearInterval(saveInterval?.value);
}

onMounted(async () => {
  
  setTimeout(() => { 
    loading.value = false; 
    state.textBlock = textBlockRef.value = noteBlock?.textBlock!;
    startSavingInterval();
  }, 1000);
})

const textAreaStyles = computed(() => {
  let adjustedHeight = 0;
  adjustedHeight += BRANCH_HEADER_HEIGHT;  
  adjustedHeight += GLOBAL_PADDING;

  return {
    height: `calc(${props?.styles?.height} - ${adjustedHeight}px)`,
  };
})

/** @ts-ignore */
function onInput(value: number | string) {
  if (timeoutInput.value) clearTimeout(timeoutInput.value);

  state.isTyping = true;
  
  timeoutInput.value = setTimeout(() => {
    state.isTyping = false;
  }, 2000);
} 

onUnmounted(() => {
  clearTimeout(timeoutInput?.value);
  clearTimeout(timeoutSaveLabel?.value);
  clearInterval(saveInterval?.value);
})

function onFocusOut() {
  if (timeoutInput?.value) clearTimeout(timeoutInput.value);
  stopSavingInterval();
  state.isTyping = false;

  save();

  nextTick(() => startSavingInterval());
}

</script>

<template>
  <div :class="[`pxl-20 pxr-20 width-100 height-100`, props?.class]">
    <BaseHeader class="screen-heading mxb-20 height-auto">
      <template v-slot:headerLeft>
        <h1>Notes</h1>    
      </template>
      <template v-slot:headerRight>
        <Transition name="fade" :duration="750">
          <span v-if="state.hasSaved" class="save-label mxr-10">Saved</span>
        </Transition>
        <span class="flex icon"><NotesIcon /></span>
      </template>
    </BaseHeader>

    <BaseTextArea 
      :style="textAreaStyles"
      v-model:modelValue="state.textBlock" 
      :placeholder="`Add your notes here...`"
      :containerClass="`pxb-20 height-100`"
      :fieldClass="`height-100`"
      @input="onInput"
      @focusOut="onFocusOut"
    />
  </div>  
</template>

<style scoped lang="scss">
.save-label {
  font-size: 15px;
}
.icon {
  width: 43px;
  svg {
    width: 43px;
  }
}

</style>