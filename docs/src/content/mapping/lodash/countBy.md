---
category: Collection
---

_Not provided by Remeda._

This function could be recreated in Remeda via a composition of [`groupBy`](/docs#groupBy),
[`mapValues`](/docs#mapValues), and [`length`](/docs#length). We acknowledge
that this is less efficient than a singular implementation; if you need this
function please open an issue at the Remeda GitHub project to get it added.

```ts
// Lodash
countBy(DATA, groupingFunction);

// Remeda
mapValues(groupBy(DATA, groupingFunction), length());

// Or as a pipe
pipe(DATA, groupBy(groupingFunction), mapValues(length()));
```
