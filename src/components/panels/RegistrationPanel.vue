<script lang="ts">
export default {
  inheritAttrs: false,
  name: "RegistrationPanel"
}   
</script>

<script setup lang="ts">
import { computed, inject, reactive, ref } from 'vue';
import classnames from "classnames";
import BasePanel from "@/ui/panels/BasePanel.vue";
import BaseButton from "@/ui/controls/BaseButton.vue";
import BaseHeader from "@/ui/panels/BaseHeader.vue";
import BaseList from '@/ui/controls/BaseList.vue';
import BaseInput from '@/ui/controls/BaseInput.vue';
import BaseComboBox from '@/ui/controls/BaseComboBox.vue';

import { APP_ID } from '@/_core/Constants';
import { IApp } from '@/types';
import useSession, { ISessionUser } from '@/store/session.module';
import { capitalizeFirstLetter } from '@/utils/StringTools';
import { timeout, urlFetch } from '@/utils/FetchTools';
import { isObjectEmpty } from '@/utils/ObjectTools';
import PulseRateLoader from '../pulserateloader/PulseRateLoader.vue';

import Logo from '/assets/elso_logo.png';
import CloseIcon from '@/assets/icons/close-icon.svg';
import ChevronRightIcon from '@/assets/icons/chevron-right-icon.svg';

import countries from '@/assets/data/countries';
import { IBaseComboxBoxProps, IBaseInputProps } from '@/ui/types';

const session = useSession();
const { setUser } = session;

const app = inject<IApp>(APP_ID) as IApp;
const itemRefs = ref<any[]>([]);
const baseFormRef = ref<InstanceType<typeof HTMLFormElement>>();

function setItemsRef(el:any) {
  itemRefs.value.push(el as InstanceType<typeof BaseButton>);
}

// Component State Setup
interface IState extends ISessionUser {
  isSaving?: boolean;
  hasSaved?: boolean;
}

const DEBUG = false;

const state:IState = reactive<IState>({
  firstName: DEBUG ? "Rafael" : "",
  lastName: DEBUG ? "Emmanuelli" : "",
  email: DEBUG ? "rafael.emmanuelli@sweetrush.com" : "",
  cellPhone: DEBUG ? "787-555-5555" : "",
  country: DEBUG ? "PR" : "",
  title: DEBUG ? "Software Engineer" : "",
  credentials: DEBUG ? "None" : "",
  hospitalSystem: DEBUG ? "SweetRush" : "",
  isSaving: false,
  hasSaved: false,
})

type FieldType = "firstName" | "lastName" | "email" | "cellPhone" | "country" | "title" | "credentials" | "hospitalSystem";
type FieldComponentType = "dropdown" | "input";
interface IFields {
  id: FieldType;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  data?: { 
    type: FieldComponentType, 
    props?: Partial<IBaseInputProps> | Partial<IBaseComboxBoxProps>, 
    style?: Record<string, any>, 
    items?: Array<string> 
  };
}

const countryOptions = countries?.map(({ name }) => name);

const fields: Array<IFields> = [
  { id: "firstName", label: "First Name", type: "text", placeholder: "Enter your first name", required: true, data: { type: "input" } },
  { id: "lastName", label: "Last Name", type: "text", placeholder: "Enter your last name", required: true, data: { type: "input" } },
  { id: "email", label: "Email", type: "email", placeholder: "Enter your email", required: true, data: { type: "input" } },
  { id: "cellPhone", label: "Cell Phone", type: "text", placeholder: "Enter your phone", data: { type: "input" } },
  { 
    id: "country", 
    label: "Country of Work", 
    type: "text", 
    placeholder: "Enter your country of work", 
    data: { 
      type: "dropdown", 
      props: {
        selectedIndex: 237, // default: United States
        isAutoSelect: true, 
      },
      style: { 
        height: 400 
      },
      items: countryOptions, 
    }
  },
  { id: "title", label: "Role/Title", type: "text", placeholder: "Enter your role / title", data: { type: "input" } },
  { 
    id: "credentials", 
    label: "Credentials ( Select all that apply )", 
    type: "text", 
    placeholder: "Enter your credentials", 
    data: { 
      type: "dropdown",
      props: {
        isAutoSelect: false,
        isMultiple: true,
        placeholder: "Tap to Select"
      },
      items: ['OPTION 1', 'OPTION 2', 'OPTION 3', 'OPTION 4', 'OPTION 5', 'OPTION 6'], 
    } 
  },
  { id: "hospitalSystem", label: "Hospital or Health System, if appropriate", type: "text", placeholder: "Enter your hospital", data: { type: "input" } },
];

