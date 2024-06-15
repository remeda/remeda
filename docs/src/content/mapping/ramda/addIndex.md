---
category: Function
---

_Not provided by Remeda._

You don't need `addIndex` In Remeda because all functions that iterate over
arrays or objects have their callbacks in the format that `addIndex` returns by
default. If you still have a use-case that isn't possible via Remeda please open
an issue at the Remeda GitHub project.

```ts
// Ramda
addIndex(map)((val, idx) => idx + "-" + val, DATA);

// Remeda
map(DATA, (val, idx) => idx + "-" + val);
```
