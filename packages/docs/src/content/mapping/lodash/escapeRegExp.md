---
category: String
---

_Not provided by Remeda._

- Use the native [`RegExp.escape`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/escape)
  instead.
- When unavailable, `escapeRegExp` could also be replicated using [`String.prototype.replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
  to replace matches of `/[\\^$.*+?()[\]{}|]/g` (which matches on the
  characters: ^, $, ., \*, +, ?, (), {}, [], and |) with a backslash-escaped
  version of the match (using the `"\\$&"` replacement pattern).

```ts
// Lodash
_.escapeRegExp(input);

// Native
RegExp.escape(input);

// Or
input.replace(/[\\^$.*+?()[\]{}|]/g, "\\$&");
```
