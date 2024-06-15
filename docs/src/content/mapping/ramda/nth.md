---
category: List
---

_Not provided by Remeda._

- For index `0` use [`first`](/docs#first).
- For index `-1` use [`last`](/docs#last).
- For arbitrary _non-negative_ indices use the native JS `data[n]`.
- Or use [`Array.prototype.at`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) for any index.

```ts
// Ramda
nth(0, DATA);

// Remeda
first(DATA);

// Ramda
nth(1, DATA);

// Native
DATA[1];
DATA.at(1);

// Ramda
nth(-1, DATA);

// Remeda
last(DATA);

// Ramda
nth(-2, DATA);

// Native
DATA.at(-2);
```
