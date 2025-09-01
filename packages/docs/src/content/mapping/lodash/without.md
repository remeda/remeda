---
category: Array
---

_Not provided by Remeda._

- `without` is equivalent to Lodash's `difference` function. To migrate to
  Remeda first migrate calls to Lodash `_.difference` and then use the migration
  docs for [`difference`](/#difference) to complete the migration.
  **IMPORTANT**: The Remeda `difference` function **isn't** a drop-in
  replacement for the Lodash `_.difference` function, we do **not** recommend
  migrating directly from `without` to Remeda's `difference`.

- `without` takes variadic arguments; `difference` takes an explicit array.
  You will need to wrap your items in an array when migrating.

```ts
// pull
_.pull(DATA, a, b, c, ...additional);

// difference
_.difference(DATA, [a, b, c, ...additional]);
```
