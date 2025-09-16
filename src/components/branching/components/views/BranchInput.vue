<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchInput"
}   
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, shallowRef } from 'vue';
import BaseButton from '@/ui/controls/BaseButton.vue';
import BaseComboBox from '@/ui/controls/BaseComboBox.vue';
import BaseList from '@/ui/controls/BaseList.vue';
import BaseInput from '@/ui/controls/BaseInput.vue';
import { BranchItem, IBranchTypeProps } from '@/types';
import { IBaseInputProps, IBaseListItemData } from '@/ui/types';
import ActionButton from '@/components/actionbutton/ActionButton.vue';
import useToasterService from '@/ui/notifications/toaster/AppToastService';
import { CalculatorParamType } from '@/types';
import { 
  BSAByWeight, 
  BSAByWeightAndHeight, 
  ConvertFeetToCentimeters,
  ConvertInchesToCentimeters,
  ConvertPoundsToKilograms,
  ConvertFarenheitToCelcius,
  ConvertFrenchGaugeToMillimeters,
  ConvertMillimetersToKilopascals,
  ConvertMillilitersToLiters,
  Convert_mmHg_To_cmH2O,
  Convert_cmH2O_To_mmHg,
  CalculateBloodFlowByWeight,
  CalculateOxygenTransfer,
  CalculateOxygenDelivery,
  CalculateHct,
  CalculateOI,
  CalculatePF,
  CalculateRP,
  Calculate_1_4_Tubing,
  Calculate_3_8_Tubing,
  Calculate_1_2_Tubing,
  enforceRange,
  convertMathSymbols,
  CalculationResult,
  ICalculationError,
  IMathEnforeRangeParams
  
} from '@/utils/ElsoMath';
import { copyToClipboard } from '@/utils/StringTools';
import { IHtmlParserDataProps } from '@/ui/types';
import HtmlParserComponent from '@/ui/parsers/HtmlParserComponent.vue';
import { loadHTMLFile } from '@/utils/FileTools';

import ChevronRightIcon from '@/assets/icons/chevron-right-icon.svg';
import ResetIcon from '@/assets/icons/reset-icon.svg';

const calculationFunctions:Record<string, Function> = {
  BSAByWeight,
  BSAByWeightAndHeight,
  ConvertFeetToCentimeters,
  ConvertInchesToCentimeters,
  ConvertPoundsToKilograms,
  ConvertFarenheitToCelcius,
  ConvertFrenchGaugeToMillimeters,
  ConvertMillimetersToKilopascals,
  ConvertMillilitersToLiters,
  Convert_mmHg_To_cmH2O,
  Convert_cmH2O_To_mmHg,
  CalculateBloodFlowByWeight,
  CalculateOxygenTransfer,
  CalculateOxygenDelivery,
  CalculateHct,
  CalculateOI,
  CalculatePF,
  CalculateRP,
  Calculate_1_4_Tubing,
  Calculate_3_8_Tubing,
  Calculate_1_2_Tubing
}

const mathUtilFunctions:Record<string, Function> = {
  enforceRange
}

type InputListItemType = IBaseListItemData & Partial<BranchItem> & { 
  inputProps?: IBaseInputProps; 
  id?: string;
  operation?: string;
  value?: number;
  hidden?: boolean;
  data?: any;
};

const props = withDefaults(defineProps<IBranchTypeProps>(), {
  showTitle: false
});

defineEmits<{
  (e: 'navigate', branchTo: string | null): void;
  (e: 'triggered', dataProps?: IHtmlParserDataProps): void;
}>();

// Component State Setup
interface IState {
  result: number;
  resultError: ICalculationError | null,
  isCopying: boolean;
}

const state:IState = reactive({
  result: 0,
  resultError: null,
  isCopying: false
})

interface IUtilsObject {
  controlledValue: string;
  error: {
    index: number;
    hasError: boolean;
    message: string;
  } | null
}
const inputController = reactive<Record<string, IUtilsObject>>({});

const mounted = ref(false);
const baseFormRef = ref<InstanceType<typeof HTMLFormElement>>();
const itemRefs = ref<any[]>([]);
const timeoutCopy = shallowRef<ReturnType<typeof setTimeout>>();
const toasterService = useToasterService();
const { addToast } = toasterService;

const preHtmlContent = ref<string>("");
const postHtmlContent = ref<string>("");

