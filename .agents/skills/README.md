# Skills

Agent-agnostic skill definitions used across the repo. Each subdirectory is one skill, with a `SKILL.md` file describing what it does and when to invoke it.

Claude Code reads these via the `.claude/skills` symlink that points here.

## Local skills

Skills prefixed with `local-` are gitignored — they're for per-contributor use and don't ship with the repo. Mirrors the `.env.local` convention.

Create one by naming the directory `local-<name>/` (e.g., `local-my-skill/`); the entry in `.gitignore` (`.agents/skills/local-*`) keeps it out of version control automatically.
