---
title: "Removed Variants"
category: "Migrating to v2"
slug: "migration-variants"
priority: 20
---

# Removed Variants

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

## Strict

We sometimes come up with improved typing for a function's return value. The
type is often more complex and makes more assumptions on the inputs, making it
incompatible with the existing type. In these cases we created a `strict`
variant which had the same runtime implementation, but with improved typing. In
v2 we made all strict variants the default, removing the original base typing.

This change can result in downstream assumptions on types to break or become
invalid. In most cases we believe these to be valid typing issues which are
being surfaced for the first time because of the improved typing.

```ts
const DATA = ["1", "2", "3"] as const;

const was = map(DATA, (item) => Number.parseInt(item));
//    ^? number[];

const now = map(DATA, (item) => Number.parseInt(item));
//    ^? [number, number, number]
```

### Migration

For calls that used the strict variant simply remove the `.strict` suffix. For
the rest, you _most likely_ don't need to do anything.

If you encounter new typescript issues following this change we recommend first
checking if this issue is the result of the better typing. Notice that if you
use inferred typing a lot the issue might only surface further downstream and
not at the place the function is called.

**To bypass the issue or workaround them**:

- The function-specific migration guides below also suggest possible type
  assertions that could be used to get the "legacy" types back.
- Simplify the types by using the typescript `satisfies` keyword instead of
  `as const`.
- You can use explicit, less specific types, in the generics of the functions to
  force them to a specific type instead of the inferred type.
- Most of the new types should be extendable by the old types, meaning you can
  cast the _output_ to the type you expect in order to simplify the result.
- Some new types might be hard to read and understand via the IDE's tooltips, in
  those cases you can use Type-Fest's [`Simplify`](https://github.com/sindresorhus/type-fest/blob/main/source/simplify.d.ts)
  to debug the resulting type (in most cases we already wrap the types with
  Simplify).

**Important**: The types might have edge cases that we didn't forsee and test
against. If you feel that the computed type is _wrong_ please [report it over on
GitHub](https://github.com/remeda/remeda/issues).

```ts
// Downstream bugs revealed:

// @ts-expect-error [ts(2493)]Tuple type '[number]' of length '1' has no element at index '1'.
const [, buggy] = map(["1"] as const, (x) => Number.parseInt(x));

// Get the legacy behavior:

const strict = map(["1", "2", "3"] as const, (x) => Number.parseInt(x));
//    ^? [number, number, number]

const satisfied = map(["1", "2", "3"] satisfies `${number}`[], (x) =>
  //  ^? number[];
  Number.parseInt(x),
);

const casted = map(["1", "2", "3"] as `${number}`[], (x) =>
  //  ^? number[];
  Number.parseInt(x),
);

const castedOutput = map(["1", "2", "3"] as const, (x) =>
  Number.parseInt(x),
) as number[];
```

## Lazy (_Internal_)

The `lazy` variant _wasn't documented_ but still existed on many functions.
Unlike the previous variants, it wasn't another implementation of the function,
but a tool used internally by the `purry` and `pipe` functions to allow lazy
evaluation of functions. This abstraction was completely removed.

### Migration

If you exported a `lazy` prop from your **internal** functions to make them lazy
within Remeda's `pipe`, Use `purry` with the lazy implementation as the 3rd
parameter instead.

We consider this API internal and thus don't provide documentation or export
the types and utilities that would make it easier to work with (the ones we use
internally). If you need these APIs please [open an issue over on GitHub](https://github.com/remeda/remeda/issues).
