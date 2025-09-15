---
category: String
remeda: capitalize
---

Lodash allows calling `upperFirst` without any input (or with an `undefined`
input), which results in an empty string `""`. Remeda's `capitalize` requires a
string input.

### Basic usage

```ts
// Lodash
_.upperFirst(input);

// Remeda
capitalize(input);
```

### Missing input data

```ts
// Lodash
_.upperFirst();
_.upperFirst(input);

// Remeda
input !== undefined ? capitalize(input) : "";

// Or
capitalize(input ?? "");
```
