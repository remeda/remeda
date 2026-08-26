---
category: Logic
remeda: isNot
---

- Unlike Ramda's `complement`, `isNot` preserves type predicates: negating a
  type-guard returns a type-guard which _excludes_ the guarded type, so the
  result of [`filter`](/docs#filter) stays narrowed.
- Ramda's `complement` preserves the arity of the function it wraps, and the
  result stays curried. `isNot` only takes a single-parameter predicate and
  passes just the first argument through; wrap multi-parameter functions with
  the native [logical NOT operator `!`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT)
  instead.
- Ramda's `complement` negates the _truthiness_ of any return value, whereas
  `isNot` requires a predicate that returns a `boolean`. Compose with
  [`isTruthy`](/docs#isTruthy) to get the Ramda semantics.

#### Predicates

```ts
// Ramda
complement(predicate);

// Remeda
isNot(predicate);
```

#### Filtering

```ts
// Ramda
filter(complement(is(String)), DATA);

// Remeda
filter(DATA, isNot(isString));
```

#### Multiple parameters

```ts
// Ramda
complement(isGreaterThan);

// Native
(a: number, b: number) => !isGreaterThan(a, b);
```

#### Non-boolean predicates

```ts
// Ramda
complement(getLength);

// Remeda
isNot(piped(getLength, isTruthy));

// Or directly via Native JS:
(data: string) => !getLength(data);
```
