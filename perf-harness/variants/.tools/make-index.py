"""Writes variants/index.json: variant metadata plus the pairwise conflicts,
computed by dry-running every patch on top of every other one."""

import json
import os
import pathlib
import re
import shutil
import subprocess
import sys

V = pathlib.Path(sys.argv[1])
TMP = V / ".tmpdir"
os.environ["TMPDIR"] = str(TMP)
C = TMP / "index-conflicts"

VARIANTS = [
    {
        "name": "pipe-last-index",
        "description": "pipe: reads a lazy run's last step with `[length - 1]` instead of `.at(-1)` (once per run). Needs an eslint-disable for unicorn/prefer-at, which would otherwise autofix it back.",
        "targets": {"groups": ["G1", "G2", "G10"], "sizes": ["XS", "S"]},
        "kind": "small",
        "readability": "Slightly worse: an index expression plus an eslint-disable carrying its reason.",
    },
    {
        "name": "pipe-steps-loop",
        "description": "pipe: builds the per-function step array with `for...of` + `push` instead of `functions.map` with a closure (once per multi-function pipe call, lazy or not).",
        "targets": {"groups": ["G1", "G2", "G3", "G10"], "sizes": ["XS", "S"]},
        "kind": "small",
        "readability": "Neutral: a 3-line loop plus a why-comment (the comment between declaration and loop also keeps unicorn/prefer-array-from-map from firing).",
    },
    {
        "name": "pipe-hoist-step-count",
        "description": "pipe processItem: reads `lazySequence.length` once per item instead of on every step iteration (the evaluator calls keep the compiler from hoisting it).",
        "targets": {"groups": ["G1", "G2", "G10"], "sizes": ["C", "M", "L"]},
        "kind": "small",
        "readability": "Neutral: one local and a one-line why.",
    },
    {
        "name": "pipe-skip-identity",
        "description": "pipe processItem: `result === SKIP_ITEM` identity check before `isLazyControl`, so this copy's skips (filter/find misses, unique duplicates, drop) bypass the `in` probe and the control reads; another copy's SKIP still goes through `isLazyControl`.",
        "targets": {"groups": ["G1", "G1b", "G2", "G10"], "sizes": ["S", "C", "M", "L"]},
        "kind": "small",
        "readability": "Neutral: one early return with a 3-line why.",
    },
    {
        "name": "pipe-array-index-loop",
        "description": "pipe processIterable (multi-step runs): indexed loop when the input is an array, `for...of` otherwise. Adds a pipe test pulling a fused run from an infinite generator (covers the non-array branch).",
        "targets": {"groups": ["G1", "G1b", "G2", "G4", "G10"], "sizes": ["S", "C", "M", "L"]},
        "kind": "small",
        "readability": "Slightly worse: the 10-line loop body appears twice, with an eslint-disable (prefer-for-of, no-for-loop) carrying the reason.",
    },
    {
        "name": "pipe-isarray-first",
        "description": "pipe isIterable: `Array.isArray` first, ahead of the string check and the `Symbol.iterator in` lookup (once per run or single-step call). Adds a lone-step generator test, since arrays no longer cover the `in` branch.",
        "targets": {"groups": ["G1", "G1b", "G2", "G4", "G10"], "sizes": ["XS", "S"]},
        "kind": "small",
        "readability": "Neutral: one extra disjunct with a one-line why.",
    },
    {
        "name": "pipe-on-demand-segments",
        "description": "pipe: builds each run of lazy steps when the loop reaches it with iterable data (`buildLazySequence` replaces `extractLazySequence`) instead of building every step up front, so non-lazy pipes allocate nothing and interleaved pipes skip the up-front array and closure. Covers the 'no lazySteps array for non-lazy pipes' idea. Evaluators are now constructed when their run starts rather than at pipe start (observable only if an earlier non-lazy step mutates a later lazy step's arguments).",
        "targets": {"groups": ["G3", "G10", "G1", "G2"], "sizes": ["XS", "S", "C"]},
        "kind": "small",
        "readability": "Neutral to better: one array and one indirection fewer; the main loop reads the same.",
    },
    {
        "name": "pipe-single-step-runs",
        "description": "pipe-on-demand-segments plus: a lazy run of exactly one function (common between non-lazy steps) goes through processSingleLazyStep instead of step objects. The single-function early return stays, with its comment reworded (it cited a 7% cost of a second processing call in the loop, which this variant adds; that cost is what this variant measures).",
        "targets": {"groups": ["G10", "G1", "G2", "G3"], "sizes": ["XS", "S", "C", "M"]},
        "kind": "small",
        "readability": "Slightly worse: one more branch (three conditions) in the main loop, with a why-comment.",
    },
    {
        "name": "single-skip-identity",
        "description": "processSingleLazyStep: `result === SKIP_ITEM` identity check before `isLazyControl` (lone lazy steps, data-first purryFromLazy utilities, data-last calls outside pipe).",
        "targets": {"groups": ["G1b", "G4", "G5", "G6"], "ids": "filter|find|drop|unique|difference|intersection", "sizes": ["S", "C", "M", "L"]},
        "kind": "small",
        "readability": "Neutral: one `continue` with a 3-line why.",
    },
    {
        "name": "single-skip-first",
        "description": "processSingleLazyStep: control switch ordered skip, many, last (by frequency) instead of many, last, skip.",
        "targets": {"groups": ["G1b", "G4", "G5", "G6"], "ids": "filter|find|drop|unique|difference|intersection|flat", "sizes": ["S", "C", "M", "L"]},
        "kind": "small",
        "readability": "Neutral: case order plus a 3-line why.",
    },
    {
        "name": "single-array-index-loop",
        "description": "processSingleLazyStep: indexed loop for arrays (the position doubles as the evaluator's index), `for...of` for other iterables; the control handling moves into a module-level `collect` helper shared by both loops (one more call per item, which the optimizer inlines). Adds a lone-step generator test.",
        "targets": {"groups": ["G1b", "G4", "G5", "G6"], "sizes": ["S", "C", "M", "L"]},
        "kind": "small",
        "readability": "Slightly worse: two short loops and a helper instead of one loop (the file-level eslint-disable goes away).",
    },
    {
        "name": "requiredata-positional-index",
        "description": "requireDataByArity: `dataParameterIndex` becomes a positional defaulted parameter instead of a destructured options object defaulting to `{}` (one object per step construction saved); zipWith and mapWithFeedback pass a commented `DATA_PARAMETER_INDEX` constant. The remeda-utility skill's implementation.md still documents the options form.",
        "targets": {"groups": ["G1", "G1b", "G2", "G5", "G10"], "sizes": ["XS", "S"]},
        "kind": "small",
        "readability": "Neutral: call sites pass a named constant instead of an options object.",
    },
    {
        "name": "requiredata-direct-write",
        "description": "requireData: stamps `requiresData` with a direct property write (one `@ts-expect-error [ts2540]` for the read-only marker) instead of `Object.assign` with a temporary object. Runs for every step whose callback may read `data` (length 0 or > 2) and for uniqueWith.",
        "targets": {"groups": ["G9", "G1", "G1b", "G5"], "sizes": ["XS", "S"]},
        "kind": "small",
        "readability": "Neutral: two statements instead of one expression, with a justified suppression.",
    },
    {
        "name": "purry-arity-calls",
        "description": "purry and purryWithLazy: data-first calls go through a new `callWithArguments(fn, args)` helper that switches on `args.length` (0-3 passed directly, spread beyond) instead of `fn(...args)`. Adds a unit test for the helper.",
        "targets": {"groups": ["G5", "G7"], "sizes": ["XS", "S", "C"]},
        "kind": "small",
        "readability": "Slightly worse: a new 30-line helper with a switch (and a no-magic-numbers disable on `case 3`); the call sites keep their shape.",
    },
    {
        "name": "datalast-arity-closures",
        "description": "lazyDataLastImpl: the data-last function is created per arity (0-2 extra arguments passed directly, spread beyond) instead of always `(data) => fn(data, ...args)`. Adds a lazyDataLastImpl unit test covering every arity.",
        "targets": {"groups": ["G6", "G3", "G10", "G7"], "sizes": ["XS", "S"]},
        "kind": "small",
        "readability": "Slightly worse: a 4-case factory instead of a one-line closure.",
    },
    {
        "name": "datalast-direct-props",
        "description": "lazyDataLastImpl and purryFromLazy: attach `lazy`/`lazyArgs` with two direct property writes (TS expando properties, no suppression) instead of `Object.assign` with a temporary object. Runs for every lazy utility's data-last call, i.e. every lazy step of every pipe.",
        "targets": {"groups": ["G1", "G1b", "G2", "G4", "G6", "G9", "G10"], "sizes": ["XS", "S"]},
        "kind": "small",
        "readability": "Neutral to better: plain assignments.",
    },
    {
        "name": "lazy-args-arity",
        "description": "pipe buildLazyStep and processSingleLazyStep: build the evaluator with `callWithArguments(lazy, lazyArgs)` (switch on argument count) instead of `lazy(...lazyArgs)`. Adds the same helper (and test) as purry-arity-calls.",
        "targets": {"groups": ["G1", "G1b", "G2", "G4", "G5", "G6", "G10"], "sizes": ["XS", "S"]},
        "kind": "small",
        "readability": "Neutral at the call sites; adds the helper from purry-arity-calls.",
    },
    {
        "name": "purryfromlazy-slice",
        "description": "purryFromLazy data-first: `args[0]` and `args.slice(1)` instead of `const [data, ...rest] = args` (a destructuring rest element runs the iterator protocol).",
        "targets": {"groups": ["G5"], "ids": "unique|difference|intersection|mapWithFeedback", "sizes": ["XS", "S"]},
        "kind": "small",
        "readability": "Neutral.",
    },
    {
        "name": "map-callback-as-evaluator",
        "description": "map: when the callback can't read `data` (arity 1-2), the callback itself is the evaluator, saving a call per item per map step; data-reading callbacks keep the stamped wrapper and the callback is never stamped. Splits a `canReadData` predicate out of requireDataByArity, and makes pipe call evaluators without a receiver (otherwise a `function` callback would see the step object as `this`). Adds map tests: the callback is never marked, and is called without a receiver (red without the pipe change).",
        "targets": {"groups": ["G1", "G1b", "G2", "G4", "G8", "G10"], "ids": "map", "sizes": ["S", "C", "M", "L"]},
        "kind": "small",
        "readability": "Neutral: a ternary between the wrapper and the callback with a why-comment, one more exported predicate in requireData.ts, a destructured evaluator call in pipe.",
    },
    {
        "name": "unique-single-lookup",
        "description": "unique and uniqueBy evaluators: `add` then compare `size` (one hash lookup per item) instead of `has` then `add` (two per new item).",
        "targets": {"groups": ["G1", "G1b", "G4", "G5", "G6"], "ids": "unique", "sizes": ["C", "M", "L"]},
        "kind": "small",
        "readability": "Slightly worse: the size idiom is less direct than has/add; a two-line comment explains it.",
    },
    {
        "name": "first-index-access",
        "description": "first data-first: `data[0]` instead of destructuring the parameter (`([item]) => item` runs the iterator protocol). Out-of-contract change: a non-array iterable passed data-first (already a type error) would now give `undefined`.",
        "targets": {"groups": ["G5"], "ids": "(^| )first( |$)", "sizes": ["XS", "S", "C"]},
        "kind": "small",
        "readability": "Neutral.",
    },
    {
        "name": "identity-controls",
        "description": "Controls become four registered symbols under new keys ($$remedaLazySkip/Stop/Last/Many) compared by identity; LAST and MANY payloads go into a slot owned by the running pipe (one per run, created in processIterable / processSingleLazyStep) and passed to evaluators as a 4th argument. isLazyControl and its `in` probe are gone, and fan-out allocates nothing per item. find, first, take, flatMap, flat, intersection, zip and zipWith take the slot; many+done is no longer expressible (no utility used it; its two tests are removed). Tests: the cross-copy test is ported to filter, find and flatMap from a `vi.resetModules()` copy, including a fused run (red with unregistered symbols); new 'items are never probed' test (has/get traps never fire; red on the base); the lookalike test now uses an unregistered symbol with the same description.",
        "targets": {"groups": ["G1", "G1b", "G2", "G4", "G5", "G6", "G8", "G9", "G10"], "sizes": ["XS", "S", "C", "M", "L"]},
        "kind": "design",
        "readability": "Neutral to better in pipe (an identity if-chain instead of a type guard plus switch); evaluators that stop or fan out gain a `slot` parameter; the remeda-utility skill's protocol docs would need updating.",
    },
    {
        "name": "sentinel-pure",
        "description": "Narrowed UNEXPECTED_ACCESS_SENTINEL: throws only on array use (array-index keys, any key in Array.prototype incl. `length` and Symbol.iterator, ownKeys, every write trap); other get/has/getOwnPropertyDescriptor reads find nothing; getPrototypeOf and isExtensible are left to the target (reports Object.prototype). Shorter message. `/* #__PURE__ */` on `new Proxy` (the `#` spelling avoids jsdoc/no-bad-blocks; bundlers read both). Checked: tsdown's minified dist strips the annotation (both spellings, also with outputOptions.comments.annotation), so it only helps consumers of the TS source. requireData.test.ts: placeholder probes (get, in, hasOwn) don't throw; length, index, iteration, map, at, own index lookup, writes, defineProperty and delete throw.",
        "targets": {"groups": ["G1", "G1b", "G9"], "sizes": ["XS", "S"]},
        "kind": "sentinel",
        "readability": "Neutral: three small trap arrows and a key predicate replace the uniform alwaysThrow handlers.",
    },
    {
        "name": "sentinel-module",
        "description": "Same narrowed traps and message as sentinel-pure, without the annotation; the sentinel, its message and traps move to src/internal/unexpectedAccessSentinel.ts, imported only by pipe.ts and processSingleLazyStep.ts, while requireData.ts keeps requireData/requireDataByArity. Sentinel tests move to unexpectedAccessSentinel.test.ts; requireData.test.ts now tests the two markers. Checked: an esbuild bundle of data-first `map` alone drops the sentinel (1150 B -> 385 B; base and sentinel-pure keep it).",
        "targets": {"groups": ["G1", "G1b", "G9"], "sizes": ["XS", "S"]},
        "kind": "sentinel",
        "readability": "Better: the sentinel has its own module and requireData.ts only marks evaluators.",
    },
]

