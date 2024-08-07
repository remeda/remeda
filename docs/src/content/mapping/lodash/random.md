---
category: Number
remeda: randomInt
---

- In Lodash, the `random` function supports generating either a random floating-point number or a random integer. In Remeda, only random integers are supported. If you need a floating-point random number, refer to the "You don't need Lodash" [random](https://you-dont-need.github.io/You-Dont-Need-Lodash-Underscore/#/?id=_random) section for a simple solution.

- In Lodash, the `random` function supports accepting a single argument, which is the upper bound of the random number. In Remeda, the `randomInt` function requires both the lower and upper bounds as arguments.

```ts
// Lodash
random(1, 10);

// Remeda
randomInt(1, 10);

// Lodash
random(10);

// Remeda
randomInt(0, 10);
```
