---
category: String
remeda: toUpperCase
---

Lodash allows calling `toUpper` without any input, or with an `undefined` input,
which isn't supported in Remeda, handle these cases before calling the function.

### Basic usage

```ts
// Lodash
_.toUpper(input);

// Remeda
toUpperCase(input);
```

### Missing input

```ts
// Lodash
_.toUpper();
_.toUpper(input);

// Remeda
("");
input !== undefined ? toUpperCase(input) : "";

// Or
toUpperCase(input ?? "");
```
