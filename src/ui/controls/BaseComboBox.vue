<script lang="ts" setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, ComputedRef, nextTick } from 'vue';
import type { IBaseComboxBoxProps } from '@/ui/types';

// Component Props Setup
const props = withDefaults(defineProps<IBaseComboxBoxProps>(), {
  disabled: false,
  disableSearch: true,
  required: false,
  isAutoSelect: true,
  selectedIndex: 0,
  height: 300,
  placeholder: `Tap to Select`
});

// Emission Event Setup
const emit = defineEmits<{
  (e: 'select', option: string): void;
}>();

// Reference Setup
const inputElement = ref<InstanceType<typeof HTMLInputElement>>();
const dropdownOptions = ref<HTMLElement[]>([]); // Array of option elements

// Reactive state
const selectedItemIndex = ref<number>(props?.isAutoSelect ? props?.selectedIndex : -1);
const selectedItemIndices = ref<number[]>([]);
const searchQuery = ref<string>('');
const showDropdown = ref<boolean>(false);
const displayText = ref<string>('');
const focusedOptionIndex = ref<number>(-1); // Track focused option index for keyboard navigation

// Expose Definitions
defineExpose({
  comboInputRef: () => inputElement.value,
}); 

// Computed property for options, applying search filter if enabled
const computedOptions: ComputedRef<string[]> = computed(() => {
  return props.disableSearch
    ? props.options
    : props.options.filter(option =>
        option.toLowerCase().includes(searchQuery.value.toLowerCase())
      )
});

// Open or close dropdown based on its current state
const toggleDropdown = (): void => {
  if (!props.disabled) {
    showDropdown.value = !showDropdown.value;
    focusedOptionIndex.value = -1; // Reset focused option index
  }
};

// Method to open dropdown
const openDropdown = (): void => {
  if (!props.disabled) {
    showDropdown.value = true;

    nextTick(() => {
      
      let option:HTMLElement | null = null;

      if (props?.isMultiple) {
        if (selectedItemIndices.value.length >= 1) {
          option = dropdownOptions.value[selectedItemIndices.value[0]];
        }
      }
      else {
        option = dropdownOptions.value[selectedItemIndex.value];
      }

      if (option) {
        option.scrollIntoView({ block: 'center', inline: 'nearest' });
      }

    });    
  }
};

// Method to close dropdown
const closeDropdown = (): void => {
  showDropdown.value = false;
  focusedOptionIndex.value = -1;
};

// Method to select an option
const selectOption = (option: string, index: number): void => {
  // if (isSelected && !props.isMultiple) return;

  if (props?.isMultiple) {
    const getArrayIndex = selectedItemIndices.value.findIndex((item) => item === index);
    const getSelectedIndices = selectedItemIndices.value;

    if (selectedItemIndices.value.includes(index)) {
      // toggle off
      getSelectedIndices.splice(getArrayIndex, 1);
      selectedItemIndices.value = getSelectedIndices;
    }
    else {
      selectedItemIndices.value.push(index);
    }

    const multipleLabels = getSelectedIndices.map((itemIndex) => props?.options[itemIndex]).map((option) => {
      return option;
    });

    displayText.value = `${multipleLabels.join(", ")}`;
    // displayText.value = `${getSelectedIndices.length} item(s)`;
  }
  else {
    showDropdown.value = false;
    searchQuery.value = option;
    displayText.value = option;  

    const getSelectedIndexFromData = props.options.findIndex(__option =>
    __option.toLowerCase().includes(option.toLowerCase())
    );
    selectedItemIndex.value = getSelectedIndexFromData;
  }
  
  emit('select', option); // Emit selected option to parent component
};

// Handle Enter key selection when navigating with the keyboard
const handleEnter = (): void => {
  if (showDropdown.value && focusedOptionIndex.value >= 0) {
    selectOption(computedOptions.value[focusedOptionIndex.value], focusedOptionIndex.value);
  } else {
    toggleDropdown();
  }
};

// Keyboard navigation: Focus next option and scroll into view
const focusNextOption = (): void => {
  if (showDropdown.value) {
    focusedOptionIndex.value =
      (focusedOptionIndex.value + 1) % computedOptions.value.length;
    scrollToFocusedOption();
  } else {
    openDropdown();
  }
};

// Keyboard navigation: Focus previous option and scroll into view
const focusPreviousOption = (): void => {
  if (showDropdown.value) {
    focusedOptionIndex.value =
      (focusedOptionIndex.value - 1 + computedOptions.value.length) %
      computedOptions.value.length;
    scrollToFocusedOption();
  } else {
    openDropdown();
  }
};

// Scroll to the currently focused option to ensure it's visible
const scrollToFocusedOption = (): void => {
  const option = dropdownOptions.value[focusedOptionIndex.value];
  
  if (option) {
    option.scrollIntoView({ block: 'center', inline: 'nearest' });
  }
};

