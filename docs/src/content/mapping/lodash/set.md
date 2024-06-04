---
category: Object
remeda: setPath
---

- In Lodash the `set` function supports two ways of defining the path parameter:
  a string representation of the path (similar to XPath: e.g. `a.b[0].c`), and
  an array representation of the path (e.g. `['a', 'b', 0, 'c']`). In Remeda
  only the array representation is accepted. Use the helper function
  [`stringToPath`](/docs#stringToPath) to translate string paths to array paths.
- Unlike the Lodash `set` function, In Remeda the provided value must match the
  type of the prop at that path, the function does not support creating "sparse"
  objects.
- For better type-safety, Remeda offers two additional functions to handle
  paths of length **1**. Use [`set`](/docs#set) to update an existing prop in an
  object (with IDE type-ahead support); and [`addProp`](/docs#addProp) To add a
  new prop to the object (or to override it's _type_)
- In Lodash `set` _mutates_ the input object. In Remeda a **new** object is
  returned instead. The input object is never mutated.

```ts
let data = { a: "hello", deep: [{ z: true }] };

// Lodash
set(data, "a", "world");
set(data, ["a"], "foo");

set(data, "a", 123);
set(data, ["a"], 456);
set(data, "b", 123);
set(data, ["b"], 456);

set(data, "deep[0].z", false);
set(data, ["deep", 0, "z"], false);

// Remeda
data = set(data, "a", "world");
data = set(data, "a", "foo");

data = addProp(data, "a", 123);
data = addProp(data, "a", 456);
data = addProp(data, "b", 123);
data = addProp(data, "b", 456);

data = setPath(data, stringToPath("deep[0].z"), false);
data = setPath(data, ["deep", 0, "z"], false);
```
