<script lang="ts">
export default {
  inheritAttrs: true,
  name: "Unauthorized"
}   
</script>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import FullScreen from "@/ui/panels/FullScreen.vue";
import Input from '@/components/passkeyinput/PasskeyInput.vue';
import ButtonGroup from "@/ui/controls/ButtonGroup.vue";
import ActionButton from '@/components/actionbutton/ActionButton.vue';
import usePassKey from "@/store/passkey.module";
// import useSession from "@/store/session.module";

import Logo from '/assets/elso_logo.png';

const router = useRouter();
// const session = useSession();
const { authorize, isAuthorized } = usePassKey();

if (isAuthorized) router.replace("home");

const state = reactive({
  passkey: '',
  message: ' ',
});

function onSubmit() {
  const user = {
    passkey: state.passkey,
  };

  authorize(user).then((result) => {
    if (result) {
      router.push('/');
    } else {
      state.message = 'The key you entered is incorrect.';
    }
  });
}

const menuGroupItems = [
  { label: "Submit" },
];

</script>

<template>
<FullScreen 
  className="unauth" 
  innerClassName="inner-unauth"
  :bodySlotProps="{ class: 'unauth-body flex align-center justify-center px-20' }" 
>
  <template v-slot:bodySlot>
    <form action="" class="form" @submit.prevent @submit="onSubmit">
      <div class="relative width-inherit height-100 flex flex-column justify-between ptb-3">
        <div class="flex justify-center"><img :src="Logo" width="120" height="89" /></div>
        <div class="flex justify-center mxtb-60">
          <div>
            <div><Input 
              id="passKey" 
              name="passKey" 
              :label="`Enter your key:`"  
              :type="`password`"
              v-model:inputValue="state.passkey"
              />
            </div>
            <div>
              <ButtonGroup 
                class="mt-2"
                innerClassName="flex flex-column gapx-30"
                :buttonComponent="ActionButton"
                :defaultButtonProps="{ 
                  elementClassName: `width-100`, 
                  innerClassName: `pxlr-30 pxtb-18`,
                  usePressedState: true,
                }"
                :dataProvider="menuGroupItems" @triggered="onSubmit"
              ></ButtonGroup>
            </div>
            <div class="flex justify-center mxtb-20">
              <span class="message">{{ state.message }}</span>
            </div>
          </div>
        </div>
        
        
      </div>
    </form>
    
  </template>
  
</FullScreen>
</template>

<style scoped lang="scss">
.unauth {
  font-family: $secondary-font-family;

  :deep(.inner-unauth) {
    background: linear-gradient(-104deg, $secondary-blue 10%, $primary-color 100%);

    .base-input {
      .ui-input-label {
        color: white;
        font-weight: 400;
      }
      .ui-input-element {
        font-size: 30px;
      }
    }
    
    .button-group {
      .action-button {
        
        .inner-base-button {
          background: #DB0330;
        }
        
        .ui-background {
          background: $red-gradient;
        }

        .ui-label {
          font-size: 21px;
          font-weight: 700;
          line-height: 21.6px;
        }
      }
    }

    .message {
      color: white;
      font-weight: 200;
    }
  }
}
</style>