# Relays the hook event to the executable at $REMEDA_PERSONAL_HOOK, when set,
# for per-contributor extensions to the shared harness: e.g., syncing a private
# repo of skills and AGENTS.md additions into the checkout at session start and
# back out at turn and session end, so customizing the harness needs no PR. An
# environment variable reaches every worktree and cloud environment, where a
# gitignored .claude/settings.local.json doesn't exist.
#
# The script gets the event name as $1 and the hook's JSON on stdin (filter on
# its `source` or `reason`); its output and exit code are the hook's own. It
# runs in parallel with the event's other hooks, including the turn-end CI
# checks, which lint and diff the dirty files under packages/.

[ -z "$REMEDA_PERSONAL_HOOK" ] || exec "$REMEDA_PERSONAL_HOOK" "$@"
