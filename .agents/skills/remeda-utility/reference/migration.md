# Migration Mappings

Remeda hosts per-function migration pages for Lodash, Ramda, and Just users at stable URLs keyed by the upstream function name: what a developer lands on after searching "lodash difference remeda". Each page **answers one question** for a developer looking at a single call site: "if I swap this call for Remeda, what changes?" Every convention below follows from that.

To find out whether a function has a counterpart, scan each library's `__MISSING.md` (functions Remeda doesn't map yet) and search the upstream docs.

## File location

`packages/docs/src/content/mapping/<library>/<functionName>.md`, where `<library>` is `lodash`, `ramda`, or `just`, and `<functionName>` is the **upstream** name, since users arrive searching for it. A Remeda function matching several libraries gets a file in each.

## Frontmatter

```markdown
---
category: CategoryName
remeda: functionName
---
```

- `category`: the function's category **in the upstream library**, even when Remeda groups it differently, so migrators browse the way they already think.
- `remeda`: the Remeda function name, set **only for a high-degree match**. Omit it when the page explains what to do instead (typically a composition or native JS).

## Body: bullets, then examples

### 1. Differences (bullet list at the top)

One concern per bullet, written **to the migrator at a specific call site**, who has minimal context on Remeda and on the surrounding code and wants to know what the swap does to _this line_. Bullets **reassure, guide, or caution**, tersely, without preamble or philosophy.

When a bullet mentions a gap that another Remeda function or a composition fills, link to it instead of describing it:

- `[functionName](/docs#functionName)` for Remeda functions.
- MDN, or other external docs, for anything outside Remeda.

Never link other migration pages (e.g., the `range.md` mapping must not mention `rangeRight.md`): each page assumes the reader is migrating exactly the function it's named for.

### 2. Examples (one `####` heading per example, below the bullets)

Each example is a `####` heading followed by a single fenced `ts` code block, so each is independently scannable; don't stack examples in one block separated by `// Section` comments. Comment headers label the sides:

```ts
// Lodash
_.functionName(args);

// Remeda
functionName(args);
```

- The upstream side is `// Lodash`, `// Ramda`, or `// Just`.
- The other side is `// Remeda`, or `// Native` (or `// Or directly via Native JS:`) when the migration is to plain JavaScript.

Use concrete values (`[1, 2, 3]`) or placeholders (`data`, `predicate`), whichever makes the delta clearer: concrete tends to win when the _behavior_ differs, placeholders when the _shape_ of the call differs.

Examples generally pair 1:1 with the bullets, in the same order. A single example still gets its heading.

## Cleanup

Remove the function from `__MISSING.md` in the same directory. If it isn't listed there, double-check the upstream docs: the upstream name may be wrong, or the function may not exist there.

## Reference examples

- `packages/docs/src/content/mapping/lodash/difference.md`: several semantically distinct migration cases (duplicates, multi-arg, missing param, nullish).
- `packages/docs/src/content/mapping/lodash/defaultTo.md`: subtly different semantics (NaN handling).
