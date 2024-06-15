---
category: Relation
remeda: sortBy
---

Remeda's `sortBy` also covers the use-case of `sortWith` using a simpler syntax
to describe complex sorting logic; the function takes a variadic list of
arguments instead of an array, and the sorting direction (ascending/descending)
is determined by an optional tuple syntax for the operator.

```ts
const DATA = [
  {
    name: "clara",
    age: 40,
  },
  {
    name: "bob",
    age: 30,
  },
  {
    name: "alice",
    age: 40,
  },
];

// Ramda
sortWith([descend(prop("age")), ascend(prop("name"))])(DATA);

// Remeda
sortBy(DATA, [prop("age"), "desc"], prop("name"));

// Or in a pipe
pipe(DATA, sortBy([prop("age"), "desc"], prop("name")));
```
