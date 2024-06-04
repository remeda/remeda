---
category: Object
remeda: pathOr
---

- In Lodash the `get` function supports two ways of defining the path parameter:
  a string representation of the path (similar to XPath: e.g. `a.b[0].c`), and
  an array representation of the path (e.g. `['a', 'b', 0, 'c']`). In Remeda
  only the array representation is accepted. Use the helper function
  [`stringToPath`](/docs#stringToPath) to translate string paths to array paths.
- In order to provide good types, the Remeda `pathOr` function is limited to
  paths of length 3 or less. Longer paths are not supported.
- [`prop`](/docs#prop) is a simplified version of `pathOr` for paths of length
  **1** and `undefined` as the default (fallback) value.

```ts
const DATA = { a: [{ b: 123 }] };

// Lodash
get(DATA, "a");
get(DATA, ["a", 0, "b"], 456);
get(DATA, "a[0].b", 456);

// Remeda
prop(DATA, "a");
pathOr(DATA, ["a", 0, "b"], 456);
pathOr(DATA, stringToPath("a[0].b"), 456);
```
