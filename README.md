# capacitor

Staging App ID
com.sweetrush.staging.elso

Production App ID
com.sweetrush.elso

# Docker
docker build -t elso-app .
docker run -it -p 8080:8080 --rm --name elso-app-production elso-app
or run dev.sh script

# Dev Build
npm run start
http://localhost:3005/


# json data link example
<a href='#' data-link='CHECKLIST##ELSOBA_CHKLST_160' target='_self'>Membrane Lung Failure checklist</a>

## Deploy Service
https://ionic.io/appflow

### Generate new iOS XCode Project
npx cap add ios

Note: Ensure the following key is added to the app plist file
<key>ITSAppUsesNonExemptEncryption</key>
<false/>

Also, make sure the app does not support device orientation, only portrait
<key>UISupportedInterfaceOrientations</key>
<array>
  <string>UIInterfaceOrientationPortrait</string>
</array>

### Generate new Android XCode Project
npx cap add ios

### Generate new build number
The **Build Version Number** is used on iOS and Android services.  These are considered for minor updates. 
While the Project Version is used for mayor updates.
```npm run build_version```

### Upload to Github/Gitlab

### Use App Flow to launch iOS and Android builds.

### Development distribution flow 
a. Select the Target Device - iOS or Android
b. Set Build Type to Development
c. Set environment variables exposed to your build per platform.
d. Press Build. If setup right, App Flow will upload to the Apple Dev Account Store via Testflight.


# Generate Icons
Ref: https://capacitorjs.com/docs/guides/splash-screens-and-icons
npm install @capacitor/assets --save-dev
npx capacitor-assets generate

# Crop SVGs
https://svgcrop.com/

# Distribution Sites
https://www.diawi.com/

# iOS Development

To renew an iOS distribution or development certificate, you need to generate a new Certificate Signing Request (CSR) in Keychain Access on your Mac, then upload it to your Apple Developer account to obtain a new certificate. Finally, you'll need to update your provisioning profiles and potentially your Xcode project settings to use the new certificate. 

1. Generate a New Certificate Signing Request (CSR) in Keychain Access
  - Open Keychain Access on your Mac (Applications > Utilities > Keychain Access). 
  - Go to Keychain Access > Certificate Assistant > Request a Certificate from a Certificate Authority... 
  - Enter your information (email address, common name, etc.) and choose "Save to disk". 
  - Save the CSR file (a .certSigningRequest file) to your computer. 

2. Renew the Certificate in the Apple Developer Portal
  - Go to the Apple Developer website (developer.apple.com) and log in with your Apple ID.
  - Navigate to Certificates, Identifiers & Profiles.
  - Select Certificates.
  - Click the "+" button to add a new certificate.
  - Choose the appropriate certificate type (e.g., iOS Distribution, iOS Development).
  - Upload the CSR file you created earlier.
  - Download the newly generated certificate (a .cer file). 

3. Install the New Certificate
  - Double-click the downloaded .cer file to install it in Keychain Access. 

4. Update Provisioning Profiles
  - In your Apple Developer account, navigate to Provisioning Profiles.
  - Edit the relevant provisioning profiles (development or distribution) associated with the expired certificate.
  - Select the newly installed certificate.
  - Download the updated provisioning profiles. 

5. Update AppFlow
  - Go to Signing Certificates 
  - Update both Development and Distribution

6. Distribute/Update Your App


# Android Development

### Run Android device/emulator log
Locate the ADB tool from the Android SDK - platform-tools folder
Run the following
{ANDROID_SDK_PATH}/adb.exe logcat

# References
Ionic App Flow
https://dashboard.ionicframework.com/org/4df82aa8-703e-4243-a310-fc777fe36d7f/apps

Figma Designs
https://www.figma.com/files/865628658352013984/project/238209524?fuid=644590515443336826

Storyboard
https://docs.google.com/document/d/1llzINFw2NHGoEf25QA0KM-MRJGlXlmR854kZv7vt5cc/edit?tab=t.0


