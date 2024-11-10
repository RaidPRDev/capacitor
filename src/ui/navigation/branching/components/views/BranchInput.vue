<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchInput"
}   
</script>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, shallowRef } from 'vue';
import BaseButton from '@/ui/controls/BaseButton.vue';
import BaseList from '@/ui/controls/BaseList.vue';
import BaseInput from '@/ui/controls/BaseInput.vue';
import { BranchItem, IBranchTypeProps } from '@/ui/navigation/branching/types';
import { IBaseInputProps, IBaseListItemData } from '@/ui/types';
import ActionButton from '@/components/ActionButton.vue';
import useToasterService from '@/ui/notifications/toaster/AppToastService';
import { CalculatorParamType } from '@/ui/navigation/branching/types';
import { 
  BSAByWeight, 
  BSAByWeightAndHeight, 
  ConvertFeetToCentimeters,
  ConvertInchesToCentimeters,
  ConvertPoundsToKilograms,
  ConvertFarenheitToCelcius,
  ConvertFrenchGaugeToMillimeters,
  ConvertMillimetersToKilopascals,
  ConvertMillimetersToLiters
  
} from '@/utils/ElsoMath';
import { copyToClipboard } from '@/utils/StringTools';
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
  ConvertMillimetersToLiters
}

type InputListItemType = IBaseListItemData & Partial<BranchItem> & { 
  inputProps?: IBaseInputProps; 
  id?: string;
  operation?: string;
  value?: number;
  hidden?: boolean;
};

const props = withDefaults(defineProps<IBranchTypeProps>(), {
  showTitle: false
});

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

onMounted(() => {
  setTimeout(() => mounted.value = true, 75)
})

const computedList = computed(() => {
  if (mounted.value) return (props.view?.items as InputListItemType[])?.filter((item) => {
    return (item?.type !== "operator") 
  }) as InputListItemType[]
  return null;
})

function calculate() {
  let operationState: string | undefined = "";
  let calculationDetails:CalculatorParamType = {};

  state.result = (props.view?.items as InputListItemType[]).reduce((prev, curr) => {
    switch (curr?.type) {
      case "number":
        const numberVal = findAndReturnItemRefValueByID(curr?.id!);
        calculationDetails[curr?.id!] = numberVal;

        // switch (operationState) {
        //   case "+":
        //     return prev + numberVal;
        //   case "-":
        //     return prev - numberVal;
        //   case "/":
        //     return prev / numberVal;
        //   case "*":
        //     return prev * numberVal;
        //   default:
        // }
        // return numberVal;
      break;

      case "operator":
        operationState = curr?.operation;
        return calculationFunctions[operationState as string](calculationDetails);

      // case "constant":
      //   console.log(`constant value`, curr.value);
      //   const constantVal = parseNumber(curr.value) as number;
        
      //   switch (operationState) {
      //     case "+":
      //       return prev + constantVal;
      //     case "-":
      //       return prev - constantVal;
      //     case "/":
      //       return prev / constantVal;
      //     case "*":
      //       return prev * constantVal;
      //     default:
      //   }
      //   return constantVal;
    }
    
    return prev;
  }, 0);
}

function reset() {
  baseFormRef.value?.reset();
  state.result = 0;
}

const itemRefs = ref<InstanceType<typeof BaseButton>[]>([]);

function setItemsRef(el:any) {
  if (el) itemRefs.value.push(el);
}

function findAndReturnItemRefValueByID(id:string) {
  const resultInput = itemRefs.value?.filter((itemRef) => {
    const accessory = itemRef?.accessoryIconRef() as InstanceType<typeof BaseInput>;
    const input = accessory?.inputRef();
    return input.hasAttribute("id") && input.getAttribute("id") === id;
  })

  if (resultInput?.length === 0) return 0;

  const returnInput = resultInput[0];
  const accessory = returnInput?.accessoryIconRef() as InstanceType<typeof BaseInput>;
  const inputValue = parseFloat(accessory?.inputValue());
  return isNaN(inputValue) ? 0 : inputValue;
}

async function onCopy(value: any) {
  if (state.isCopying) return;
  clearTimeout(timeoutCopy.value);
  state.isCopying = true;

  await copyToClipboard(value?.toString());

  timeoutCopy.value = setTimeout(() => state.isCopying = false, 1000);
  nextTick(() => addToast({ label: `Copied to clipboard.` }));
}

</script>

<template>
  <h2 v-if="props?.showTitle && props?.view?.title?.length! > 0" class="title transform-z">{{ `${props?.view?.title}` }}</h2>
  <div v-if="props?.view?.content" v-html="props?.view?.content" class="mb-1 transform-z"></div>
  
  <form ref="baseFormRef">
  <BaseList class="gapx-8" :dataProvider="computedList">
    <template v-slot:listItemSlot="data">
      <BaseButton 
        v-if="!computedList?.[data.item.index]?.hidden 
        && computedList?.[data.item.index]?.type !== `operator`"
        :ref="setItemsRef"
        :type="`button`"
        :class="`width-100 pointer-none`" 
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
          onEnter: () => {
            calculate();
          }
        }"
      >
      </BaseButton>
    </template>
  </BaseList>
  </form>

  <transition name="nested" appear>
    <div class="calc-item width-100 flex align-center justify-between mxt-16 outer">
      <ActionButton outlined :label="`Start Over`" :icon="ResetIcon" iconClassName="mxr-6" @triggered="reset" />
      <ActionButton :label="`Calculate`" :accessoryIcon="ChevronRightIcon" @triggered="calculate" />
    </div>
  </transition >
  
  <transition name="nested" appear>
    <div class="result-item flex flex-column align-start mxt-30 outer">
      <div class="result-label mxb-6 inner">RESULT</div>
      <div class="result-box width-100 text-center px-7" @click="() => state.result > 0 && onCopy(state.result)">
        {{ state.result > 0 ? state.result : '---' }}
      </div>
    </div>
  </transition >
  
  
</template>

<style scoped lang="scss">
:deep(.list-item) {
  .input-label {
    font-weight: 700;
  } 
}
.result-label {
  font-weight: 700;
  font-size: 18px;
  user-select:all;
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