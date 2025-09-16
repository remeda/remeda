---
category: String
remeda: endsWith
---

- Lodash supports an optional `position` parameter to check only part of the
  string, while Remeda doesn't support this parameter. To replicate this
  behavior, use [`sliceString`](/docs#sliceString) to truncate the string before
  checking.
- Lodash allows the suffix to be `undefined` (converts to `"undefined"` string)
  but this is not supported by Remeda and needs to be handled explicitly.

### Basic usage

```ts
// Lodash
_.endsWith(input, suffix);

// Remeda
endsWith(input, suffix);

// Native
input.endsWith(suffix);
```

### Position parameter

```ts
// Lodash
_.endsWith(input, suffix, position);

// Remeda
endsWith(sliceString(input, 0, position), suffix);

// Native
input.endsWith(suffix, position);
```

### Undefined suffix

```ts
// Lodash
_.endsWith(input, suffix);

// Remeda
suffix !== undefined && endsWith(input, suffix);
```
