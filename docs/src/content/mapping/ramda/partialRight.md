---
category: Function
remeda: partialLastBind
---

Remeda's `partialLastBind` takes a variadic list of arguments instead of an array.

```ts
function greet(greeting, firstName, lastName) {
  return greeting + " " + firstName + " " + lastName;
}

// Ramda
partialRight(greet, ["john", "doe"]);

// Remeda
partialLastBind(greet, "john", "doe");
```
