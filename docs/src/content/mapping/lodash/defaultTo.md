---
category: Util
remeda: branch
---

- Use Remeda's [`branch`] with [`isNullish`](/docs#isNullish) as the predicate
  and the fallback value wrapped with [`constant`](/docs#constant).
- For defaulting `NaN` values use the built-in [`Number.isNaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/isNaN)
  instead.
- For both you'd need to construct a type-guard manually.

### Nullish

```ts
// Lodash
defaultTo(DATA, 10);

// Remeda
branch(DATA, isNullish, constant(10));
```

### NaN

```ts
// Lodash
defaultTo(DATA, 10);

// Remeda
branch(DATA, Number.isNaN, constant(10));
```

### Both

```ts
// Lodash
defaultTo(DATA, 10);

// Remeda
branch(
  DATA,
  (x) => x === undefined || x === null || Number.isNaN(x),
  constant(10),
);
```