const computedList = computed(() => {
  if (mounted.value) {
    if (!props.view?.items) return null;
    
    const items = props.view.items as InputListItemType[];
    
    const filtered = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i]?.type !== "operator") {
        filtered.push({ ...items[i], controlledValue: "1" });

        inputController[i.toString()] = {
          controlledValue: "",
          error: {
            index: -1,
            hasError: false,
            message: "",
          }
        }
      }      
    }

    return filtered;
  }
  
  return null;
})

function calculate() {
  let operationState: string | undefined = "";
  let calculationDetails:CalculatorParamType = {};

  let items: InputListItemType[] = props?.view?.items as InputListItemType[];

  const __result = items.reduce((prev, curr, index) => {
    switch (curr?.type) {
      case "number":
        // console.log("index", index)
        // console.log("curr", curr)
        // console.log("curr?.id", curr?.id)
        // console.log("inputController", inputController)
        // console.log("inputController", inputController[index.toString()])

        if (inputController[index.toString()]) {
          
          if (inputController[index.toString()].hasOwnProperty("controlledValue")) {
            const controlled = inputController[index.toString()].controlledValue;
            if (controlled.length === 0) {
              const fieldErrorIndex = computedList.value?.findIndex((cItem) => cItem?.id === curr?.id);
              if (fieldErrorIndex && fieldErrorIndex > -1) {
                const el = findAndReturnItemRefElement(computedList.value?.[fieldErrorIndex]?.id!);
                const input = el?.accessoryIconRef()?.inputRef() as HTMLInputElement;
                const inputProps = curr.inputProps as IMathEnforeRangeParams;
                
                let inputResult: any = {};
                if (inputProps) {
                  inputResult = enforceRange({ ...inputProps, value: "", id: curr?.id! });

                  setInputController({
                    item: {
                      ...computedList.value?.[fieldErrorIndex],
                      index: parseInt(input.dataset.index!)
                    }
                  }, {
                    ...items[fieldErrorIndex]?.inputProps,
                    error: inputResult.error,
                    value: controlled
                  });

                  window.requestAnimationFrame(async () => {
                    state.resultError = { 
                      error: { message: `${inputResult.error}`, field: `${curr?.id}` },
                      value: ""
                    }

                    await nextTick();

                    scrollToBottom();
                  })
                }
              }
            }
          }
          
          const numberVal = parseFloat(inputController[index.toString()].controlledValue);
          calculationDetails[curr?.id!] = isNaN(numberVal) ? 0 : numberVal;
        }
      break;
      
      case "dropdown":
        const dropdownVal = findAndReturnItemRefValueByID(curr?.id!);
        calculationDetails[curr?.id!] = dropdownVal;
      break;

      case "operator":
        operationState = curr?.operation;
        // console.log("operationState", curr)
        // console.log("calculationDetails", calculationDetails)
        // console.log("items", items)
        
        let result = calculationFunctions[operationState as string](calculationDetails, items);

        if (result?.hasOwnProperty("error")) {
          const fieldErrorIndex = computedList.value?.findIndex((cItem) => cItem?.id === result?.error?.field);
          if (fieldErrorIndex && fieldErrorIndex > -1) {
            const el = findAndReturnItemRefElement(computedList.value?.[fieldErrorIndex]?.id!);
            const input = el?.accessoryIconRef()?.inputRef() as HTMLInputElement;

            if (result.value !== undefined) {
              setInputController({
                item: {
                  ...computedList.value?.[fieldErrorIndex],
                  index: parseInt(input.dataset.index!)
                }
              }, {
                ...items[fieldErrorIndex]?.inputProps,
                error: result.error.message,
                value: result.value
              });
            }
          }
        }

        return result;
    }
    
    
    return prev;
  }, 0);

  // fix to 2 decimals
  if (!isNaN(__result)) {
    state.result = parseFloat(__result.toFixed(2));
    state.resultError = null;    
  }
  else {
    // console.error("result.error", __result);
    state.result = 0;
    state.resultError = (__result as ICalculationError);
    scrollToBottom();
  }
}

function reset() {
  baseFormRef.value?.reset();
  state.result = 0;
  state.resultError = null;

  // reset error fields if any
  for (const key in inputController) {
    inputController[key].controlledValue = "";
    inputController[key].error = null;
    // delete inputController[key];
  }
}

function setItemsRef(el:any) {
  if (el && el.hasOwnProperty("comboInputRef")) {
    itemRefs.value.push(el as InstanceType<typeof BaseComboBox>);
  }
  else {
    itemRefs.value.push(el as InstanceType<typeof BaseButton>);
  }
}

