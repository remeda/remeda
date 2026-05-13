# Migration Mappings

Remeda hosts per-function migration pages for Lodash, Ramda, and Just users on the docs site. Each page sits at a stable URL keyed by the upstream function name, and is what a developer lands on when they search "lodash difference remeda" or similar. The page exists to **answer one question** for a developer staring at a single call site: "if I swap this Lodash/Ramda/Just call for Remeda, what changes?"

That framing drives every convention below.

## When this applies

This reference covers two situations:

- **Authoring a new Remeda function** with a Lodash / Ramda / Just equivalent — write a mapping page for each library it matches before the change ships.
- **Editing an existing mapping file** under `packages/docs/src/content/mapping/{lodash,ramda,just}/` — the conventions in this file apply.

If you don't know whether the new function has a counterpart, scan each library's `__MISSING.md` (it lists functions Remeda doesn't yet map) and search the upstream docs. Genuinely novel functions skip this step entirely.

## File location

```
packages/docs/src/content/mapping/<library>/<functionName>.md
```

`<library>` is `lodash`, `ramda`, or `just`. `<functionName>` is the **upstream** function's name (since users land here by searching the name from the library they're leaving). If the same Remeda function maps to multiple libraries, each gets its own file.

## Frontmatter

```markdown
---
category: CategoryName
remeda: functionName
---
```

- `category` — the function's category **in the upstream library**, even when Remeda groups it differently. The mapping directory is organized by the upstream's mental model so migrators can browse the way they already think.
- `remeda` — the Remeda function name, set **only when there's a high-degree match**. Omit it when the upstream function has no clean Remeda equivalent and the page exists only to explain what to do instead (typically via composition or native JS).

## Body — bullets, then examples

The body is two stacked sections, in this order:

### 1. Differences (bullet list at the top)

A list of concerns, one per bullet. Each bullet is written **to the migrator reading a specific call site** — assume they have minimal context on Remeda, minimal context on the surrounding code in their own project, and want to know what this swap will do to _this line_. Bullets exist to **reassure, guide, or caution**. Keep them concise and terse — no preamble, no philosophy.

When a bullet mentions a gap that another Remeda function or a composition fills, link to the destination — don't describe it in prose. Use:

- `[functionName](/docs#functionName)` for other Remeda functions.
- MDN URLs for native JS features.
- Other external docs where appropriate.

The links keep each migration page self-contained while letting the reader drill in if they need to. Do **not** cross-reference other migration pages (e.g., the `range.md` mapping must not mention `rangeRight.md`). Each page assumes the reader is migrating exactly the function it's named for.

### 2. Examples (one `####` heading per example, below the bullets)

Each example is a `####` heading followed by a single fenced `ts` code block. Don't stack multiple examples inside one block separated by `// Section` comments — each example must be independently scannable.

Inside the code block, use comment headers to label the before/after sides:

```ts
// Lodash
_.functionName(args);

// Remeda
functionName(args);
```

- The upstream side is labelled `// Lodash`, `// Ramda`, or `// Just`.
- The Remeda side is labelled `// Remeda`, or `// Native` (or `// Or directly via Native JS:`) when the migration is to plain JavaScript rather than a Remeda call.

Examples can use concrete values (`[1, 2, 3]`) or generic placeholders (`data`, `predicate`) — pick whichever makes the migration delta clearer. Concrete tends to win when the _behavior_ differs; generic tends to win when the _shape_ of the call differs.

Examples should generally pair 1:1 with the bullets above and follow the same order. When there's only one example the heading is still required for consistency.

## Cleanup

Once the mapping file is written, remove its function from `__MISSING.md` in the same directory. If no matching line exists in `__MISSING.md`, double-check against the upstream library's docs — you may have the wrong upstream name, or the function may not actually exist there.

## Reference examples to model on

When in doubt, read these existing mapping files end-to-end:

- `packages/docs/src/content/mapping/lodash/difference.md` — multi-example file with semantically distinct migration cases (duplicates, multi-arg, missing param, nullish).
- `packages/docs/src/content/mapping/lodash/defaultTo.md` — shows how to handle a function whose semantics differ in subtle ways (NaN handling).

They demonstrate every convention in this file in production form.
