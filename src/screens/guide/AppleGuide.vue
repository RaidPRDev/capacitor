<script lang="ts">
export default {
  inheritAttrs: true,
  name: "AppleGuide"
}   
</script>

<script setup lang="ts">
import FullScreen from "@/ui/panels/FullScreen.vue";
import { useRoute } from "vue-router";

const route = useRoute();
console.log("route", route)

</script>

<template>
<FullScreen 
  className="guide" 
  innerClassName="inner-guide"
  :bodySlotProps="{ class: 'guide-body flex align-center justify-center px-20' }" 
>
  <template v-slot:bodySlot>
    <div class="relative width-inherit height-100 flex flex-column justify-start ptb-3">
      <div class="flex justify-center pxlr-10 width-100">

        <div class="container">
            <h1>Apple iOS Testing Guide</h1>
            <p>Follow these steps to install and test the app using Apple TestFlight:</p>

            <h2><span class="step-number">Note:</span></h2>
            <ul>
                <li>You will need an Apple ID Account to access the Apple Store and install apps. This can be any email address registered as an Apple ID.</li>
                <li>If you don't have an Apple ID Account, you can create one at <a href="https://account.apple.com/account" target="_blank">account.apple.com/account</a>.</li>
                <li>The Apple ID is the email address used when creating the account.</li>
                <li>If you already have an Apple ID, you can skip this step and go to Step 2.</li>
            </ul>

            <h2><span class="step-number">Step 1:</span> App Store Connect | Apple ID Registration</h2>
            <ul>
                <li><strong>Look for the Invite:</strong> You will receive an email from Apple to accept the invitation to the developer account.</li>
                <li><strong>Open Link:</strong> Click on the **Accept Invitation** in the email, this will take you to the Apple ID Registration page.</li>
                <li><strong>Register Email:</strong> Follow the Apple ID registration process to create your Apple ID account.</li>
            </ul>
            <div>
              <img :src="`/assets/guide/apple_email_invite.png`" />
            </div>

            <h2><span class="step-number">Step 2:</span> Check Your Email</h2>
            <ul>
                <li><strong>Look for the Invite:</strong> Once you have your Apple ID, you will receive an email from Apple with the subject line like "<em>[App Name] has invited you to test [App Name]</em>".</li>
                <li><strong>Open the Email:</strong> On your iOS device, open the email and tap the button or link that says <strong>"View in TestFlight"</strong>.</li>
            </ul>
            <div>
              <img :src="`/assets/guide/apple_testflight_email.png`" />
            </div>
            
            <h2><span class="step-number">Step 3:</span> Install the TestFlight App</h2>
            <ul>
                <li><strong>Download TestFlight:</strong> Open the App Store on your device, search for <strong>TestFlight</strong>, and install it if not already installed.</li>
                <li><strong>Sign In:</strong> After installation, open TestFlight and sign in using the <strong>Apple ID</strong> you provided to the developer.</li>
            </ul>
            <div>
              <img :src="`/assets/guide/apple_testflight_appstore.jpg`" />
            </div>

            <h2><span class="step-number">Step 4:</span> Install the App</h2>
            <ul>
                <li><strong>Find the App:</strong> The app will appear in TestFlight under the "Apps" section.</li>
                <li><strong>Install the App:</strong> Tap the app name, then tap the <strong>Install</strong> button to download the app.</li>
            </ul>
            <div>
              <img :src="`/assets/guide/apple_testflight_install.png`" />
            </div>

            <h2><span class="step-number">Step 5:</span> Start Testing</h2>
            <ul>
                <li><strong>Open the App:</strong> Once installed, the app will appear on your home screen. Open the app and start testing.</li>
            </ul>

            <h2><span class="step-number">Step 6:</span> Stay Updated</h2>
            <ul>
                <li><strong>Install Updates:</strong> If the developer releases new versions, open TestFlight and tap <strong>Update</strong> next to the app.</li>
            </ul>

            <h2>Troubleshooting</h2>
            <ul>
                <li><strong>Using the correct Apple ID?</strong> Ensure you’re signed into TestFlight with the same Apple ID provided to the developer.</li>
            </ul>
        </div>

      </div>

    </div>
  </template>
  
</FullScreen>
</template>

<style scoped lang="scss">


.guide {
  font-family: $secondary-font-family;

  :deep(.inner-guide) {
    h1, h2 {
      color: #0056b3;
    }
    h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    h2 {
      font-size: 20px;
      margin-top: 20px;
    }
    p {
      margin: 10px 0;
    }
    ul {
      margin: 10px 0 30px;
      padding-left: 20px;
    }
    ul li {
      margin: 5px 0;
    }
    img {
      max-width: 100%
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .step-number {
      font-weight: bold;
      color: #0056b3;
    }

    
  }
}
</style>