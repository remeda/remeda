---
category: Relation
---

_Not provided by Remeda._

The Ramda `max` function takes exactly **2** arguments. It is easily replicated
using native JS operators.

```ts
// Ramda
min(a, b);

// Curried
const minA = min(a);

// Native
a < b ? a : b;

const minA = (b: number) => (a < b ? a : b);
```