function findAndReturnItemRefElement(id:string) {
  const resultInput = itemRefs.value?.filter((itemRef) => {
    if (itemRef.hasOwnProperty("comboInputRef")) {
      const input = itemRef?.comboInputRef() as InstanceType<typeof HTMLInputElement>;
      return input.hasAttribute("id") && input.getAttribute("id") === id;
    }

    const accessory = itemRef?.accessoryIconRef() as InstanceType<typeof BaseInput>;
    const input = accessory?.inputRef();
    return input.hasAttribute("id") && input.getAttribute("id") === id;
  })

  if (resultInput?.length === 0) return null;

  return resultInput[0];
}

function findAndReturnItemRefValueByID(id:string) {
  const resultInput = itemRefs.value?.filter((itemRef) => {

    if (itemRef.hasOwnProperty("comboInputRef")) {
      const input = itemRef?.comboInputRef() as InstanceType<typeof HTMLInputElement>;
      return input.hasAttribute("id") && input.getAttribute("id") === id;
    }

    const accessory = itemRef?.accessoryIconRef() as InstanceType<typeof BaseInput>;
    const input = accessory?.inputRef();
    return input.hasAttribute("id") && input.getAttribute("id") === id;
  })

  if (resultInput?.length === 0) return 0;
  
  const returnInput = resultInput[0];

  // BaseCombobox Component
  if (returnInput.hasOwnProperty("comboInputRef")) {
    const dropInputValue = parseFloat(returnInput?.comboInputRef().value);
    return isNaN(dropInputValue) ? 0 : dropInputValue;
  }

  // BaseInput Component
  if (returnInput.hasOwnProperty("accessoryIconRef")) {
    const accessory = returnInput?.accessoryIconRef() as InstanceType<typeof BaseInput>;
    const inputValue = parseFloat(accessory?.inputValue());
    return isNaN(inputValue) ? 0 : inputValue;
  }
}

async function onCopy(value: any) {
  if (state.isCopying) return;
  clearTimeout(timeoutCopy.value);
  state.isCopying = true;

  await copyToClipboard(value?.toString());

  timeoutCopy.value = setTimeout(() => state.isCopying = false, 1000);
  nextTick(() => addToast({ label: `Copied to clipboard.` })); 
}

function setFocusToResult() {
  document.getElementById(`result-label`)?.focus();
}

interface IMathInputResult {
  error: string;
  min?: number;
  max?: number; 
  value: string;
}

function setInputController(data: any, result: IMathInputResult) {
  // console.log("setInputController", data, result)
  // console.log("setInputController.data.item.index", data.item.index)

  const params: IUtilsObject = {
    controlledValue: result.value.toString(),
    error: null
  }

  // check if we have an error
  if (result.error) {
    params.error = {
      index: data.item.index,
      hasError: true,
      message: result.error,
    }
  }

  inputController[data.item.index.toString()] = params;
}

// @private
function __onBlur(data: any) {
  if (!data) return;
  // console.warn("__onBlur", data);

  const id = computedList.value?.[data.item.index]?.id!;
  const dataProps = computedList.value?.[data.item.index]?.data!;
  // console.log("__onBlur.dataProps", dataProps);
  // console.log("__onBlur.computedList", computedList.value?.[data.item.index]);

  const el = findAndReturnItemRefElement(computedList.value?.[data.item.index]?.id!);
  const input = el?.accessoryIconRef()?.inputRef() as HTMLInputElement;

  if (dataProps?.hasOwnProperty(`onBlur`)) {
    
    if (mathUtilFunctions.hasOwnProperty(dataProps['onBlur'])) {
      const result = mathUtilFunctions[dataProps['onBlur'] as string]({
        value: input.value,
        min: input.min,
        max: input.max,
        id: id
      });
      // apply error label to specific input field
      setInputController(data, result);
    }
    else {
      console.error(`[mathUtilFunctions] missing onBlur prop '${dataProps['onBlur']}''`);
    }    
  }
  else {
    setInputController(data, { value: input.value, error: "" });
  }
}

