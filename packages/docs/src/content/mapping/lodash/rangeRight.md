---
category: Util
---

Lodash's `rangeRight` is equivalent to composing [`_.reverse`](#reverse) on
[`_.range`](#range). Migrate first to that pattern, and then use the migration
guides for those functions to fully migrate to Remeda.

```ts
// Lodash
_.rangeRight(start, end, step);
_.reverse(_.range(start, end, step));
```
