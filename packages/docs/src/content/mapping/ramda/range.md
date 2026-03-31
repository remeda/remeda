---
category: List
remeda: range
---

Remeda curries functions by stripping the first parameter. This means that
unlike in Ramda, a curried call to `range` would result in a function that has
a pre-set `end` value, and not a pre-set `start` value; curried calls need their
`start` and `end` parameters swapped!

### Simple

```ts
// Ramda
R.range(10, 20);
R.range(start, end);

// Remeda
range(10, 20);
range(start, end);
```

### Curried

```ts
// Ramda
R.range(10)(20);
R.range(start)(end);

// Remeda
range(20)(10);
range(end)(start);
```
