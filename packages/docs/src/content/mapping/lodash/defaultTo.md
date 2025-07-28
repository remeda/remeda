---
category: Util
remeda: defaultTo
---

- `Number.NaN` is not considered nullish and would not result in returning the
  default value. Use [`when`](/docs#when) with the built-in [`Number.isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)
  and a [`constant`](/docs#constant) for the fallback value.
- Unlike in Remeda, Lodash allows the fallback value to be of any type, even
  those that are incompatible with the data type. It also allows the data type
  to be non-nullish; for those cases use the built-in [Nullish coalescing operator `??`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
  directly, or use [`when`](/docs#when) with [`isNullish`](/docs#isNullish) and
  [`constant`](/docs#constant).

### Nullish

```ts
const DATA: number | undefined | null;

// Lodash
_.defaultTo(DATA, 456);

// Remeda
defaultTo(DATA, 456);
```

### NaN

```ts
const DATA = Number.NaN;

// Lodash
defaultTo(DATA, 10);

// Remeda
when(DATA, Number.isNaN, constant(10));
```

### Both

```ts
const DATA: number | null | undefined;

// Lodash
defaultTo(DATA, 10);

// Remeda
when(
  DATA,
  (x) => x === undefined || x === null || Number.isNaN(x),
  constant(10),
);
```

### Non-matching fallback

```ts
const DATA: string | null | undefined;

// Lodash
defaultTo(DATA, 123);

// Remeda
when(DATA, isNullish, constant(123));

// or natively
DATA ?? 123;
```
