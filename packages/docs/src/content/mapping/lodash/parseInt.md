---
category: String
---

_Not provided by Remeda._

- Use native [`Number.parseInt`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/parseInt)
  instead.
- When used as a callback, `parseInt` protects against the index parameter
  unintentionally redefining the `radix`. To avoid this issue, wrap the callback
  with an arrow function.

### Basic usage

```ts
// Lodash
_.parseInt(input);
_.parseInt(input, radix);

// Native
Number.parseInt(input);
Number.parseInt(input, radix);
```

### Callback

```ts
// Lodash
data.map(_.parseInt);

// Native
data.map((item) => Number.parseInt(item, 10)); // ✅
data.map(Number.parseInt); // ❌
```
