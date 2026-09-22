---
category: Function
remeda: isNot
---

- Unlike Lodash's `negate`, `isNot` preserves type predicates: negating a
  type-guard returns a type-guard which _excludes_ the guarded type, so the
  result of [`filter`](/docs#filter) stays narrowed.
- Lodash's `negate` forwards every argument it receives to the predicate, and
  invokes it with the same `this`. `isNot` only takes a single-parameter
  predicate and passes just the first argument through; wrap multi-parameter
  functions with the native [logical NOT operator `!`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT)
  instead.
- Lodash's `negate` negates the _truthiness_ of any return value, whereas
  `isNot` requires a predicate that returns a `boolean`. Compose with
  [`isTruthy`](/docs#isTruthy) to get the Lodash semantics.

#### Predicates

```ts
// Lodash
_.negate(predicate);

// Remeda
isNot(predicate);
```

#### Filtering

```ts
// Lodash
_.filter(DATA, _.negate(_.isString));

// Remeda
filter(DATA, isNot(isString));
```

#### Multiple parameters

```ts
// Lodash
_.negate(isGreaterThan);

// Native
(a: number, b: number) => !isGreaterThan(a, b);
```

#### Non-boolean predicates

```ts
// Lodash
_.negate(getLength);

// Remeda
isNot(piped(getLength, isTruthy));

// Or directly via Native JS:
(data: string) => !getLength(data);
```
