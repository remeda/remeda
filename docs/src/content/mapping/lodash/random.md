---
category: Number
remeda: randomInt
---

- In Lodash, the `random` function supports generating either a random floating-point number or a random integer. In Remeda, only random integers are supported.
- In Lodash, the `random` function supports accepting a single argument, which is the upper bound of the random number. In Remeda, the `randomInt` function requires both the lower and upper bounds as arguments.

```ts
// Lodash
random(1, 10);

// Remeda
randomInt(1, 10);
```
