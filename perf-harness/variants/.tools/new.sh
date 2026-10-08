#!/bin/zsh
# Creates a fresh work copy of the base for a variant.
set -eu
V=/Users/eranhirsch/code/remeda/.tmp/claude-501/-Users-eranhirsch-code-remeda/3731fd26-f43e-476d-be89-b29b3f9626ed/scratchpad/perf/variants
name=$1
if [ -e "$V/.work/$name" ]; then
  echo "work copy $name already exists"
  exit 1
fi
mkdir -p "$V/.work/$name"
cp -R "$V/.base/packages" "$V/.work/$name/"
echo "$V/.work/$name/packages/remeda"
