<script lang="ts">
export default {
  inheritAttrs: true,
  name: "BranchReferralPanel"
}   
const DEBUG = false;
</script>

<script lang="ts" setup>
import { ComponentPublicInstance, computed, nextTick, onMounted, onUnmounted, reactive, ref, shallowRef, watch } from 'vue';
import { useRouter } from "vue-router";
import { storeToRefs } from 'pinia';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

import BaseButton from '@/ui/controls/BaseButton.vue';
import useBranchingStore from '@/store/branching.module';
import { capitalizeFirstLetter } from '@/utils/StringTools';
import PanicIcon from '@/assets/icons/panic-header-icon.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right-icon.svg';
import UpRightArrowIcon from '@/assets/icons/up-right-arrow-icon.svg';

// Component Props Setup
interface IBranchReferralViewProps {
  id?: string;
}

const props = withDefaults(defineProps<IBranchReferralViewProps>(), {});

// Component State Setup
interface IState {
  mode?: Mode;
  hasInit?: boolean;
  showLabel?: boolean;
  shakeIcon?: boolean;
  isMobileDevice?: boolean;
}

enum Mode {
  Hidden = "hidden",
  Docked = "docked",
  Opened = "opened",
  Removed = "removed"
} 

const state:IState = reactive({
  hasInit: false,
  mode: Mode.Hidden,
  showLabel: false,
  shakeIcon: false,
  isMobileDevice: import.meta.env.ISMOBILE
})

const emit = defineEmits<{
  (e: 'triggered', dataProps: any): void;
}>();

// Expose Definitions
defineExpose({
  element: () => element.value as HTMLElement,
  setMode: (mode: Mode) => state.mode = mode,
})

// Reference Setup
const element = ref<InstanceType<typeof HTMLElement>>();
const elementButton = ref<ComponentPublicInstance<typeof BaseButton>>()
const timeout = shallowRef<ReturnType<typeof setTimeout>>();
const transDelay = shallowRef<ReturnType<typeof setTimeout>>();

const router = useRouter();
const branchingStore = useBranchingStore();
const { refferedViews } = storeToRefs(branchingStore);
const { removeLastReferrallView } = branchingStore;

function triggered(dataProps: any) {
  if (!state.hasInit) return;
  
  clearTimers();

  emit('triggered', { ...dataProps, id: props?.id});
  
  if (state.mode === Mode.Opened) {

    Haptics.impact({ style: ImpactStyle.Heavy });

    state.mode = Mode.Removed;

    nextTick(() => {
      transDelay.value = setTimeout(() => {
        
        // get last view and clear from store
        const lastView = removeLastReferrallView();

        // replace route
        router.replace({ path: `${lastView?.fullPath}` });

      }, 375);
    })
    
    return;
  }
  
  transDelay.value = setTimeout(() => state.showLabel = true, 0);
  timeout.value = setTimeout(() => state.mode = Mode.Opened, 100);
}

function clearTimers() {
  clearTimeout(transDelay.value);
  clearTimeout(timeout.value);
}

function onTransitionEnd(e: TransitionEvent) {
  // return if not triggering the transform prop
  if (e?.propertyName !== "transform") return;
  if (DEBUG) console.log("BranchReferral.onTransitionEnd")
  if (DEBUG) console.log("  propertyName", e.propertyName)
    
  if (DEBUG) console.log(`  Transition [${state.mode}] Ended`);
  if (DEBUG) console.log("  Removing Event...");
  element?.value?.removeEventListener("transitionend", onTransitionEnd);

  switch (state.mode) {
    
    case Mode.Opened:
      if (!state.hasInit) {
        Haptics.notification({ type: NotificationType.Warning });

        transDelay.value = setTimeout(() => {
          if (DEBUG) console.log("  Docking...");
          if (DEBUG) console.log("  Starting Event...");
          element?.value?.addEventListener("transitionend", onTransitionEnd);
          state.mode = Mode.Docked;
          state.showLabel = false;
        }, 1875);
      }
      else {
        transDelay.value = setTimeout(() => {
          if (DEBUG) console.log("  Starting Event...");
          element?.value?.addEventListener("transitionend", onTransitionEnd);
        }, 350);
      }
    break;

    case Mode.Docked:
      if (DEBUG) console.log("  Docking ended");
      transDelay.value = setTimeout(() => {
        if (DEBUG) console.log("  Starting Event...");
        element?.value?.addEventListener("transitionend", onTransitionEnd);
      }, 350);

      if (!state.hasInit) { 
        state.shakeIcon = true;
        state.hasInit = true;
      }
    break;
    
    case Mode.Removed:
      if (DEBUG) console.log("  Remove ended");
      state.mode = Mode.Hidden;
    break;

    default:
      if (DEBUG) console.log(`  Transition Ended`);
  }  
}