const computedList = computed(() => {
  return fields?.map((item) => {
    return item;
  })
})

async function formSubmit() {
  const inputFirstName = itemRefs.value[0].buttonRef().querySelector("input") as HTMLInputElement;
  const inputLastName = itemRefs.value[1].buttonRef().querySelector("input") as HTMLInputElement;
  const inputEmail = itemRefs.value[2].buttonRef().querySelector("input") as HTMLInputElement;
  const inputPhone = itemRefs.value[3].buttonRef().querySelector("input") as HTMLInputElement;
  const inputCountry = itemRefs.value[4].comboInputRef() as HTMLInputElement;
  const inputRole = itemRefs.value[5].buttonRef().querySelector("input") as HTMLInputElement;
  const inputCreds = itemRefs.value[6].comboInputRef() as HTMLInputElement;
  const inputHospital = itemRefs.value[7].buttonRef().querySelector("input") as HTMLInputElement;
  
  const formBody = {
    firstName: inputFirstName.value,
    lastName: inputLastName.value,
    email: inputEmail.value,
    cellPhone: inputPhone.value,
    country: inputCountry.value,
    title: inputRole.value,
    credentials: inputCreds.value,
    hospitalSystem: inputHospital.value,
  }
  console.table(formBody);

  // return;

  state.isSaving = true;

  const _urlTk = `${import.meta.env.API_TOKEN}`;
  const _reqInitTk:RequestInit = {
    headers: new Headers({ 
      "Content-Type": `text/plain`, 
      "clientId": `${import.meta.env.API_CLIENT_ID}`,
    }),
    method: "GET",
    mode: "cors",
    credentials: "include"
  }

  const _fetchTk = await urlFetch(_urlTk, _reqInitTk as RequestInit) as {
    data?: any & {
      
    }, error?: string
  };
  console.log("FETCH TOKEN", _fetchTk);

  if (typeof _fetchTk === "object" 
    && _fetchTk?.error 
    && !isObjectEmpty(_fetchTk?.error)) {
    
      console.error("FAILED FETCH TOKEN", _fetchTk);
      alert(`FAILED FETCH TOKEN ${JSON.stringify(_fetchTk)}`);
      state.isSaving = false;
      state.hasSaved = true;
      session.$patch({ hasRegistered: true });
      return;
  }

  const TOKEN = _fetchTk;
  alert(`FETCH TOKEN ${JSON.stringify(TOKEN)}`);
  await timeout(5000);

  const _url = `${import.meta.env.API_REGISTER}`;
  const _reqInit:RequestInit = {
    headers: new Headers({ 
      "Content-Type": `application/json`, 
      "Authorization": `Bearer ${TOKEN}`,
      "clientId": `${import.meta.env.API_CLIENT_ID}`
    }),
    method: "POST",
    body: JSON.stringify(formBody),
    mode: "cors",
    credentials: "include"
  }

  const _fetch = await urlFetch(_url, _reqInit as RequestInit) as {
    data?: any & {
      
    }, error?: string
  };
  console.log("FETCH REGISTER", _fetch);

  if (typeof _fetch === "object" 
    && _fetch?.error 
    && !isObjectEmpty(_fetch?.error)) {
    
      console.error("FETCH", _fetch);
      state.isSaving = false;
      state.hasSaved = true;
      session.$patch({ hasRegistered: true });
      alert(`FAILED REGISTER ${JSON.stringify(_fetch)}`);
      return;
  }

  alert(`SUCCESS REGISTER ${JSON.stringify(_fetch)}`);

  setUser(formBody);
  
  await timeout(500);

  state.isSaving = false;
  state.hasSaved = true;

  session.$patch({ hasRegistered: true });
}

