---
category: String
remeda: capitalize
---

- Lodash converts the entire string to lowercase first, while Remeda only
  capitalizes the first character. To match Lodash behavior, call
  [`toLowerCase`](/docs#toLowerCase) first.
- For display purposes, consider using the [`text-transform: capitalize`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform)
  CSS property instead.

### Runtime

```ts
// Lodash
_.capitalize("javaScript");

// Remeda
capitalize(toLowerCase("javaScript"));
```

### CSS

```tsx
// Lodash
<div>{_.capitalize(user.name)}</div>

// CSS
<div style={{ textTransform: "capitalize" }}>{user.name}</div>
```
