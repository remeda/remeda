---
category: String
---

_Not provided by Remeda._

Use the native JS [`String.prototype.padStart`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart) instead.

```ts
// Lodash
_.padStart("abc", 6); // "   abc"
_.padStart("abc", 6, "_-"); // "_-_abc"

// Native
"abc".padStart(6); // "   abc"
"abc".padStart(6, "_-"); // "_-_abc"
```
