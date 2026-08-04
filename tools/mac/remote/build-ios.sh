#!/usr/bin/env bash
# Build the iOS app for the simulator: vite build -> cap sync -> xcodebuild.
#
#   --config Debug|Release   build configuration (default Debug)
#   --device <name|udid>     simulator to build for (default "$DEFAULT_SIM")
#   --skip-web              reuse the dist/ already on the Mac (synced from Windows)
#   --clean                 clean the derived data first
#   --live-url <url>        point the app at a dev server instead of bundled assets
#   --verbose               show the full xcodebuild log
#
# Prints "APP_PATH=<path to App.app>" as its last line.

# shellcheck source=elso-env.sh
. "$(dirname "$0")/elso-env.sh"

CONFIG=Debug
DEVICE=""
SKIP_WEB=0
CLEAN=0
LIVE_URL=""
VERBOSE=0

while [ $# -gt 0 ]; do
  case "$1" in
    --config)   CONFIG="$2"; shift 2 ;;
    --device)   DEVICE="$2"; shift 2 ;;
    --live-url) LIVE_URL="$2"; shift 2 ;;
    --skip-web) SKIP_WEB=1; shift ;;
    --clean)    CLEAN=1; shift ;;
    --verbose)  VERBOSE=1; shift ;;
    *) die "unknown argument: $1" ;;
  esac
done

cd "$PROJECT_DIR"
[ -d node_modules ] || die "node_modules missing -- run Mac-Setup.ps1 first"

