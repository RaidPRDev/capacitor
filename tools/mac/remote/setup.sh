#!/usr/bin/env bash
# One-time (and safe-to-repeat) preparation of the synced project on the Mac:
# node via nvm, npm dependencies, CocoaPods. Skips work that is already done
# unless --force is passed.

# shellcheck source=elso-env.sh
. "$(dirname "$0")/elso-env.sh"

FORCE=0
for arg in "$@"; do
  case "$arg" in
    --force) FORCE=1 ;;
    *) die "unknown argument: $arg" ;;
  esac
done

cd "$PROJECT_DIR"

say "Checking node"
if ! command -v node >/dev/null 2>&1; then
  [ -s "$NVM_DIR/nvm.sh" ] || die "nvm not found at $NVM_DIR -- install node on the Mac first"
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  say "Installing the latest LTS node via nvm (first run only)"
  nvm install --lts
  nvm alias default 'lts/*'
  nvm use default
fi
ok "node $(node -v), npm $(npm -v)"

say "Checking CocoaPods"
command -v pod >/dev/null 2>&1 || die "CocoaPods missing -- run on the Mac: brew install cocoapods"
ok "pod $(pod --version)"

say "npm dependencies"
if [ "$FORCE" = "1" ] || [ ! -d node_modules ] || [ package-lock.json -nt node_modules ]; then
  if [ -f package-lock.json ]; then
    npm ci --no-audit --fund=false || npm install --no-audit --fund=false
  else
    npm install --no-audit --fund=false
  fi
  touch node_modules
else
  ok "node_modules up to date (use --force to reinstall)"
fi

say "CocoaPods dependencies"
if [ "$FORCE" = "1" ] || [ ! -d "$IOS_DIR/Pods" ] || [ "$IOS_DIR/Podfile" -nt "$IOS_DIR/Pods" ]; then
  ( cd "$IOS_DIR" && pod install )
  touch "$IOS_DIR/Pods"
else
  ok "Pods up to date (use --force to reinstall)"
fi

ok "Setup complete"
