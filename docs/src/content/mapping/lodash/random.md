---
category: Number
remeda: randomInt
---

- When Lodash's `random` function is called with a non-integer param it returns
  any number, not just integers (e.g. 2.5)! Remeda's `randomInt` function
  always returns integers, effectively rounding the parameters to fit the range
  of possible integers.
- If you want to generate any number in the range (and not just integers) see
  the solutions provided in [_"You don't need Lodash"_](https://you-dont-need.github.io/You-Dont-Need-Lodash-Underscore/#/?id=_random).
- Lodash's `random` parameters are optional. In Remeda all parameters are
  required.

### Two integer params

```ts
// Lodash
random(1, 10);

// Remeda
randomInt(1, 10);
```

### Single integer param

```ts
// Lodash
random(10);

// Remeda
randomInt(0, 10);
```

### No params

```ts
// Lodash
random();

// Remeda
randomInt(0, 1);
```

### Not supported: floating-point numbers

```ts
random(1.5, 3.5);
random(1.5);
random(10, true);
random(5, 10, true);
random(true);
```