UDID="$(resolve_sim_udid "$DEVICE")"
[ -n "$UDID" ] && [ ${#UDID} -eq 36 ] \
  || die "no available simulator named '${DEVICE:-$DEFAULT_SIM}' (see Mac-Simulators.ps1)"
say "Target: $(sim_name_of "$UDID")  [$UDID]  config=$CONFIG"

# ---------------------------------------------------------------- web assets
if [ "$SKIP_WEB" = "1" ]; then
  [ -d dist ] && [ -f dist/index.html ] \
    || die "--skip-web needs a dist/ on the Mac; sync it with Mac-Sync.ps1 -IncludeDist"
  ok "Reusing existing dist/"
else
  say "Building web bundle (vite, PLATFORM=ios)"
  PLATFORM=ios npm run build
fi

# ------------------------------------------------- live reload config (temp)
# Both files live in the Mac's throwaway copy of the repo, but restore them
# anyway so a later non-live build never picks up a stale dev-server URL.
RESTORE_LIST=()
restore_patched() {
  local f
  for f in "${RESTORE_LIST[@]:+${RESTORE_LIST[@]}}"; do
    if [ -f "$f.elso-orig" ]; then mv -f "$f.elso-orig" "$f"; fi
  done
  return 0   # an EXIT trap's last status becomes the script's exit code
}
trap restore_patched EXIT

if [ -n "$LIVE_URL" ]; then
  say "Live reload: app will load $LIVE_URL"
  cp -f capacitor.config.json capacitor.config.json.elso-orig
  RESTORE_LIST+=("capacitor.config.json")
  node -e '
    const fs = require("fs");
    const cfg = JSON.parse(fs.readFileSync("capacitor.config.json", "utf8"));
    cfg.server = { ...(cfg.server || {}), url: process.argv[1], cleartext: true };
    fs.writeFileSync("capacitor.config.json", JSON.stringify(cfg, null, 2) + "\n");
  ' "$LIVE_URL"

  # http:// needs an ATS exception on iOS
  PLIST="$IOS_DIR/App/Info.plist"
  cp -f "$PLIST" "$PLIST.elso-orig"
  RESTORE_LIST+=("$PLIST")
  /usr/libexec/PlistBuddy \
    -c "Add :NSAppTransportSecurity dict" \
    -c "Add :NSAppTransportSecurity:NSAllowsArbitraryLoads bool true" \
    "$PLIST" >/dev/null 2>&1 || true
fi

# ------------------------------------------------------- capacitor + cocoapods
say "capacitor sync ios"
npx --no-install cap sync ios

# -------------------------------------------------------------- xcode scheme
# Capacitor's template ships no shared scheme; xcodebuild needs one for a workspace.
SCHEME_FILE="$IOS_DIR/App.xcodeproj/xcshareddata/xcschemes/$SCHEME.xcscheme"
if [ ! -f "$SCHEME_FILE" ]; then
  BLUEPRINT="$(awk '/Begin PBXNativeTarget section/,/End PBXNativeTarget section/' \
    "$IOS_DIR/App.xcodeproj/project.pbxproj" \
    | sed -n "s|^[[:space:]]*\([0-9A-Fa-f]\{24\}\) /\* $SCHEME \*/ = {|\1|p" | head -1)"
  [ -n "$BLUEPRINT" ] || die "could not find the '$SCHEME' target in project.pbxproj"
  say "Generating shared scheme $SCHEME.xcscheme (blueprint $BLUEPRINT)"
  mkdir -p "$(dirname "$SCHEME_FILE")"
  cat > "$SCHEME_FILE" <<XCSCHEME
<?xml version="1.0" encoding="UTF-8"?>
<Scheme LastUpgradeVersion="1500" version="1.7">
   <BuildAction parallelizeBuildables="YES" buildImplicitDependencies="YES">
      <BuildActionEntries>
         <BuildActionEntry buildForTesting="YES" buildForRunning="YES" buildForProfiling="YES" buildForArchiving="YES" buildForAnalyzing="YES">
            <BuildableReference
               BuildableIdentifier="primary"
               BlueprintIdentifier="$BLUEPRINT"
               BuildableName="$SCHEME.app"
               BlueprintName="$SCHEME"
               ReferencedContainer="container:$SCHEME.xcodeproj">
            </BuildableReference>
         </BuildActionEntry>
      </BuildActionEntries>
   </BuildAction>
   <LaunchAction buildConfiguration="Debug" selectedDebuggerIdentifier="Xcode.DebuggerFoundation.Debugger.LLDB" selectedLauncherIdentifier="Xcode.DebuggerFoundation.Launcher.LLDB" launchStyle="0" useCustomWorkingDirectory="NO" ignoresPersistentStateOnLaunch="NO" debugDocumentVersioning="YES" debugServiceExtension="internal" allowLocationSimulation="YES">
      <BuildableProductRunnable runnableDebuggingMode="0">
         <BuildableReference
            BuildableIdentifier="primary"
            BlueprintIdentifier="$BLUEPRINT"
            BuildableName="$SCHEME.app"
            BlueprintName="$SCHEME"
            ReferencedContainer="container:$SCHEME.xcodeproj">
         </BuildableReference>
      </BuildableProductRunnable>
   </LaunchAction>
   <ProfileAction buildConfiguration="Release" shouldUseLaunchSchemeArgsEnv="YES" savedToolIdentifier="" useCustomWorkingDirectory="NO" debugDocumentVersioning="YES">
      <BuildableProductRunnable runnableDebuggingMode="0">
         <BuildableReference
            BuildableIdentifier="primary"
            BlueprintIdentifier="$BLUEPRINT"
            BuildableName="$SCHEME.app"
            BlueprintName="$SCHEME"
            ReferencedContainer="container:$SCHEME.xcodeproj">
         </BuildableReference>
      </BuildableProductRunnable>
   </ProfileAction>
   <AnalyzeAction buildConfiguration="Debug"></AnalyzeAction>
   <ArchiveAction buildConfiguration="Release" revealArchiveInOrganizer="YES"></ArchiveAction>
</Scheme>
XCSCHEME
fi

# ------------------------------------------------------------------ xcodebuild
if [ "$CLEAN" = "1" ]; then
  say "Cleaning derived data"
  rm -rf "$DERIVED_DIR"
fi

say "xcodebuild ($CONFIG, iphonesimulator)"
XCFLAGS=(-workspace "$WORKSPACE" -scheme "$SCHEME" -configuration "$CONFIG"
         -destination "id=$UDID" -derivedDataPath "$DERIVED_DIR"
         CODE_SIGNING_ALLOWED=NO CODE_SIGNING_REQUIRED=NO CODE_SIGN_IDENTITY=""
         build)

mkdir -p "$DERIVED_DIR"
XCLOG="$DERIVED_DIR/xcodebuild.log"
if [ "$VERBOSE" = "1" ]; then
  xcodebuild "${XCFLAGS[@]}" 2>&1 | tee "$XCLOG"
  rc=${PIPESTATUS[0]}
else
  # The full log always lands in $XCLOG; only the lines worth reading come back
  # over ssh -- Capacitor's pods generate hundreds of deprecation warnings.
  set +e
  xcodebuild -quiet "${XCFLAGS[@]}" 2>&1 | tee "$XCLOG" \
    | grep --line-buffered -E 'error:|error;|\*\* BUILD (SUCCEEDED|FAILED)|Command .* failed' \
    | sed 's/^/   /'
  rc=${PIPESTATUS[0]}
  set -e
fi
[ "$rc" -eq 0 ] || die "xcodebuild failed (exit $rc). Full log on the Mac: $XCLOG"

APP_PATH="$DERIVED_DIR/Build/Products/$CONFIG-iphonesimulator/$SCHEME.app"
[ -d "$APP_PATH" ] || die "build finished but $APP_PATH is missing"

ok "Built $(du -sh "$APP_PATH" | awk '{print $1}') -> $APP_PATH"
echo "APP_PATH=$APP_PATH"
