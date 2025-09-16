---
category: String
remeda: toUpperCase
---

- For display purposes, prefer using CSS [`text-transform: uppercase`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform#uppercase).
- Lodash allows calling `toUpper` without any input, or with an `undefined`
  input, which isn't supported in Remeda, handle these cases before calling the
  function.

### Basic usage

```ts
// Lodash
_.toUpper(input);

// Remeda
toUpperCase(input);
```

### CSS

```tsx
// Lodash
<div>{_.toUpper(user.name)}</div>

// CSS
<div style="text-transform:uppercase">{user.name}</div>
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
