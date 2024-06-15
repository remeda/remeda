---
category: Relation
remeda: firstBy
---

The Remeda `firstBy` returns what would be the first item in an array if it was
sorted by the order criteria (without actually sorting the array). Ramda's
`minBy` could be rebuilt using `firstBy` by taking the mapping function in, and
wrapping the 2 arguments with an array.

```ts
// Ramda
minBy(mapperFunc, a, b);

// Remeda
firstBy([a, b], mapperFunc);
```
