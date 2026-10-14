#!/bin/bash
# Runs the measurement stages that the agents prepare, from Eran's own
# terminal (outside the agent sandbox, normal scheduling).
#
# Start it once and leave it running:
#   bash <this file>
#
# A stage is declared by a marker file `markers/READY-<stage>` with two lines:
#   sha=<commit the stage measures>
#   steps=<path of a steps file, relative to this directory>
# The steps file has one shell command per line (blank lines and `#` comments
# are ignored). Before every step the watcher waits for AC power and for the
# user to have been idle for IDLE_MIN_SECONDS, then runs the step under
# `caffeinate` so the machine doesn't sleep mid-measurement.
#
# Progress survives restarts (`markers/PROGRESS-<stage>` counts finished
# steps). A failing step writes `markers/FAILED-<stage>` and the stage pauses
# until that file is removed. A finished stage writes `markers/DONE-<stage>`.

set -u

PERF="$(cd "$(dirname "$0")" && pwd)"
MARKERS="$PERF/markers"
LOGS="$PERF/logs"
IDLE_MIN_SECONDS="${IDLE_MIN_SECONDS:-600}"
POLL_SECONDS=30

mkdir -p "$MARKERS" "$LOGS"

LOCK_DIR="$MARKERS/.watcher.lock"
if ! mkdir "$LOCK_DIR" 2> /dev/null; then
  holder="$(cat "$LOCK_DIR/pid" 2> /dev/null || true)"
  if [ -n "$holder" ] && kill -0 "$holder" 2> /dev/null; then
    echo "Another watcher is already running (pid $holder)."
    exit 1
  fi
  rm -rf "$LOCK_DIR"
  mkdir "$LOCK_DIR"
fi
echo $$ > "$LOCK_DIR/pid"
trap 'rm -rf "$LOCK_DIR"; echo; echo "Watcher stopped. Progress is kept; start it again to resume."; exit 130' INT TERM

log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*" | tee -a "$LOGS/watch.log"
}

idle_seconds() {
  ioreg -c IOHIDSystem | awk '/HIDIdleTime/ { print int($NF / 1000000000); exit }'
}

on_ac_power() {
  pmset -g batt | head -1 | grep -q "AC Power"
}

wait_for_quiet_machine() {
  local last_report=0
  while :; do
    local idle
    idle="$(idle_seconds)"
    if on_ac_power && [ "${idle:-0}" -ge "$IDLE_MIN_SECONDS" ]; then
      return
    fi
    local now
    now="$(date +%s)"
    if [ $((now - last_report)) -ge 300 ]; then
      if on_ac_power; then
        log "waiting: idle ${idle}s of ${IDLE_MIN_SECONDS}s required"
      else
        log "waiting: on battery, plug in to continue"
      fi
      last_report="$now"
    fi
    sleep "$POLL_SECONDS"
  done
}

marker_field() {
  sed -n "s/^$2=//p" "$1" | head -1
}

run_stage() {
  local stage="$1"
  local ready="$MARKERS/READY-$stage"
  local sha steps_file
  sha="$(marker_field "$ready" sha)"
  steps_file="$PERF/$(marker_field "$ready" steps)"

  if [ -z "$sha" ] || [ ! -f "$steps_file" ]; then
    echo "bad marker: sha='$sha' steps='$steps_file'" > "$MARKERS/FAILED-$stage"
    log "stage $stage: bad marker, see markers/FAILED-$stage"
    return
  fi

  local progress_file="$MARKERS/PROGRESS-$stage"
  local done_steps
  done_steps="$(cat "$progress_file" 2> /dev/null || echo 0)"

  local step_number=0
  local command
  while IFS= read -r command || [ -n "$command" ]; do
    case "$command" in
      "" | \#*) continue ;;
    esac
    step_number=$((step_number + 1))
    if [ "$step_number" -le "$done_steps" ]; then
      continue
    fi

    wait_for_quiet_machine
    log "stage $stage step $step_number start (sha $sha, idle $(idle_seconds)s, load $(sysctl -n vm.loadavg)): $command"
    local started
    started="$(date +%s)"
    (
      cd "$PERF" \
        && PERF="$PERF" PERF_SHA="$sha" PERF_STAGE="$stage" \
          caffeinate -is bash -c "$command"
    ) >> "$LOGS/$stage.log" 2>&1
    local status=$?
    local elapsed=$(($(date +%s) - started))
    if [ "$status" -ne 0 ]; then
      echo "step $step_number exited $status after ${elapsed}s: $command" > "$MARKERS/FAILED-$stage"
      log "stage $stage step $step_number FAILED (exit $status, ${elapsed}s); see logs/$stage.log"
      return
    fi
    echo "$step_number" > "$progress_file"
    log "stage $stage step $step_number done (${elapsed}s)"
  done < "$steps_file"

  date '+%Y-%m-%d %H:%M:%S' > "$MARKERS/DONE-$stage"
  log "stage $stage DONE"
}

log "watcher started (pid $$); waiting for READY markers in $MARKERS"
while :; do
  for ready in "$MARKERS"/READY-*; do
    [ -e "$ready" ] || continue
    stage="${ready##*/READY-}"
    [ -e "$MARKERS/DONE-$stage" ] && continue
    [ -e "$MARKERS/FAILED-$stage" ] && continue
    run_stage "$stage"
  done
  sleep "$POLL_SECONDS"
done
