<p align="center">
  <img src="public/assets/elso_logo.png" align="center" width=80 />
</p>

## 📱 ELSO Bedside Mobile Application

The **ELSO Bedside Mobile Application** is a streamlined, easy-to-use digital handbook built for clinicians working with **Extracorporeal Life Support (ECLS)** systems. Designed specifically for bedside use, it provides quick access to essential clinical content, including:

- 🛠️ **Equipment reference guides**
- 💊 **Medication information**
- 🧪 **Real-life ECLS scenarios**
- ✅ **Checklists and protocols for device usage**
- 🔗 **Resource links for best practices and references**
- 🧮 **Clinical calculators for quick decision support**

This app is built using the **Ionic Framework**, **Capacitor**, and **AppFlow** for efficient cross-platform development and secure mobile distribution.

> ⚠️ **Note:** The app will be available on **iOS** and **Android** only.  
> ⚠️ **Developer Note:** Please use `pnpm` — **do not** use `npm` when installing or managing dependencies.

---

## ⚙️ Project & Deployment Notes

> ⚠️ **Notice:** AppFlow will be deprecated in **December 2027**.  
> 👉 **Alternative:** [CapAwesome Cloud](https://cloud.capawesome.io/#pricing)

### 📦 App IDs

- **Staging App ID:** `com.sweetrush.staging.elso`  
- **Production App ID:** `com.sweetrush.elso`

---

## 🐳 Docker

```bash
docker build -t elso-app .
docker run -it -p 8080:8080 --rm --name elso-app-production elso-app
# or run dev.sh script
```

---

## 🧪 Development Build

> ⚠️ **Note:** Please use `pnpm` — **do not** use `npm`.  
> `npm` is acceptable in general, but `pnpm` should be used for all Ionic Capacitor-related packages and commands.

### Start Local Dev Server

```bash
pnpm install
pnpm start
```

➡️ Open: [http://localhost:3005/](http://localhost:3005/)

### Production Build

```bash
pnpm run build
```

---

## 🧾 JSON Data Link Example

```html
<a href='#' data-link='CHECKLIST##ELSOBA_CHKLST_160' target='_self'>Membrane Lung Failure checklist</a>
```

---

## 🚀 Deployment & App Flow

🔗 [Ionic AppFlow Dashboard](https://ionic.io/appflow)

### 📱 Generate iOS Project

```bash
npx cap add ios
```

Add the following to the iOS `.plist`:

```xml
<key>ITSAppUsesNonExemptEncryption</key>
<false/>
<key>UISupportedInterfaceOrientations</key>
<array>
  <string>UIInterfaceOrientationPortrait</string>
</array>
```

### 🤖 Generate Android Project

```bash
npx cap add android
```

### 🔢 Generate New Build Number

The **Build Version Number** is used for iOS/Android minor updates.  
The **Project Version** should be updated for major changes.

```bash
pnpm run build_version
```

---

## 🚚 App Distribution (App Flow)

1. Select target: **iOS** or **Android**  
2. Set Build Type: **Development**  
3. Add necessary **environment variables**  
4. Press **Build** — if configured, AppFlow will deliver the build via **TestFlight** or **APK**

---

## 🖼️ Generate Icons

Reference: [Capacitor Icon Guide](https://capacitorjs.com/docs/guides/splash-screens-and-icons)

```bash
npm install @capacitor/assets --save-dev
npx capacitor-assets generate
```

---

## ✂️ Crop SVGs

- [https://svgcrop.com/](https://svgcrop.com/)

---

## 📤 Distribution Sites

- [https://www.diawi.com/](https://www.diawi.com/)

---

## 🍎 iOS Development

### 🔐 Renew Distribution/Dev Certificate

1. Open **Keychain Access** → `Certificate Assistant > Request a Certificate from a Certificate Authority`
2. Save the `.certSigningRequest` (CSR) file
3. Upload CSR to [Apple Developer Portal](https://developer.apple.com)
4. Download and install the `.cer` file
5. Update **Provisioning Profiles**
6. Update certificates in **AppFlow** under *Signing Certificates*
7. Rebuild and distribute the app

---

## 🤖 Android Development

### View Android Logs

```bash
{ANDROID_SDK_PATH}/adb.exe logcat
```

---

## 📚 References

- **Ionic App Flow Dashboard**  
  https://dashboard.ionicframework.com/org/4df82aa8-703e-4243-a310-fc777fe36d7f/apps

- **Figma Designs**  
  https://www.figma.com/files/865628658352013984/project/238209524?fuid=644590515443336826

- **Storyboard (Google Docs)**  
  https://docs.google.com/document/d/1llzINFw2NHGoEf25QA0KM-MRJGlXlmR854kZv7vt5cc/edit?tab=t.0

