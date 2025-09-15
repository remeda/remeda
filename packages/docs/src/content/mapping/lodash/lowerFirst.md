---
category: String
remeda: uncapitalize
---

Lodash allows calling `lowerFirst` without any input (or with an `undefined`
input), which results in an empty string `""`. Remeda's `capitalize` requires a
string input.

### Basic usage

```ts
// Lodash
_.lowerFirst(input);

// Remeda
uncapitalize(input);
```

### Missing input data

```ts
// Lodash
_.lowerFirst();
_.lowerFirst(input);

// Remeda
input !== undefined ? uncapitalize(input) : "";

// Or
uncapitalize(input ?? "");
```