// @private
function __onInput(data: any) {
  if (!data) return;

  // const dataProps = computedList.value?.[data.item.index]?.data!;

  // if (dataProps?.hasOwnProperty(`onInput`)) {
  //   const el = findAndReturnItemRefElement(computedList.value?.[data.item.index]?.id!);
  //   const input = el?.accessoryIconRef()?.inputRef();

  //   if (mathUtilFunctions.hasOwnProperty(dataProps['onInput'])) {
  //     const result = mathUtilFunctions[dataProps['onInput'] as string](input);

  //     // apply error label to specific input field
  //     setInputController(data, result);
  //   }
  //   else {
  //     console.error(`[mathUtilFunctions] missing onInput prop '${dataProps['onInput']}''`);
  //   }          
  // }
}

// @private
function __onEnter(data: any) {
  if (!data) return;

  console.warn("__onEnter", data);

  // calculate();
  // setFocusToResult();

  const dataProps = computedList.value?.[data.item.index]?.data!;
  const id = computedList.value?.[data.item.index]?.id!;

  const el = findAndReturnItemRefElement(computedList.value?.[data.item.index]?.id!);
  const input = el?.accessoryIconRef()?.inputRef();

  if (dataProps?.hasOwnProperty(`onEnter`)) {
    if (mathUtilFunctions.hasOwnProperty(dataProps['onEnter'])) {
      const result = mathUtilFunctions[dataProps['onEnter'] as string]({
        value: input.value,
        min: input.min,
        max: input.max,
        id: id
      });

      // apply error label to specific input field
      setInputController(data, result);
    }
    else {
      console.error(`[mathUtilFunctions] missing onEnter prop '${dataProps['onEnter']}''`);
    }          
  }
  else {
    setInputController(data, { value: input.value, error: "" });
  }
}

async function scrollToBottom() {
  
  const view = document.querySelector(".branch-view");

  await nextTick();

  if (view && view.parentElement) {
    // view.parentElement.scrollTop = view.parentElement.scrollHeight;
    view.parentElement.scrollTo({
      top: view.parentElement.scrollHeight,
      behavior: "smooth",
    });
  }
};

onMounted(async () => {
  setTimeout(() => mounted.value = true, 75);  

  // check optional data
  if (props?.view?.data) {
    // check for post Html
    if (props?.view?.data?.hasOwnProperty("preHtml")) {
      if (props?.view?.data?.preHtml?.length > 0) {
        const rawHtml = await loadHTMLFile(`/assets/data/app/html/${props?.view?.data?.preHtml}`);
        setTimeout(() => {
          nextTick(() => {
            preHtmlContent.value = rawHtml!;
          })
        }, 750);  
      }      
    }
    else if (props?.view?.data?.hasOwnProperty("postHtml")) {
      if (props?.view?.data?.postHtml?.length > 0) {
        const rawHtml = await loadHTMLFile(`/assets/data/app/html/${props?.view?.data?.postHtml}`);
        setTimeout(() => {
          nextTick(() => {
            postHtmlContent.value = rawHtml!;
          })
        }, 750);  
      }      
    }
  }
})

</script>

