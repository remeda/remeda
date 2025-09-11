---
category: String
---

_Not provided by Remeda._

Use the native JS [`String.prototype.padStart`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart) instead.

```ts
// Lodash
padStart("abc", 6); // "   abc"
padStart("abc", 6, "_-"); // "_-_abc"

// Native
"abc".padStart(6); // "   abc"
"abc".padStart(6, "_-"); // "_-_abc"
```
