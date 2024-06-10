---
category: Collection
remeda: sample
---

- The `sample` function in Remeda takes a required second parameter of the size
  of the sample. Use **1**.
- The Remeda function returns an array; to extract the value either use
  native destructuring or index access, or use [`only`](/docs#only).
- For objects, first call [`values`](/docs#values).
- If you are using `sample` in an extremely hot path where you need the most
  efficient implementation possible, prefer a native implementation instead.

### Simple

```ts
// Lodash
sample(DATA);

// Remeda
only(sample(DATA, 1 /* size */));

// or with a pipe
pipe(DATA, sample(1 /* size */), only());

// Or with native accessors
sample(DATA, 1 /* size */)[0];
sample(DATA, 1 /* size */).at(0)!;
const [result] = sample(DATA, 1 /* size */);
```

### Native

```ts
// Lodash
sample(DATA);

// Native
DATA[Math.floor(Math.random() * DATA.length)]!;
DATA.at(Math.floor(Math.random() * DATA.length))!;
```
