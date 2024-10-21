---
category: Function
remeda: partialBind
---

Remeda's `partialBind` takes a variadic list of arguments instead of an array.

```ts
function greet(greeting, firstName, lastName) {
  return greeting + " " + firstName + " " + lastName;
}

// Ramda
partial(greet, ["hi", "john"]);

// Remeda
partialBind(greet, "hi", "john");
```
