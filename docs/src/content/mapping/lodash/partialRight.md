---
category: Function
remeda: partialLastBind
---

The placeholder argument `_` is not supported. Some cases can be written as `partialBind`; otherwise, use an arrow function.

```ts
function greet(greeting, firstName, lastName) {
  return greeting + " " + firstName + " " + lastName;
}

// Lodash
_.partialRight(greet, "hi", "john", _);
_.partialRight(greet, "hi", _, "doe");

// Remeda
partialBind(greet, ["hi", "john"]);
// (not supported)

// Native
(lastName) => greet("hi", "john", lastName);
(firstName) => greet("hi", firstName, "doe");
```
