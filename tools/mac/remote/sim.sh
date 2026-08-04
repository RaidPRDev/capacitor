#!/usr/bin/env bash
# Small simulator utilities, driven by the Mac-*.ps1 wrappers.
#
#   sim.sh list
#   sim.sh udid       <name>
#   sim.sh boot       <name>          # also opens Simulator.app
#   sim.sh shutdown   <name|all>
#   sim.sh erase      <name>          # factory reset (wipes app data)
#   sim.sh screenshot <name> <out.png>
#   sim.sh logs       <name>          # follow this app's log stream
#   sim.sh open-url   <name> <url>    # deep-link into the app
#   sim.sh appdata    <name>          # path to the installed app's data container

# shellcheck source=elso-env.sh
. "$(dirname "$0")/elso-env.sh"

CMD="${1:-list}"
shift || true

need_udid() {
  local udid
  udid="$(resolve_sim_udid "${1:-}")"
  [ -n "$udid" ] && [ ${#udid} -eq 36 ] \
    || die "no available simulator named '${1:-$DEFAULT_SIM}'"
  printf '%s' "$udid"
}

case "$CMD" in
  list)
    xcrun simctl list devices available
    ;;
  udid)
    need_udid "${1:-}"; echo
    ;;
  boot)
    UDID="$(need_udid "${1:-}")"
    boot_sim "$UDID"
    open -a Simulator --args -CurrentDeviceUDID "$UDID" >/dev/null 2>&1 || true
    ok "$(sim_name_of "$UDID") is $(sim_state_of "$UDID")"
    ;;
  shutdown)
    if [ "${1:-}" = "all" ]; then
      xcrun simctl shutdown all && ok "all simulators shut down"
    else
      UDID="$(need_udid "${1:-}")"
      xcrun simctl shutdown "$UDID" && ok "$(sim_name_of "$UDID") shut down"
    fi
    ;;
  erase)
    UDID="$(need_udid "${1:-}")"
    xcrun simctl shutdown "$UDID" >/dev/null 2>&1 || true
    xcrun simctl erase "$UDID"
    ok "$(sim_name_of "$UDID") erased"
    ;;
  screenshot)
    UDID="$(need_udid "${1:-}")"
    OUT="${2:?screenshot needs an output path}"
    boot_sim "$UDID"
    xcrun simctl io "$UDID" screenshot --type=png "$OUT"
    ok "$OUT"
    ;;
  logs)
    UDID="$(need_udid "${1:-}")"
    MINE='(processImagePath CONTAINS "'"$SCHEME"'.app" OR subsystem CONTAINS "'"$APP_ID"'")'
    if [ "${2:-}" = "--all" ]; then
      PREDICATE="$MINE"
      say "Streaming ALL logs for $APP_ID on $(sim_name_of "$UDID") -- Ctrl+C to stop"
    else
      # Drop Apple's own subsystems: UIKit/WebKit chatter drowns out app output.
      PREDICATE="$MINE AND NOT subsystem BEGINSWITH \"com.apple\""
      say "Streaming logs for $APP_ID on $(sim_name_of "$UDID") -- Ctrl+C to stop (--all for system chatter)"
    fi
    exec xcrun simctl spawn "$UDID" log stream --style compact --level debug \
      --predicate "$PREDICATE"
    ;;
  open-url)
    UDID="$(need_udid "${1:-}")"
    xcrun simctl openurl "$UDID" "${2:?open-url needs a url}"
    ;;
  appdata)
    UDID="$(need_udid "${1:-}")"
    xcrun simctl get_app_container "$UDID" "$APP_ID" data
    ;;
  *)
    die "unknown command: $CMD"
    ;;
esac