<template>
  <h2 v-if="props?.showTitle && props?.view?.title?.length! > 0" 
    class="title transform-z" v-html="props?.view?.title"></h2>
  <div v-if="props?.view?.content" v-html="props?.view?.content" :class="`content mb-1 transform-z${props?.view?.contentClass ? ' ' + props?.view?.contentClass : ''}`"></div>
  
  <div :className="`html-parser-wrapper${props?.view?.data?.preHtmlClass ? ' ' + props?.view?.data?.preHtmlClass : ''}`">
    <HtmlParserComponent v-show="preHtmlContent" :htmlString="`${preHtmlContent}`" />
  </div>

  <form ref="baseFormRef" class="branch-input-container">
    <BaseList class="items-list gapx-8" :dataProvider="computedList">
      <template v-slot:listItemSlot="data">
        
        <BaseButton 
          v-if="!computedList?.[data.item.index]?.hidden 
          && computedList?.[data.item.index]?.type === `number`"
          :ref="setItemsRef"
          :type="`button`"
          :class="`width-100 pointer-none disable-animation`" 
          :innerClassName="`px-0 flex-column align-start`"
          :bodyClassName="`text-left`"
          :label="data.item.label"
          :labelClassName="`input-label mxb-12`"
          :accessoryIcon="BaseInput"
          :accessoryIconClassName="`width-100`"
          :accessoryIconProps="{ 
            controlledValue: inputController?.[data.item.index]?.controlledValue,
            error: inputController?.[data.item.index]?.error,
            placeholder: `Enter value`,
            
            ...computedList?.[data.item.index]?.inputProps,          
            id: computedList?.[data.item.index]?.id, 
            type: computedList?.[data.item.index]?.type, 
            index: data.item.index,
            class: `pointer-all`, 
            containerClass: `variant-calc pointer-all width-inherit ${computedList?.[data.item.index]?.inputProps?.containerClass ?? ``}`, 
            elementClass: `base-control px-12 text-center ${computedList?.[data.item.index]?.inputProps?.elementClass ?? ``}`,
            onBlur: () => __onBlur(data),
            onInput: () => __onInput(data),
            onEnter: () => __onEnter(data),
          }"
        />
        <BaseComboBox v-else-if="!computedList?.[data.item.index]?.hidden 
          && computedList?.[data.item.index]?.type === `dropdown`"
          :ref="setItemsRef"
          :options="data.item.data"
          :id="computedList?.[data.item.index]?.id"
          :label="data.item.label"
          :icon="ChevronRightIcon"
        />
        <div v-else-if="!computedList?.[data.item.index]?.hidden 
          && computedList?.[data.item.index]?.type === `heading`" 
          v-html="computedList?.[data.item.index]?.label"
          :class="[`heading`, computedList?.[data.item.index]?.class]">
        </div>
      </template>
    </BaseList>
  </form>

  <transition name="nested" appear>
    <div class="calc-item width-100 flex align-center justify-between mxt-16 outer">
      <ActionButton outlined :label="`Reset`" :icon="ResetIcon" iconClassName="mxr-6" @triggered="reset" />
      <ActionButton :label="`Calculate`" :accessoryIcon="ChevronRightIcon" @triggered="calculate" />
    </div>
  </transition >
  
  <transition name="nested" appear v-if="props?.view?.resultDescription">
    <div class="description-item note flex flex-column align-start mtb-1-25 px-12 outer">
      <div class="description-label mxb-6 inner" v-html="`${convertMathSymbols(props?.view?.resultDescription) ?? ''}`"></div>
    </div>
  </transition >

  <transition name="nested" appear>
    <div class="result-item flex flex-column align-start mxt-20 outer">
      <div class="result-label mxb-6 inner" v-html="`RESULT ${convertMathSymbols(props?.view?.resultLabel?.toString()) ?? ''}`"></div>
      <div id="result-label" class="result-box width-100 text-center px-7" @click="() => state.result > 0 && onCopy(state.result)">
        {{ state.result }}
      </div>
      <div v-if="state.resultError" id="result-error" class="result-error width-100 text-center px-7" @click="() => state.result > 0 && onCopy(state.result)">
        {{ state.resultError.error?.message }}
      </div>

    </div>
  </transition >
  
  <HtmlParserComponent v-show="postHtmlContent" :htmlString="`${postHtmlContent}`" />
  
</template>

<style scoped lang="scss">
.content {
  
  :deep(.heading) {
    // margin-top: 1rem;
    // font-size: 14px;
    font-weight: 700;
    color: $sixth-color;
  }
  // :deep(ul) {
  //   // font-size: 14px;
  //   // font-weight: 500;
  // }
}

:deep(.list-item) {
  .input-label {
    font-size: 18px;
    font-weight: 700;

    .label-desc {
      display: block;
      font-size: 14px;
      font-weight: 400;
    }
  } 
  .heading {
    font-size: 14px;
    font-weight: 700;
    color: $sixth-color;

    .note {
      font-weight: 500;
    }

    .dark-blue {
      color: $primary-color;
    }

    .purple {
      color: $sixth-color;
    }

    span i { // notes
      color: $primary-color;
      font-weight: 500;
    }
  }
}

.branch-input-container {

  :deep(.items-list) {
    .list-item + .list-item {
      margin-top: 0.75rem;
    }
    .list-item:last-of-type {
      margin-bottom: 0.5rem;
    }
  }
}

.description-item {
  font-weight: 500;

  :deep(.math-formula) {
    font-weight: 400;
    font-size: 15px;
    user-select: all;
    display: block;
    margin: 0.75rem 0 0 0;
  }
}

.result-label {
  font-weight: 700;
  font-size: 18px;
  user-select: all;
}
.result-box {
  height: 50px;
  border: 4px solid #2C51CF;
  box-shadow: 0px 6px 20px -13px #0B247A66;
  color: $primary-color;
  background-color: #fff;
  border-radius: $global-radius;
  font-weight: 700;
  font-size: 20px;

  @include makeTextSelectable();
}

.result-error {
  margin: 0.25rem 0;
  font-size: 12px;
  font-weight: 700;
  color: red;
}

</style>