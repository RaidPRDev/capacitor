# capacitor

Staging App ID
com.sweetrush.staging.elso

Production App ID
com.sweetrush.elso


# Docker
docker build -t elso-app .
docker run -it -p 8080:8080 --rm --name elso-app-production elso-app
or run dev.sh script


# json data link example
<a href='#' data-link='CHECKLIST##ELSOBA_CHKLST_160' target='_self'>Membrane Lung Failure checklist</a>


## Deploy Service
https://ionic.io/appflow

### 1. Generate new build number
The **Build Version Number** is used on iOS and Android services.  These are considered for minor updates. 
While the Project Version is used for mayor updates.
```npm run build_version```

### 2. Upload to Github/Gitlab

### 3. Use App Flow to launch iOS and Android builds.

### Development distribution flow 
a. Select the Target Device - iOS or Android
b. Set Build Type to Development
c. Set environment variables exposed to your build per platform.
d. Press Build. If setup right, App Flow will upload to the Apple Dev Account Store via Testflight.



