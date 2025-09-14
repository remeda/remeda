---
category: String
remeda: toLowerCase
---

Lodash allows calling `toLower` without any input, or with an `undefined`
input, which isn't supported in Remeda, handle these cases before calling the
function.

### Basic usage

```ts
// Lodash
_.toLower(input);

// Remeda
toLowerCase(input);
```

### Missing input

```ts
// Lodash
_.toLower();
_.toLower(input);

// Remeda
("");
input !== undefined ? toLowerCase(input) : "";

// Or
toLowerCase(input ?? "");
```
