---
category: String
---

_Not provided by Remeda._

Use the native JS [`String.prototype.repeat`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat) instead.

```ts
// Lodash
repeat("*", 3); // "***"
repeat("abc", 2); // "abcabc"
repeat("abc", 0); // ""

// Native (identical behavior)
"*".repeat(3); // "***"
"abc".repeat(2); // "abcabc"
"abc".repeat(0); // ""
```
