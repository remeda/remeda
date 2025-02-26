---
category: Collection
remeda: sortBy
---

The `sortBy` function in Remeda does not support defining the sort criteria
using prop names, only callback functions. Also, the sort criteria is provided
as a variadic argument of sort criteria, and not a single array argument.

```ts
const DATA = [
  { user: "fred", age: 48 },
  { user: "barney", age: 34 },
  { user: "fred", age: 40 },
  { user: "barney", age: 36 },
];

// Lodash
sortBy(DATA, [
  function (o) {
    return o.user;
  },
]);
sortBy(DATA, ["user", "age"]);

// Remeda
sortBy(DATA, prop("user"));
sortBy(DATA, prop("user"), prop("age"));
```
