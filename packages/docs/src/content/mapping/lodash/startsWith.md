---
category: String
remeda: startsWith
---

- Lodash supports an optional `position` parameter to check from a specific
  index, while Remeda only checks from the beginning of the string. Compose
  [`sliceString`](/docs#sliceString) with `startsWith` to replicate this
  behavior.
- Lodash allows calling the function without a `target` parameter (or using
  `undefined` for it). These would result in the function always returning
  `true`. In Remeda the `target` is required and handling `undefined` should be
  done before calling `startsWith`.
- Lodash also allows calling the function without an `input` parameter (or using
  `undefined` for it). These would result in the function always returning
  `false` (unless `target` is _also_ `""` or `undefined`). This parameter is
  also required in Remeda; handle the `undefined` explicitly.

### Basic usage

```ts
// Lodash
_.startsWith(input, target);

// Remeda
startsWith(input, target);
```

### Position parameter

```ts
// Lodash
_.startsWith(input, target, position);

// Remeda
startsWith(sliceString(input, position), target);
```

### Missing parameters

```ts
// Lodash
_.startsWith();
_.startsWith(input);

// Native
true;
true;
```

### Undefined target

```ts
// Lodash
_.startsWith(input, target);

// Remeda
target === undefined || startsWith(input, target);

// Or
startsWith(input, target ?? "");
```

### Undefined input

```ts
// Lodash
_.startsWith(input, target);

// Remeda
startsWith(input ?? "", target);

// Or (if you know target is not `undefined` or `""`)
input !== undefined && startsWith(input, target);
```
