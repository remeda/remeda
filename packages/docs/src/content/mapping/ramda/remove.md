---
category: List
remeda: splice
---

#### Data-first

```ts
// Ramda
remove(2, 3, [1, 2, 3, 4, 5, 6, 7, 8]);

// Remeda
splice([1, 2, 3, 4, 5, 6, 7, 8], 2, 3);
```

#### Data-last

```ts
// Ramda
remove(2, 3)([1, 2, 3, 4, 5, 6, 7, 8]);

// Remeda
pipe([1, 2, 3, 4, 5, 6, 7, 8], splice(2, 3));
```