SEMANTIC = {
    frozenset({"identity-controls", "map-callback-as-evaluator"}): "semantic: with the slot protocol a user callback used as the evaluator would receive the slot as a 4th argument",
    frozenset({"pipe-on-demand-segments", "pipe-single-step-runs"}): "pipe-single-step-runs already contains pipe-on-demand-segments",
    frozenset({"sentinel-module", "sentinel-pure"}): "alternative packagings of the same sentinel",
}


def patch_files(name):
    created, touched = set(), set()
    lines = (V / f"{name}.patch").read_text().splitlines()
    for index, line in enumerate(lines):
        if line.startswith("+++ b/"):
            path = line[6:].split("\t")[0]
            touched.add(path)
            if lines[index - 1].startswith("--- a/") and "1970-01-01" in lines[index - 1]:
                created.add(path)
    return created, touched


def applies(onto, name, fuzz):
    args = ["patch", "-p1", "--dry-run"] + (["-F0"] if fuzz == 0 else [])
    with open(V / f"{name}.patch") as stdin:
        result = subprocess.run(args, cwd=C / onto, stdin=stdin, capture_output=True, text=True)
    output = (result.stdout + result.stderr).lower()
    return result.returncode == 0 and not re.search(
        r"fail|reject|reversed|previously applied|malformed|can't", output
    )


