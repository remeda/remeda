---
category: String
---

_Not provided by Remeda._

Use the native JS [`parseInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/parseInt) function instead. Lodash's `parseInt` is essentially a wrapper around native `parseInt` that trims leading whitespace, but native `parseInt` already does this in modern browsers.

```ts
// Lodash
_.parseInt("08"); // 8
_.parseInt("08", 10); // 8

// Native (identical behavior)
parseInt("08"); // 8
parseInt("08", 10); // 8
```
