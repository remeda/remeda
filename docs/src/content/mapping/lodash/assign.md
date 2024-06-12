---
category: Object
remeda: merge
---

- In Lodash the merge is done in-place, on the first argument to the function.
  In Remeda a new object is always returned, and none of the input objects are
  mutated.
- In Lodash `assign` can be used to merge any number of objects by accepting a
  variadic argument list. In Remeda, if you are merging only 2 objects use
  `merge`, but if you need to merge more than 2 objects use
  [`mergeAll`](/docs#mergeAll) instead, which takes an _Array_ of objects.

```ts
// Lodash
const DATA = { a: 1, b: 2 };
assign(DATA, b);
assign(DATA, b, c, d, e);

// Remeda
let DATA = { a: 1, b: 2 };
DATA = merge(DATA, b);
DATA = mergeAll([DATA, b, c, d, e]);
```
