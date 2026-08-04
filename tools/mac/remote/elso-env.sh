#!/usr/bin/env bash
# Shared environment + helpers for every remote (Mac side) script in this folder.
#
# A non-interactive ssh session on macOS starts with a bare PATH
# (/usr/bin:/bin:/usr/sbin:/sbin) -- no Homebrew, no nvm, so no node, npm or pod.
# Everything the iOS build needs gets wired up here, and every script sources this.

set -euo pipefail

export LANG="${LANG:-en_US.UTF-8}"
export LC_ALL="${LC_ALL:-en_US.UTF-8}"
export PATH="/opt/homebrew/bin:/opt/homebrew/sbin:$PATH"

# nvm-managed node (the Mac has no system node)
export NVM_DIR="${NVM_DIR:-$HOME/.nvm}"
if ! command -v node >/dev/null 2>&1 && [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh" >/dev/null 2>&1 || true
  nvm use default >/dev/null 2>&1 || nvm use node >/dev/null 2>&1 || true
fi

REMOTE_SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$REMOTE_SCRIPT_DIR/../../.." && pwd)"

IOS_DIR="$PROJECT_DIR/ios/App"
WORKSPACE="$IOS_DIR/App.xcworkspace"
SCHEME="${ELSO_SCHEME:-App}"
DERIVED_DIR="${ELSO_DERIVED_DIR:-$PROJECT_DIR/build/ios}"
DEFAULT_SIM="${ELSO_SIM:-iPhone 17}"

# Read appId without needing node -- doctor.sh runs before node is guaranteed.
APP_ID=""
if [ -f "$PROJECT_DIR/capacitor.config.json" ]; then
  APP_ID="$(sed -n 's/.*"appId"[[:space:]]*:[[:space:]]*"\([^"]*\)".*/\1/p' \
    "$PROJECT_DIR/capacitor.config.json" | head -1)"
fi

say()  { printf '\033[36m==>\033[0m %s\n' "$*"; }
ok()   { printf '   \033[32mok\033[0m %s\n' "$*"; }
warn() { printf '   \033[33m!!\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[31mERROR\033[0m %s\n' "$*" >&2; exit 1; }

# Name ("iPhone 17") or UDID -> UDID. Empty arg falls back to $DEFAULT_SIM.
resolve_sim_udid() {
  local want="${1:-$DEFAULT_SIM}"
  if printf '%s' "$want" | grep -qE '^[0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}$'; then
    printf '%s' "$want"
    return 0
  fi
  xcrun simctl list devices available | awk -v want="$want" '
    match($0, /\([0-9A-Fa-f]{8}-([0-9A-Fa-f]{4}-){3}[0-9A-Fa-f]{12}\)/) {
      udid = substr($0, RSTART + 1, RLENGTH - 2)
      name = substr($0, 1, RSTART - 1)
      sub(/^[[:space:]]+/, "", name)
      sub(/[[:space:]]+$/, "", name)
      if (name == want) { print udid; exit }
    }'
}

sim_name_of() {
  xcrun simctl list devices | awk -v udid="$1" '
    index($0, udid) {
      name = substr($0, 1, index($0, "(" udid ")") - 1)
      sub(/^[[:space:]]+/, "", name); sub(/[[:space:]]+$/, "", name)
      print name; exit
    }'
}

sim_state_of() {
  xcrun simctl list devices | awk -v udid="$1" '
    index($0, udid) {
      if (match($0, /\(Booted\)/))   { print "Booted";   exit }
      if (match($0, /\(Shutdown\)/)) { print "Shutdown"; exit }
      print "Unknown"; exit
    }'
}

boot_sim() {
  local udid="$1"
  local state
  state="$(sim_state_of "$udid")"
  if [ "$state" != "Booted" ]; then
    say "Booting simulator $(sim_name_of "$udid")"
    xcrun simctl boot "$udid"
  fi
  xcrun simctl bootstatus "$udid" -b >/dev/null 2>&1 || true
}
