---
category: Array
remeda: filter
---

_Not provided by Remeda._

Use `filter` with the following predicate instead:

```ts
// Lodash
sortedUniq(DATA);

// Remeda
filter(DATA, (item, index, array) => index === 0 || item !== array[index - 1]);
```
