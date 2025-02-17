---
category: Array
remeda: unique
---

_Not provided by Remeda._

There is no equivalent function in Remeda because both `unique` and `sortedUniq`
run at _O(n) **time** complexity_. In **space** complexity (the amount of memory
needed to compute them), `unique` is _O(k)_ where _k_ is the number of unique
values in the array, while `sortedUniq` is _O(1)_. In most real-life use cases,
the two implementations would have near-identical performance. We highly
recommend always using `unique` unless you **know** that the difference matters.

If you still need this algorithm, use [`filter`](/docs#filter) with the
following predicate:

```ts
// Lodash
sortedUniq(DATA);

// Remeda
unique(DATA);
filter(DATA, (item, index, array) => index === 0 || item !== array[index - 1]);
```