const currentReferralView = computed(() => {
  if (!refferedViews?.value) return null;
  if (refferedViews.value.length! === 0) return null;

  return refferedViews?.value[refferedViews?.value.length - 1];
})

watch(refferedViews, () => {
  if (!refferedViews?.value) {
    state.mode = Mode.Hidden;
    return;
  }
  if (refferedViews.value.length! === 0) {
    state.mode = Mode.Hidden;
    return;
  };

  clearTimers();
  
  state.hasInit = false;
  element?.value?.removeEventListener("transitionend", onTransitionEnd);
  
  nextTick(() => {
    element?.value?.addEventListener("transitionend", onTransitionEnd);
    transDelay.value = setTimeout(() => {
      state.mode = Mode.Opened;
      state.showLabel = true;
    }, 1250);
  })
  
}, { flush: "post" })

onMounted(() => {
  if (DEBUG) console.log("BranchReferral.onMounted");
  if (!refferedViews?.value) return null;
  if (refferedViews.value.length! === 0) return null;

  clearTimers();

  timeout.value = setTimeout(() => {
    element?.value?.addEventListener("transitionend", onTransitionEnd);
  }, 1000);

  transDelay.value = setTimeout(() => {
    state.mode = Mode.Opened;
    state.showLabel = true;
  }, 1250);
})

onUnmounted(() => {
  if (DEBUG) console.log("BranchReferral.onUnmounted");
  clearTimers();
  element?.value?.removeEventListener("transitionend", onTransitionEnd);
})

</script>

<template>
  <div 
    class="abs-fs z-index-5" 
    :class="{ 
      ['disabled']: state.mode == Mode.Hidden || state.mode == Mode.Docked, 
      ['fixed']: state.isMobileDevice, 
    }"
  >
    <div class="backdrop tx-0 lx-0 width-100 height-100" :class="{ ['show']: state.mode === Mode.Opened && state.hasInit }" @click="() => {
      if (state.mode === Mode.Opened && state.hasInit) {
        clearTimers();
        state.mode = Mode.Docked;
        state.showLabel = false;
      }
    }"></div>
    <div 
      ref="element" 
      class="branch-referral absolute rx-0 pointer-all"
      :class="[{ 
        ['hidden']: state.mode === Mode.Hidden,
        ['docked']: state.mode === Mode.Docked,
        ['opened']: state.mode === Mode.Opened,
        ['removed']: state.mode === Mode.Removed,
      }]"
    >
      <BaseButton 
        ref="elementButton"
        class="referral-button" 
        innerClassName=""
        bodyClassName=""
        @click="() => Haptics.impact({ style: ImpactStyle.Heavy })"
        @triggered="triggered"
      >
        <div class="r-grad fixed tx-0 lx-0 width-100 height-100" :class="{ ['show']: state.mode === Mode.Docked }"></div>
        <div class="r-inner relative flex align-center justify-start px-10 pxtb-14" :class="{ ['show']: state.mode === Mode.Opened }">
          <div class="icon mxr-10 no-shrink" :class="{ ['shake']: state.shakeIcon }"><PanicIcon/></div>
          <div class="content relative width-100">
            
            <transition 
              name="fade" 
              mode="out-in"
              appear
            >
              <div v-if="state.showLabel" class="content-label text-left flex align-center justify-between">
                <div class="content-inner-label flex-grow">
                  <div class="title mxb-5">continue...</div>
                  <div v-if="currentReferralView !== null" class="subtitle">{{`${capitalizeFirstLetter(currentReferralView?.dataType!)}`}} | {{ `${currentReferralView?.title}` }}</div>
                </div>
                <div class="content-redirect-icon flex">
                  <UpRightArrowIcon />
                </div>
              </div>
              <div v-else class="content-icon flex absolute"><ChevronRightIcon /></div>   
            </transition>
          </div>
        </div>

      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
