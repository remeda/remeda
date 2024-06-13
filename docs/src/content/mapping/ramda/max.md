---
category: Relation
---

_Not provided by Remeda._

The Ramda `max` function takes exactly **2** arguments. It is easily replicated
using native JS operators.

```ts
// Ramda
max(a, b);

// Curried
const maxA = max(a);

// Native
a > b ? a : b;

const maxA = (b: number) => (a > b ? a : b);
```
