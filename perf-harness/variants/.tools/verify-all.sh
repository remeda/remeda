#!/bin/zsh
V=/Users/eranhirsch/code/remeda/.tmp/claude-501/-Users-eranhirsch-code-remeda/3731fd26-f43e-476d-be89-b29b3f9626ed/scratchpad/perf/variants
out=$V/.verify/summary.txt
: > $out
for p in $V/*.patch; do
  name=$(basename $p .patch)
  res=$($V/.tools/verify.sh $name 2>&1 | tail -1)
  if echo "$res" | grep -q FAIL; then
    # Retry once: funnel.test.ts has real-timer tests that flake under load.
    res2=$($V/.tools/verify.sh $name 2>&1 | tail -1)
    res="$res2 (retried; first: $res)"
  fi
  echo "$res" >> $out
done
echo DONE >> $out
