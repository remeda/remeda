---
category: Array
---

_Not provided by Remeda._

- For index `0` use [`first`](/docs#first).
- For index `-1` use [`last`](/docs#last).
- For arbitrary _non-negative_ indices use the native JS `data[n]`.
- Or use [`Array.prototype.at`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) for any index.

```ts
// Lodash
nth(DATA);
nth(DATA, 0);

// Remeda
first(DATA);

// Lodash
nth(DATA, 1);

// Native
DATA[1];
DATA.at(1);

// Lodash
nth(DATA, -1);

// Remeda
last(DATA);

// Lodash
nth(DATA, -2);

// Native
DATA.at(-2);
```
