# Typing

If you weren't using the `strict` variant, the function now only checks for
`undefined` values and **not** `null` values. If you still need to check for
both values use [`isNonNullish`](/docs/#isNonNullish) instead. If you are
already using `strict` simply remove the `.strict` suffix.

## Examples

### Strict variant removed

```ts
// Was
filter(DATA, isDefined.strict);

// Now
filter(DATA, isDefined);
```

### Nulls are accepted

```ts
const filtered = filter([] as (string | null | undefined)[], isDefined);
//    ^? (string | null)[], Was: string[]
```

### Legacy typing

```ts
// Was
filter(DATA, isDefined);

// Now
filter(DATA, isNonNullish);
```
