---
category: Object
remeda: merge
---

In Lodash `assign` can be used to merge any number of objects by accepting a
variadic argument list. In Remeda, if you are merging only 2 objects use
`merge`, but if you need to merge more than 2 objects use
[`mergeAll`](/docs#mergeAll) instead, which takes an _Array_ of objects.

```ts
// Lodash
assign(a, b);
assign(a, b, c, d, e);

// Remeda
merge(a, b);
mergeAll([a, b, c, d, e]);
```
