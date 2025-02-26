---
category: Collection
remeda: sortBy
---

Unlike in Lodash, in Remeda the sort criteria can only be a callback (and not a
prop name), it is paired with the order modifier ("asc"/"desc", if needed), and
it's provided as a variadic argument and not two array arguments.

```ts
const DATA = [
  { user: "fred", age: 48 },
  { user: "barney", age: 34 },
  { user: "fred", age: 40 },
  { user: "barney", age: 36 },
];

// Lodash
orderBy(DATA, ["user", "age"], ["asc", "desc"]);

// Remeda
sortBy(DATA, prop("user"), [prop("age"), "desc"]);
```
