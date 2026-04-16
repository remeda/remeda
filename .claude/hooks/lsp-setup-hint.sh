#!/bin/sh
# Surfaces the one-time shim installation when Claude Code's TypeScript LSP
# can't find `typescript-language-server` — typical for contributors using
# nvm who don't want a globally-installed binary tied to a single node version.

input=$(cat)

case "$input" in
  *"Executable not found"*"typescript-language-server"*) ;;
  *"typescript-language-server: no local install"*) ;;
  *) exit 0 ;;
esac

cat "$(dirname "$0")/lsp-setup-hint.json"
