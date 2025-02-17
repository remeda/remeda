---
category: String
---

_Not provided by Remeda._

Use the native JS [`String.prototype.split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split) with the regex `/\s+/u` instead.

```ts
// Lodash
words(str);

// Native
str.split(/\s+/u);
```
