---
category: String
remeda: toLowerCase
---

- For display purposes, prefer using CSS [`text-transform: lowercase`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform#lowercase).
- Lodash allows calling `toLower` without any input, or with an `undefined`
  input, which isn't supported in Remeda, handle these cases before calling the
  function.

### Basic usage

```ts
// Lodash
_.toLower(input);

// Remeda
toLowerCase(input);
```

### CSS

```tsx
// Lodash
<div>{_.toLower(user.name)}</div>

// CSS
<div style="text-transform:lowercase">{user.name}</div>
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
