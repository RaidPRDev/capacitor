# Building and running iOS on the network Mac, from Windows

These scripts drive the Mac at **10.0.0.189** (`rafael`) over ssh so you can build,
run, screenshot and debug the iOS app without leaving Windows. Nothing is installed
on the Mac beyond what is already there — the project is copied into
`~/dev/elso-capacitor` and built in place.

Verified working against Xcode 26.6 / iOS 26.5 simulators, macOS 26.5.2 (Apple Silicon),
node v24.18.0 (nvm), CocoaPods 1.17.0.

## Quick start

```powershell
cd tools\mac
.\Mac-Doctor.ps1        # confirm both sides are ready
.\Mac-Setup.ps1         # first run only: sync + npm install + pod install
.\Mac-Run-iOS.ps1       # build, install and launch in the simulator
```

Or double-click `Run-iOS-Simulator.bat`.

## The two loops

**Native loop** — anything touching `ios/`, plugins, Podfile, or a real bundled build:

```powershell
.\Mac-Run-iOS.ps1                 # ~15-20 s incremental, ~3 min after -Clean
.\Mac-Run-iOS.ps1 -Screenshot     # ...and pull a PNG back to Windows
```

**Web loop** — editing `src/` only. Build once with the dev server wired in, then every
save hot-reloads in the Mac's simulator with no rebuild and no sync:

```powershell
.\Mac-Run-iOS.ps1 -Live
```

`-Live` starts `npm start` here if it is not already running, points the app at
`http://<this-pc>:3005`, and verifies the Mac can actually reach it before building.
Re-run without `-Live` to go back to bundled assets.

## Scripts

| Script | What it does |
| --- | --- |
| `Mac-Doctor.ps1` | Checks ssh, Xcode, node, CocoaPods, the synced project, the simulator list. Start here when something breaks. |
| `Mac-Sync.ps1` | Pushes the working tree (including uncommitted changes) to the Mac. |
| `Mac-Setup.ps1` | `npm install` + `pod install` on the Mac. Re-run after a `package-lock.json` or `Podfile` change. |
| `Mac-Build-iOS.ps1` | Sync → vite build → `cap sync ios` → `xcodebuild`. No install/launch. |
| `Mac-Run-iOS.ps1` | The everyday command: build, boot the simulator, install, launch. |
| `Mac-Logs-iOS.ps1` | Streams the app's simulator log to this terminal. |
| `Mac-Screenshot-iOS.ps1` | Captures the simulator screen into `tools\mac\screenshots\`. |
| `Mac-Simulators.ps1` | Lists simulators; `-Boot`, `-Shutdown`, `-Erase`. |
| `Mac-Shell.ps1` | Interactive shell on the Mac, or `-Command '<cmd>'` with the build env loaded. |
| `Mac-Open-Xcode.ps1` | Opens the workspace in Xcode **on the Mac's display** (pair with Screen Sharing). |

Every script supports `-?` / `Get-Help` for its full switch list.

## Useful switches

```powershell
.\Mac-Run-iOS.ps1 -Device 'iPad Pro 11-inch (M5)'   # any name from Mac-Simulators.ps1
.\Mac-Run-iOS.ps1 -Configuration Release
.\Mac-Run-iOS.ps1 -Clean                            # wipe derived data first
.\Mac-Run-iOS.ps1 -Reinstall                        # clear the app's stored data
.\Mac-Run-iOS.ps1 -SkipBuild -NoSync                # just relaunch the last build
.\Mac-Run-iOS.ps1 -UseWindowsBuild                  # run vite here, send dist/, skip it on the Mac
.\Mac-Run-iOS.ps1 -NoGui                            # headless; screenshots still work
.\Mac-Build-iOS.ps1 -Verbose2                       # full xcodebuild log
```

## Configuration

Defaults live at the top of `_common.ps1`; override per-shell with environment variables:

| Variable | Default | |
| --- | --- | --- |
| `ELSO_MAC_HOST` | `10.0.0.189` | Mac IP |
| `ELSO_MAC_USER` | `rafael` | Mac login |
| `ELSO_MAC_PROJECT` | `~/dev/elso-capacitor` | where the project lands on the Mac |
| `ELSO_SIM` | `iPhone 17` | default simulator |
| `ELSO_DEV_PORT` | `3005` | vite dev server port |

## How the sync works

Windows has no `rsync`, so `Mac-Sync.ps1` tars the working tree and extracts it over the
remote copy (~56 MB, a few seconds on the LAN). Skipped: `.git`, `node_modules`, `dist`,
`android/`, `ios/App/Pods`, `ios/App/App/public`, `build/` — the Mac regenerates or caches
all of those. `.env` **is** sent, because the vite build reads it.

Two things to know:

- Files you delete locally are not removed on the Mac. Use `-Fresh` to wipe the remote
  copy (keeping `node_modules`, `Pods` and `build` so the next build stays fast).
- The Mac's copy is a build sandbox, not a working tree. `-Live` temporarily rewrites
  `capacitor.config.json` and `Info.plist` there and restores them after the build;
  your Windows files are never touched.

## Signing

Simulator builds need no certificate — the scripts pass `CODE_SIGNING_ALLOWED=NO`.
Device builds, archives and TestFlight are still AppFlow's job; this toolkit
deliberately stops at the simulator.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `Cannot reach ... over ssh with key auth` | Mac asleep, or Remote Login off (System Settings → General → Sharing). Install your key: `type $env:USERPROFILE\.ssh\id_ed25519.pub \| ssh rafael@10.0.0.189 "cat >> ~/.ssh/authorized_keys"` |
| `-Live` says the Mac cannot reach the dev server | Windows Firewall. In an admin shell: `New-NetFirewallRule -DisplayName 'Vite dev server 3005' -Direction Inbound -Protocol TCP -LocalPort 3005 -Action Allow -Profile Private` |
| `Cannot find module 'my-clarity-capacitator-plugin'` | The plugin's `dist/` did not reach the Mac. Re-run `Mac-Sync.ps1`. |
| `xcodebuild failed` with no obvious error | The full log stays on the Mac at `~/dev/elso-capacitor/build/ios/xcodebuild.log`; read it with `.\Mac-Shell.ps1 -Command 'tail -100 build/ios/xcodebuild.log'`, or rebuild with `-Verbose2`. |
| Pods errors after a dependency bump | `.\Mac-Setup.ps1 -Force` |
| Simulator wedged | `.\Mac-Simulators.ps1 -Shutdown all`, or `-Erase 'iPhone 17'` for a factory reset |