function closePanel() {
  app.drawers.bottom.open = !app.drawers.bottom.open;
  app.drawers.bottom.props = {};
}

</script>

<template>
<BasePanel class="disclaimer-panel" :class="classnames(`relative`)">
  <template v-slot:headerSlot>
    <BaseHeader ref="headerRef" class="center-container" :innerClassName="`pxlr-30 pxt-18`">
      <template v-slot:headerLeft>
        <div class="flex justify-center mxb-40"><img :src="Logo" width="120" height="89" /></div>
      </template>
    </BaseHeader>
  </template>

  <div class="side-content pxlr-0 pxt-20 pxb-0 relative">
    <div class="pxlr-0 height-100">
      <BaseHeader class="screen-heading pxlr-20 mxb-20 height-auto">
        <template v-slot:headerLeft>
          <h1 class="screen-title">{{`Register`}}</h1>
        </template>
        <template v-slot:headerRight>
          <span class="flex"></span>
        </template>
      </BaseHeader>
      
      <div class="content-scroller relative pxl-20 pxr-6">
        <div class="inner-scroller pxb-80">
          
          <div class="pxr-20" v-if="!state.hasSaved">
          
            <div class="mxb-20">Please complete your registration by filling out all required fields below. Required fields are marked with an asterisk (*). This information helps us understand our users and improve the application.</div>
            <form id="rform" ref="baseFormRef" @submit.prevent="formSubmit">
              <BaseList class="items-list gapx-8" :dataProvider="computedList">
                <template v-slot:listItemSlot="data">
                  <BaseButton 
                    v-if="data.item.data.type === `input`" 
                    :key="`${computedList?.[data.item.index].id}`"
                    :ref="setItemsRef"
                    :type="`button`"
                    :class="`input-button width-100 pointer-none`" 
                    :innerClassName="`px-0 flex-column align-start`"
                    :bodyClassName="`text-left`"
                  >
                    <template v-slot:accessorySlot>
                      <BaseInput 
                        :id="computedList?.[data.item.index].id"
                        :modelValue="state[fields[data.item.index].id]" 
                        :name="computedList?.[data.item.index].id"
                        :type="computedList?.[data.item.index].type"
                        :placeholder="`${computedList?.[data.item.index].placeholder}`"
                        :required="computedList?.[data.item.index].required"
                        :label="`${capitalizeFirstLetter(data.item.label!)}`"
                        :labelClass="`input-label mxb-6 flex`"
                        elementClass="base-control px-12"
                        containerClass="variant-calc pointer-all width-inherit mxb-20"
                      />
                    </template>
                  </BaseButton>
                  <BaseComboBox v-else
                    :ref="setItemsRef"
                    class="mxb-20"
                    :options="data.item.data.items"
                    :id="computedList?.[data.item.index]?.id"
                    :label="data.item.label"
                    :icon="ChevronRightIcon"
                    :height="data.item.data?.style?.height"
                    v-bind="data.item.data.props"
                    
                  />
                </template>
                
              </BaseList>
            </form>

          </div>
          <div v-else>
            <div>Thank you for registering!</div>
            <div class="mxt-20">Tap the <b>Continue</b> button to close.</div>
          </div>

        </div>

        <div class="scroll-fade absolute lx-0 bx-8 pointer-none"></div>
      </div>

      <div class="confirm-panel absolute lx-0 bx-0 flex align-center justify-center width-100 pxlr-60 gapx-20">

        <BaseButton 
          v-if="!state.hasSaved"
          class="variant-red" 
          :elementClassName="classnames(`width-100 mxtb-10`, {})"
          :innerClassName="`px-13 justify-center`" 
          :label="`Submit`"
          :type="`submit`"
          form="rform"
          @triggered="() => {
            // baseFormRef?.submit();
          }"
        />
        
        <BaseButton 
          v-else
          class="variant-red" 
          :elementClassName="classnames(`width-100 mxtb-10`, {})"
          :innerClassName="`px-13 justify-center`" 
          :label="`Continue`"
          :type="`button`"
          form="rform"
          @triggered="() => {
            closePanel();
          }"
        />
        
      </div>

      <transition :name="'fade'">
        <div v-if="state.isSaving" class="save-modal absolute tx-0 lx-0 width-100 height-100 flex-center">
          <div class="modal-content">
            <div class="save-icon"><PulseRateLoader /></div>
            <div class="save-label">Saving</div>
          </div>
        </div>
      </transition>
      
    </div>
  </div>

  <BaseButton :class="[`close-button absolute tx-20 rx-20`, { ['disabled']: state.isSaving }]" :innerClassName="`flex-column`" :icon="CloseIcon" @triggered="() => {
    if (state.isSaving) return;
    closePanel();
  }" />
  