names = [variant["name"] for variant in VARIANTS]
assert sorted(names) == sorted(path.stem for path in V.glob("*.patch")), "index and patches disagree"

if C.exists() and C.parent == TMP:
    shutil.rmtree(C)
for name in names:
    target = C / name
    target.mkdir(parents=True)
    base = V / ".base/packages/remeda"
    shutil.copytree(base / "src", target / "src")
    shutil.copytree(base / "test", target / "test")
    with open(V / f"{name}.patch") as stdin:
        subprocess.run(["patch", "-p1", "-s"], cwd=target, stdin=stdin, check=True)

info = {name: patch_files(name) for name in names}
conflicts = {name: {} for name in names}
for position, first in enumerate(names):
    for second in names[position + 1 :]:
        reason = None
        same_new = info[first][0] & info[second][0]
        shared = info[first][1] & info[second][1]
        if same_new:
            reason = "both add " + ", ".join(sorted(same_new)) + " (identical); BSD patch duplicates a new file's content when it already exists, so drop those sections from the second patch"
        elif shared and (not applies(first, second, 2) or not applies(second, first, 2)):
            reason = "rejects in " + ", ".join(sorted(shared))
        elif shared and (not applies(first, second, 0) or not applies(second, first, 0)):
            reason = "applies only with fuzz in " + ", ".join(sorted(shared))
        semantic = SEMANTIC.get(frozenset({first, second}))
        if semantic is not None:
            reason = semantic if reason is None else f"{reason}; {semantic}"
        if reason is not None:
            conflicts[first][second] = reason
            conflicts[second][first] = reason

summary_path = V / ".verify/summary.txt"
results = {}
if summary_path.exists():
    for line in summary_path.read_text().splitlines():
        if ": " in line:
            name, status = line.split(": ", 1)
            results[name] = status

index = []
for variant in VARIANTS:
    name = variant["name"]
    status = results.get(name, "not verified")
    entry = {
        "name": name,
        "patch": f"{name}.patch",
        "description": variant["description"],
        "targets": variant["targets"],
        "kind": variant["kind"],
        "tests": "pass" if status.startswith("pass") else status,
        "readability": variant["readability"],
        "conflicts": conflicts[name],
    }
    index.append(entry)

text = json.dumps(index, indent=2) + "\n"
assert all(ord(character) < 128 for character in text), "non-ASCII in index.json"
(V / "index.json").write_text(text)
print(f"wrote {len(index)} entries")
for entry in index:
    print(f"{entry['name']}: tests={entry['tests']} conflicts={len(entry['conflicts'])}")
