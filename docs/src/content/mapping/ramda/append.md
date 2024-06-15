---
category: List
remeda: concat
---

_Not provided by Remeda._

- You can replicate this function via the native JS spread `...` operator or via
  the Remeda `concat` function (by wrapping the operand with an array).
- There might be cases where building an `append` function could be more
  efficient than using the suggested alternatives, but we believe they are
  extremely rare. If you want to suggest adding it reach out to us at the Remeda
  GitHub project.

```ts
// Ramda
append(operand, DATA);

// Or curried
const addsAbc = append(operand);

// Remeda
concat(DATA, [operand]);

// Or in a pipe
pipe(DATA, concat([operand]));

// Native
[...DATA, operand];

const addsAbc = <T extends ReadonlyArray<unknown>>(data: T) => [
  ...data,
  operand,
];
```
