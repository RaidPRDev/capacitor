<script lang="ts">
export default {
  inheritAttrs: true,
  name: "AndroidGuide"
}   
</script>

<script setup lang="ts">
import FullScreen from "@/ui/panels/FullScreen.vue";

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
          <h1>Android Testing Guide</h1>
          <p>Follow these steps to install and test the app using Google Play's Internal Testing feature:</p>

          <h2><span class="step-number">Note:</span></h2>
          <ul>
              <li>You will need a Google Account to access the Google Play Store and install apps. This can be a Gmail account or any email address registered as a Google Account (e.g., a non-Gmail address linked to a Google account).</li>
              <li>If you don't have a Google Account, you can create one at <a href="https://accounts.google.com/signup" target="_blank">accounts.google.com/signup</a>.</li>
          </ul>

          <h2><span class="step-number">Step 1:</span> Receive the Test Link</h2>
          <ul>
              <li>The developer will send you a **Google Play Store** link to join the internal testing program for the app.</li>
              <li>Click the link to open it in your browser on your Android device.</li>
              <li>Once the page loads, click on **download it on Google Play**.</li>
              <li><a href="https://play.google.com/apps/internaltest/4700242484728913837" target="_blank">Google Play Store Link</a></li>
          </ul>
          <div>
            <img :src="`/assets/guide/android_1.png`" />
          </div>

          <h2><span class="step-number">Step 3:</span> Sign In with a Google Account</h2>
          <ul>
              <li>If prompted, sign in with your **Google Account**. You can use a Gmail address or any email address registered as a Google Account.</li>
          </ul>

          <h2><span class="step-number">Step 4:</span> Accept the Invitation</h2>
          <ul>
              <li>After signing in, click the **Accept** button on the testing program page.</li>
              <li>You will be redirected to the Google Play Store page for the app.</li>
          </ul>

          <h2><span class="step-number">Step 5:</span> Install the App</h2>
          <ul>
              <li>On the app's Google Play Store page, tap the **Install** button to download and install the app on your Android device.</li>
              <li>If you already have the app installed, the store will prompt you to update to the internal testing version.</li>
          </ul>
          <div>
            <img :src="`/assets/guide/android_2.png`" />
          </div>
          <div>
            <img :src="`/assets/guide/android_3.png`" />
          </div>

          <h2><span class="step-number">Step 5:</span> Start Testing</h2>
          <ul>
              <li>Open the app from your home screen or app drawer and start using it.</li>
          </ul>

          <h2><span class="step-number">Step 6:</span> Install Updates</h2>
          <ul>
              <li>If the developer releases a new version, you will see an **Update** button on the app's Play Store page.</li>
              <li>Tap **Update** to download and install the latest version.</li>
          </ul>

          <h2>Troubleshooting</h2>
          <ul>
              <li><strong>Can't access the app?</strong> Ensure you're signed in with the same Google Account provided to the developer.</li>
              <li><strong>Link not working?</strong> Confirm with the developer that the test link is active and that you’ve been added as a tester.</li>
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