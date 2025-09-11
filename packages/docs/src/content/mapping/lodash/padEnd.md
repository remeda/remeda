---
category: String
---

_Not provided by Remeda._

Use the native JS [`String.prototype.padEnd`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd) instead.

```ts
// Lodash
padEnd("abc", 6); // "abc   "
padEnd("abc", 6, "_-"); // "abc_-_"

// Native
"abc".padEnd(6); // "abc   "
"abc".padEnd(6, "_-"); // "abc_-_"
```