// Watch searchQuery to control dropdown visibility
watch(searchQuery, (newQuery) => {
  if (!props.disableSearch && !props.disabled) {
    showDropdown.value = !!newQuery;
  }
});

// Update displayText based on searchQuery (only if search is enabled)
watch(searchQuery, (newQuery) => {
  if (!props.disableSearch) {
    displayText.value = newQuery;
  }
});

// Event listener to close dropdown on escape key press
const handleEscape = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    closeDropdown();
  }
};

// Attach event listeners on mount
onMounted(() => {
  window.addEventListener('keydown', handleEscape);

  // Automatically select the first item if isAutoSelect is true
  if (props?.isAutoSelect && props.options.length > 0 && !props?.isMultiple) {
    displayText.value = props.options[selectedItemIndex.value];
    selectOption(props.options[selectedItemIndex.value], selectedItemIndex.value);
    // emit('select', props.options[0]); // Automatically select the first option
  }
});

// Detach event listeners before unmount
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape);
});

const listItemClasses = (index: number) => computed(() => {
  let classes: Array<string> = [];
  if (props?.isMultiple) {
    const isSelected = selectedItemIndices.value.includes(index);
    if (isSelected) classes.push('dropdown-option-toggled');
  }
  else {
    if (index === selectedItemIndex.value) classes.push('dropdown-option-toggled');
  }

  if (index === focusedOptionIndex.value) classes.push('dropdown-option-focused');
  return classes
})

</script>

<template>
  <div :class="[`base-combobox`, { [`is-multiple`]: isMultiple }]">
    
    <div v-if="props.label" :class="['ui-combo-label mxt-0 mxb-12', props?.labelClass]">
      <label v-bind:for="props.id" class="ui-label">
        {{props.label}}
        <span v-if="props.required">*</span>
      </label>
    </div>
    
    <div class="ui-combo-input-field flex align-center relative">
      <input
        ref="inputElement"
        class="ui-combo-input"
        type="text"
        v-model="displayText"
        :id="props?.id"
        :disabled="disabled"
        :readonly="disableSearch"
        @click="openDropdown"
        @keydown.enter.prevent="handleEnter"
        @keydown.space.prevent="toggleDropdown"
        @keydown.down.prevent="focusNextOption"
        @keydown.up.prevent="focusPreviousOption"
        :placeholder="placeholder"
      />
      <div class="ui-combo-input-icon">
        <div v-if="!icon" class="icon-default">></div>
        <div v-else="icon" class="icon-element">
          <component ref="iconElement" v-if="typeof(icon) === 'object'" :is="icon" xmlns="yes"></component>
          <img ref="iconElement" v-else-if="typeof(icon) === 'string'" v-bind:src="icon" /> 
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showDropdown" class="ui-combo-modal" @click="closeDropdown">
        <ul :class="[`ui-combo-panel`]" :style="{ maxHeight: `${height}px` }" role="listbox" aria-labelledby="combo-box" @click.stop>
          <li
            v-for="(option, index) in computedOptions"
            :key="index"
            :id="`option-${index}`"
            :class="listItemClasses(index).value"
            @click="selectOption(option, index)"
            @mouseenter="focusedOptionIndex = index"
            role="option"
            :aria-selected="index === focusedOptionIndex"
            tabindex="-1"
            ref="dropdownOptions"
          >
            {{ option }}
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>

<style scoped lang="scss">
.base-combobox {
  position: relative;
}

.ui-combo-label {
  font-size: inherit;
}

.ui-combo-input-field {
  background: transparent;
  padding: 10px 12px;
}

.ui-combo-input {
  background: transparent;
  padding: 0;
  width: 100%;
  text-overflow: ellipsis;
}

.ui-combo-input-icon {
  pointer-events: none;
  position: absolute;
  right: 20px;

  .icon-default {
    transform: rotate(90deg);
    color: gray;
  }
}

.ui-combo-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
}

.ui-combo-panel {
  border: 1px solid transparent;
  overflow-y: auto;
  background: white;
  list-style: none;
  padding: 0;
  margin: 0;
  width: 300px;
  max-height: 200px;
}

.ui-combo-panel li {
  padding: 8px;
  cursor: pointer;
}

.ui-combo-panel li:hover:not(.dropdown-option-selected):not(.dropdown-option-toggled) {
  background-color: #ddd;
}

.ui-combo-panel .dropdown-option-focused {
  background-color: #ddd;
}

.ui-combo-panel .dropdown-option-selected {
  background-color: rgb(236, 236, 236);
  color: grey;
  cursor: not-allowed;
}

.ui-combo-panel .dropdown-option-toggled {
  background-color: $primary-color;
  color: white;
  cursor: pointer;
}
</style>
