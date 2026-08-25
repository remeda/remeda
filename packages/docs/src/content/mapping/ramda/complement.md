---
category: Logic
remeda: isNot
---

- Unlike Ramda's `complement`, `isNot` preserves type predicates: negating a
  type-guard returns a type-guard which _excludes_ the guarded type, so the
  result of [`filter`](/docs#filter) stays narrowed.

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
