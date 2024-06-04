---
category: Object
remeda: set
---

- In Lodash the `set` function supports 2 ways to define the path parameter: a
  string representation of the path (similar to XPath: e.g. `a.b[0].c`), and an
  array representation of the path (e.g. `['a', 'b', 0, 'c']`). In Remeda only
  a single prop name is accepted. The function cannot be used for nested objects
  and arrays.
- For better type-safety, the `set` function in Remeda can only be used for
  existing props in the object, in order to override their value. To add a new
  prop to the object use `addProp` instead.
- In Lodash `set` _mutates_ the input object. In Remeda a **new** object is
  returned instead.

```ts
const DATA = { a: "hello" };

// Lodash
set(DATA, "a", "world");
set(DATA, "b", 123);
set(DATA, ["a"], "foo");
set(DATA, ["c"], 123);

// ❌ These aren't supported by Remeda
set(DATA, "a[0].b", 123);
set(DATA, ["a", 0, "b"], 123);

// Remeda
set(DATA, "a", "world");
addProp(DATA, "b", 123);
set(DATA, "a", "foo");
addProp(DATA, "c", 123);
```
