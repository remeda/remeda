---
category: Object
remeda: set
---

- In Lodash the `set` function supports two ways of defining the path parameter:
  a string representation of the path (similar to XPath: e.g. `a.b[0].c`), and
  an array representation of the path (e.g. `['a', 'b', 0, 'c']`). In Remeda
  only a single prop name is accepted. The function cannot be used for nested
  objects or arrays.
- For better type-safety, the `set` function in Remeda can only be used to
  update existing object props. To add a new prop to the object (or to override
  it's _type_) use `addProp` instead.
- In Lodash `set` _mutates_ the input object. In Remeda a **new** object is
  returned instead. The input object is never mutated.

```ts
let data = { a: "hello" };

// Lodash
set(data, "a", "world");
set(data, ["a"], "foo");

set(data, "a", 123);
set(data, ["a"], 456);
set(data, "b", 123);
set(data, ["b"], 456);

// ❌ These aren't supported by Remeda
set(data, "a[0].b", 123);
set(data, ["a", 0, "b"], 123);

// Remeda
data = set(data, "a", "world");
data = set(data, "a", "foo");

data = addProp(data, "a", 123);
data = addProp(data, "a", 456);
data = addProp(data, "b", 123);
data = addProp(data, "b", 456);
```
