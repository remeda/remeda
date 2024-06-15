---
category: Relation
remeda: firstBy
---

The Remeda `firstBy` returns what would be the first item in an array if it was
sorted by the order criteria (without actually sorting the array). Ramda's
`maxBy` could be rebuilt using `firstBy` by taking the mapping function in
descending order, and wrapping the 2 arguments with an array.

```ts
// Ramda
maxBy(mapperFunc, a, b);

// Remeda
firstBy([a, b], [mapperFunc, "desc"]);
```