</BasePanel>
</template>


<style scoped lang="scss">
.base-panel {
  $header-height: 112px;
  $header-padding: 20px;
  $header-title: 24px;
  $header-title-padding: 30px;
  $footer-height: 90px;
  $scroller-bottom: 20px;
  $scroll-height: $header-height + $header-padding + $header-title + $header-title-padding + $footer-height;

  &.accepted {
    .content-scroller {
      height: calc(100% - ($header-title + 10px));
      font-size: 16px;

      .inner-scroller {
        @include use-scroller-styles();

        overflow: hidden auto;
        height: calc(100% - ($scroller-bottom));
      }
    }
    .confirm-panel {
      display: none;
    }
  }

  .close-button {
    &.disabled {
      opacity: 0.25;
    }
  }

  .side-content {
    height: calc(100% - ($header-height));
  }

  .title {
    font-family: $secondary-font-family;
    font-size: 24px;
    font-weight: 500;
  }

  .content-scroller {
    height: calc(100% - ($header-title + 10px + $footer-height));
    font-size: 16px;

    .inner-scroller {
      @include use-scroller-styles();

      overflow: hidden auto;
      height: calc(100% - ($scroller-bottom));
    }

    .p-title {
      color: $sixth-color;
      font-weight: 500;
      font-size: 20px;
    }

    .scroll-fade {
      width: 100%;
      height: 100px;
      background: linear-gradient(180deg, #FFFFFF00 0%, #FFF 100%);
      // box-shadow: 0px 10px 20px 2px #0B247A26;
    }
  }

  .confirm-panel {
    height: 90px;
    border-top-left-radius: 16px;
    border-top-right-radius: 16px;
    background-color: white;
  }

  .base-control.base-button {
    :deep(.inner-base-button) {
      .ui-accessory-icon { width: 100%; }
    }
  }

  .base-combobox {
    :deep(.ui-combo-label) {
      font-weight: 400;
    }
  }

  
  :deep(.inner-panel) {
    // background-color: rgba(white, .95);
    background-color: white;

    .base-header {
      img {
        width: 72px;
        height: 54px;
      }
    }

    .variant-red {
      box-shadow: 0px 0px 12px 0px #0B247A26;

      &.cancel {
        opacity: 1;
        .inner-base-button {
          background: $fourth-color;
        }
      }
    }
  }

  .base-input {
    :deep(.ui-input-label) {
      .ui-label {
        text-align: left;

        span {
          color: $teniary-color;
        }
      }
    }
  }

  .save-modal {
    background-color: rgba(white, 90%);

    .modal-content {
      display: block;
      transform: translateY(-50%);
    }

    .save-icon {
      color: white;
      .loader {
        display: flex;
        transform: translateX(-26px) scale(0.75);
      }
    }

    .save-label {
      font-size: 20px;
      color: $primary-color;
      transform: translateX(31px);
    }
  }

  // Does not work in chrome
  // html:not(.desktop) & {
  //   :deep(.inner-panel) {
  //     background-color: rgba(white, .85);
  //     backdrop-filter: blur(10px);
  //   }
  // }
}

</style>

<style lang="scss">
.base-panel.disclaimer-panel {
  .side-content {
    height: calc(100% - (112px));
  }
  :deep(.content-scroller) {
    height: calc(100%);
  }

  html.ios & {
    // iOS Top Padding 40px
    .side-content { 
      height: calc(100% - (112px + 40px));
    }
  }
}
</style>
