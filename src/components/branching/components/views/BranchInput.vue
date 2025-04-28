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
  enforceRangeV2,
  convertMathSymbols
  
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
  enforceRange,
  enforceRangeV2
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

// error TS6133: 'emit' is declared but its value is never read.
/** @ts-ignore */
const emit = defineEmits<{
  (e: 'navigate', branchTo: string | null): void;
  (e: 'triggered', dataProps?: IHtmlParserDataProps): void;
}>();

// Component State Setup
interface IState {
  result: number;
  isCopying: boolean;
}

const state:IState = reactive({
  result: 0,
  isCopying: false
})

const mounted = ref(false);
const baseFormRef = ref<InstanceType<typeof HTMLFormElement>>();
const timeoutCopy = shallowRef<ReturnType<typeof setTimeout>>();
const toasterService = useToasterService();
const { addToast } = toasterService;

const postHtmlContent = ref<string>("");

const computedList = computed(() => {
  if (mounted.value) return (props.view?.items as InputListItemType[])?.filter((item) => {
    return (item?.type !== "operator") 
  }) as InputListItemType[]
  return null;
})

function calculate() {
  let operationState: string | undefined = "";
  let calculationDetails:CalculatorParamType = {};

  let items: InputListItemType[] = props?.view?.items as InputListItemType[];

  const __result = items.reduce((prev, curr) => {
    switch (curr?.type) {
      case "number":
        const numberVal = findAndReturnItemRefValueByID(curr?.id!);
        calculationDetails[curr?.id!] = numberVal;
      break;
      
      case "dropdown":
        const dropdownVal = findAndReturnItemRefValueByID(curr?.id!);
        calculationDetails[curr?.id!] = dropdownVal;
      break;

      case "operator":
        operationState = curr?.operation;
        return calculationFunctions[operationState as string](calculationDetails);
    }
    
    
    return prev;
  }, 0);

  // fix to 2 decimals
  state.result = parseFloat(__result.toFixed(2));
}

function reset() {
  baseFormRef.value?.reset();
  state.result = 0;
}

const itemRefs = ref<any[]>([]);

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

onMounted(async () => {
  setTimeout(() => mounted.value = true, 75);  

  // check optional data
  if (props?.view?.data) {
    // check for post Html
    if (props?.view?.data?.hasOwnProperty("postHtml")) {
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

// // state.result < 0 || state.result > 0  ? state.result : '---' 

</script>

<template>
  <h2 v-if="props?.showTitle && props?.view?.title?.length! > 0" class="title transform-z">{{ `${props?.view?.title}` }}</h2>
  <div v-if="props?.view?.content" v-html="props?.view?.content" class="content mb-1 transform-z"></div>
  
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
          placeholder: `Enter value`,
          ...computedList?.[data.item.index]?.inputProps,
          id: computedList?.[data.item.index]?.id, 
          type: computedList?.[data.item.index]?.type, 
          class: `pointer-all`, 
          containerClass: `variant-calc pointer-all width-inherit ${computedList?.[data.item.index]?.inputProps?.containerClass ?? ``}`, 
          elementClass: `base-control px-12 text-center ${computedList?.[data.item.index]?.inputProps?.elementClass ?? ``}`,

          onBlur: () => {
            if (!computedList?.[data.item.index]?.data) return;

            const dataProps = computedList?.[data.item.index]?.data!;
            if (dataProps?.hasOwnProperty(`onBlur`)) {
              const el = findAndReturnItemRefElement(computedList?.[data.item.index]?.id!);
              const input = el?.accessoryIconRef()?.inputRef();
              
              if (mathUtilFunctions.hasOwnProperty(dataProps['onBlur'])) {
                mathUtilFunctions[dataProps['onBlur'] as string](input);
              }
              else {
                console.error(`[mathUtilFunctions] missing onBlur prop '${dataProps['onBlur']}''`);
              }          
            }
          },

          onInput: () => {
            if (!computedList?.[data.item.index]?.data) return;

            const dataProps = computedList?.[data.item.index]?.data!;
            if (dataProps?.hasOwnProperty(`onInput`)) {
              const el = findAndReturnItemRefElement(computedList?.[data.item.index]?.id!);
              const input = el?.accessoryIconRef()?.inputRef();
              
              if (mathUtilFunctions.hasOwnProperty(dataProps['onInput'])) {
                mathUtilFunctions[dataProps['onInput'] as string](input);
              }
              else {
                console.error(`[mathUtilFunctions] missing onInput prop '${dataProps['onInput']}''`);
              }  
            }
          },
          
          onEnter: () => {
            calculate();
            setFocusToResult();
          }
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
      <div class="result-label mxb-6 inner" v-html="`RESULT ${props?.view?.resultLabel ?? ''}`"></div>
      <div id="result-label" class="result-box width-100 text-center px-7" @click="() => state.result > 0 && onCopy(state.result)">
        {{ state.result }}
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

</style>