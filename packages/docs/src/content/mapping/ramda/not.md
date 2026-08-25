---
category: Logic
---

_Not provided by Remeda._

- Use the native [logical NOT operator `!`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Logical_NOT).
- Ramda's `not` is a function, so it can be passed around point-free. The native
  operator can't; wrap it in an arrow function.

#### Values

```ts
// Ramda
not(value);

// Native
!value;
```

#### Point-free

```ts
// Ramda
map(not, DATA);

// Remeda
map(DATA, (value) => !value);
```
