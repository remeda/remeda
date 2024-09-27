---
category: Function
remeda: partialBind
---

The placeholder argument `_` is not supported. Some cases can be written as `partialLastBind`; otherwise, use an arrow function.

```ts
function greet(greeting, firstName, lastName) {
  return greeting + " " + firstName + " " + lastName;
}

// Lodash
_.partial(greet, _, "john", "doe");
_.partial(greet, "hi", _, "doe");

// Remeda
partialLastBind(greet, "john", "doe");
// (not supported)

// Native
(greeting) => greet(greeting, "john", "doe");
(firstName) => greet("hi", firstName, "doe");
```
