---
category: Array
remeda: intersection
---

In Remeda `intersection` treats the inputs as multisets/bags which respect
**item duplication**, whereas in Lodash the result is always de-dupped. This only
matters for cases where _both_ arrays might have duplicate values. To achieve
the same output pass the result to [`unique`](/docs#unique).

### No duplicates

```ts
// Lodash
intersection([2, 1], [2, 3]);

// Remeda
intersection([2, 1], [2, 3]);
```

### With duplicates

```ts
// Lodash
intersection([1, 1], [1, 1]);

// Remeda
unique(intersection([1, 1], [1, 1]));
```
