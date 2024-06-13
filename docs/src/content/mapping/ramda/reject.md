---
category: List
remeda: filter
---

Wrap the callback with [`isNot`](/docs#isNot).

```ts
// Ramda
reject(predicate, DATA);

// Remeda
filter(DATA, isNot(predicate));

// Or in a pipe
pipe(DATA, filter(isNot(predicate)));
```
