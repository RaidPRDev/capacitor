#!/usr/bin/env bash
# Report on the Mac's iOS toolchain. Exits non-zero if something essential is missing.
# Deliberately tolerant: it must run before setup.sh has fixed anything.

set -uo pipefail
# shellcheck source=elso-env.sh
. "$(dirname "$0")/elso-env.sh"
set +e

missing=0

check() { # check <label> <command>
  local label="$1" cmd="$2" path
  path="$(command -v "$cmd" 2>/dev/null)"
  if [ -n "$path" ]; then
    printf '   \033[32mok\033[0m   %-12s %s\n' "$label" "$path"
  else
    printf '   \033[31mMISS\033[0m %-12s not on PATH\n' "$label"
    missing=$((missing + 1))
  fi
}

say "Host"
printf '   %-14s %s\n' "hostname" "$(hostname)"
printf '   %-14s %s (%s)\n' "macOS" "$(sw_vers -productVersion)" "$(uname -m)"
printf '   %-14s %s\n' "free disk" "$(df -h / | awk 'NR==2 {print $4}')"

say "Toolchain"
check Xcode      xcodebuild
check xcrun      xcrun
check git        git
check node       node
check npm        npm
check CocoaPods  pod
check Homebrew   brew

say "Versions"
printf '   %-14s %s\n' "xcodebuild" "$(xcodebuild -version 2>/dev/null | head -1)"
printf '   %-14s %s\n' "xcode-select" "$(xcode-select -p 2>/dev/null)"
printf '   %-14s %s\n' "node" "$(node -v 2>/dev/null || echo '-')"
printf '   %-14s %s\n' "npm" "$(npm -v 2>/dev/null || echo '-')"
printf '   %-14s %s\n' "pod" "$(pod --version 2>/dev/null || echo '-')"

if ! xcodebuild -checkFirstLaunchStatus >/dev/null 2>&1; then
  warn "Xcode first-launch tasks are pending. Run on the Mac: sudo xcodebuild -runFirstLaunch"
  missing=$((missing + 1))
fi

say "Simulator SDKs"
xcodebuild -showsdks 2>/dev/null | grep -i iphonesimulator | sed 's/^/  /' || warn "no iOS simulator SDK found"

say "Project at $PROJECT_DIR"
if [ -d "$PROJECT_DIR/ios/App" ]; then
  printf '   %-14s %s\n' "appId" "$APP_ID"
  printf '   %-14s %s\n' "workspace" "$([ -d "$WORKSPACE" ] && echo present || echo MISSING)"
  printf '   %-14s %s\n' "node_modules" "$([ -d "$PROJECT_DIR/node_modules" ] && echo present || echo 'missing (run Mac-Setup.ps1)')"
  printf '   %-14s %s\n' "Pods" "$([ -d "$IOS_DIR/Pods" ] && echo present || echo 'missing (run Mac-Setup.ps1)')"
  printf '   %-14s %s\n' "dist" "$([ -d "$PROJECT_DIR/dist" ] && echo present || echo 'missing (built during Mac-Build-iOS.ps1)')"
else
  warn "project not synced yet -- run Mac-Sync.ps1"
  missing=$((missing + 1))
fi

say "Available simulators"
xcrun simctl list devices available 2>/dev/null | grep -E '^\s+\S' | sed 's/^/  /'

echo
if [ "$missing" -gt 0 ]; then
  die "$missing item(s) need attention (see MISS / !! lines above)"
fi
ok "Mac is ready to build iOS"
