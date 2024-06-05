---
category: Collection
---

_Not provided by Remeda._

This function could be recreated in Remeda via a combination of several
utilities: [`groupBy`](/docs#groupBy), [`mapValues`](/docs#mapValues), and
[`length`](/docs#length). We acknowledge that the composed solution is less
efficient; if you need this function please open an issue at the Remeda github
project to get it added.

```ts
// Lodash
countBy(DATA, groupingFunction);

// Remeda
mapValues(groupBy(DATA, groupingFunction), length());

// Or as a pipe
pipe(DATA, groupBy(groupingFunction), mapValues(length()));
```
