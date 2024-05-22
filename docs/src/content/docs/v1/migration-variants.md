---
title: "Variants"
category: "Migrating to v2"
slug: "migration-variants"
priority: 20
---

# Variants

In v1 Remeda offered several "variants" of the base runtime implementation and
of the base typing via props added to the exported function. These have been
removed in v2, and their usage merged into the base functions.

## Indexed

The `indexed` variant allowed callback functions (predicates, mappers, etc...)
to use 2 additional parameters in their signature, the `index` which represented
the offset of the item within the data array, and the `data` array itself. These
were provided to most functions, but weren't offered consistently in all
functions that could support it. The implementation added runtime checks on
every invocation, even when the `indexed` variant wasn't used. In v2 the indexed
"variant" of the callback is now available on the base implementation. It was
also added to all functions. Lastly, this was done to align with the signatures
of the built-in functions of `Array.prototype`.

```ts
const DATA = [1, 2, 3] as const;

// Was
map.indexed(DATA, (item, index) => item + index);

// Now
map(DATA, (item, index) => item + index);
```

### Migration

For calls that used the indexed variant simply remove the `.indexed` suffix. For
the rest, you _most likely_ don't need to do anything.

**But there is one caveat we recommend paying attention to:** If the callback
function was passed **by reference** and not via an inline function, your
callback function would now be called with additional parameters. If the
function signature **no longer matches** the callback signature typescript would
complain about the type mismatch. _In a more complex case though,_ if the
function signature **does match** then it will now be called with additional
parameters and might compute results differently. This is very rare and can only
happen if the callback function already accepted an _optional_ `number` or
`number | undefined` as it's **second** parameter. To fix this simply wrap the
callback with an inline function that takes a single parameter. ESLint's Unicorn
plugin's [unicorn/no-array-callback-reference](https://github.com/sindresorhus/eslint-plugin-unicorn/blob/main/docs/rules/no-array-callback-reference.md) is recommended to detect potential cases
of this issue.

```ts
const DATA = ["1", "2", "3"] as const;

// BUG! `parseInt` takes an optional 2nd `number` param for the radix!
map(DATA, Number.parseInt); //=> [1, NaN, NaN]

// Fix:
map(DATA, (item) => Number.parseInt(item)); //=> [1, 2, 3]
```