$panel-width: 260px;
$panel-height: 60px;
$half-icon: 24px;
$panel-offset-area: 20px;

.disabled {
  pointer-events: none;
}

.backdrop {
  transition: background-color 350ms ease-out;
  background-color: rgba(0, 0, 0, 0);
  pointer-events: none;

  &.show {
    pointer-events: all;
    background-color: rgba(0, 0, 0, 0.5);
  }
}

.branch-referral {
  bottom: calc(50% - $half-icon);
  right: calc(-0px - $panel-width);
  transition-duration: 0.35s;
  transition-timing-function: ease-out;

  :deep(.inner-base-button) {
    .ui-background { width: auto; }
  }

  .content {
    padding-right: $panel-offset-area;
  }

  .icon {
    transition: opacity 350ms ease-out;
  }

  &.docked {
    transform: translateX(-16px);

    .icon {
      opacity: 0;
      color: $secondary-red;
    }

    .content-icon {
      color: white;
    }
  }

  &.removed {
    transition: opacity 300ms ease-out, transform 350ms ease-out;

    opacity: 0;
    transform: translateX($panel-offset-area);
  }

  &.opened {
    transition-timing-function: cubic-bezier(0.55, 0, 0.1, 1);
    transform: translateX(calc(-0px - ($panel-width - $panel-offset-area)));

    .icon {
      color: $secondary-red;

      &.shake {
        animation: shake-animation 1.5s ease-in-out 1;
      }
    }

    
    
    // .r-inner {}
  }
  
  &.hidden {
    transform: translateX($panel-offset-area);
    opacity: 0;
  }
}

.referral-button {

  .r-grad {
    transition: opacity 250ms ease-out;
    background: $red-gradient;
    border-radius: 8px 0  0 8px;
    opacity: 0;

    &.show {
      opacity: 1;
    }
  }

  .r-inner {
    transition: background-color 250ms ease-out;
    height: $panel-height;
    background-color: transparent;
    border-radius: 8px 0  0 8px;
    width: calc($panel-width + $panel-offset-area);

    &.show {
      background-color: white;
    }
  }

  .content-icon {
    left: -48px;
    top: -9px;
  }

  .action-control {
    width: 100%;
    height: inherit;
    background-color: rgba(0, 0, 0, 0.5);

    &.enabled {
      pointer-events: all;
      cursor: pointer;
    }
  }

  .title {
    font-size: 14px;
    font-weight: 500;
    line-height: 1;
    opacity: 1;
  }
  
  .subtitle {
    font-size: 14px;
    font-weight: 600;
    line-height: 1;

    @include textClamp(2);
  }

  .icon {
    width: 34px;
    svg {
      width: 100%;
    }

    // &.shake {
    //   animation: shake-animation 1.5s ease-in-out 1;
    // }
  }

  @keyframes shake-animation {
    0%, 100% { transform: translate(0, 0); }
    10% { transform: translate(-2px, -1px); }
    20% { transform: translate(2px, -2px); }
    30% { transform: translate(-2px, 3px); }
    40% { transform: translate(3px, 3px); }
    50% { transform: translate(-3px, -2px); }
    60% { transform: translate(2px, 1px); }
    70% { transform: translate(-1px, -2px); }
    80% { transform: translate(1px, 2px); }
    90% { transform: translate(-1px, -1px); }
  }
}
</style>