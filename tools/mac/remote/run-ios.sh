#!/usr/bin/env bash
# Boot a simulator, install the app and launch it. Builds first unless --skip-build.
# Any unrecognised flags are forwarded to build-ios.sh.
#
#   --device <name|udid>  simulator to use (default "$DEFAULT_SIM")
#   --config Debug|Release
#   --skip-build          install whatever was built last
#   --reinstall           uninstall the app before installing (clears its data)
#   --no-gui              do not open Simulator.app on the Mac's display

# shellcheck source=elso-env.sh
. "$(dirname "$0")/elso-env.sh"

DEVICE=""
CONFIG=Debug
SKIP_BUILD=0
REINSTALL=0
GUI=1
BUILD_ARGS=()

while [ $# -gt 0 ]; do
  case "$1" in
    --device)     DEVICE="$2"; shift 2 ;;
    --config)     CONFIG="$2"; shift 2 ;;
    --skip-build) SKIP_BUILD=1; shift ;;
    --reinstall)  REINSTALL=1; shift ;;
    --no-gui)     GUI=0; shift ;;
    --live-url)   BUILD_ARGS+=("$1" "$2"); shift 2 ;;
    *)            BUILD_ARGS+=("$1"); shift ;;
  esac
done

UDID="$(resolve_sim_udid "$DEVICE")"
[ -n "$UDID" ] && [ ${#UDID} -eq 36 ] \
  || die "no available simulator named '${DEVICE:-$DEFAULT_SIM}' (see Mac-Simulators.ps1)"

if [ "$SKIP_BUILD" = "1" ]; then
  APP_PATH="$DERIVED_DIR/Build/Products/$CONFIG-iphonesimulator/$SCHEME.app"
  [ -d "$APP_PATH" ] || die "nothing built yet at $APP_PATH -- drop --skip-build"
  ok "Using existing build $APP_PATH"
else
  set -- "${BUILD_ARGS[@]:+${BUILD_ARGS[@]}}"
  BUILD_OUT="$(bash "$REMOTE_SCRIPT_DIR/build-ios.sh" \
    --device "$UDID" --config "$CONFIG" "$@" 2>&1 | tee /dev/stderr)"
  APP_PATH="$(printf '%s\n' "$BUILD_OUT" | sed -n 's/^APP_PATH=//p' | tail -1)"
  [ -n "$APP_PATH" ] || die "build did not report an APP_PATH"
fi

boot_sim "$UDID"

if [ "$GUI" = "1" ]; then
  open -a Simulator --args -CurrentDeviceUDID "$UDID" >/dev/null 2>&1 || true
fi

if [ "$REINSTALL" = "1" ]; then
  say "Uninstalling $APP_ID"
  xcrun simctl uninstall "$UDID" "$APP_ID" >/dev/null 2>&1 || true
fi

say "Installing $APP_ID"
xcrun simctl install "$UDID" "$APP_PATH"

say "Launching $APP_ID"
LAUNCH_OUT="$(xcrun simctl launch "$UDID" "$APP_ID")"
ok "$LAUNCH_OUT"
echo "SIM_UDID=$UDID"
echo "SIM_NAME=$(sim_name_of "$UDID")"
