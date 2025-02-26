---
category: Util
remeda: doNothing
---

- If a return value is needed, use [`constant`](/docs#constant) with
  `undefined`.
- Otherwise, use `doNothing` (which returns `void`).

```ts
// Lodash
noop;

// Remeda
constant(undefined);
doNothing();
```
