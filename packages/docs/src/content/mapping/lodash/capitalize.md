---
category: String
remeda: capitalize
---

- Lodash converts the entire string to lowercase first, while Remeda only
  capitalizes the first character. To match Lodash behavior, call
  [`toLowerCase`](/docs#toLowerCase) first.
- For display purposes, prefer using CSS; use [`text-transform: lowercase`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform#lowercase)
  on the element, then use [`::first-letter`](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-letter)
  to target just the first letter of the word, and use [`text-transform: uppercase`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform#uppercase)
  to capitalize it.

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
<style>
  .capitalize {
    text-transform: lowercase;
  }

  .capitalize::first-letter {
    text-transform: uppercase;
  }
</style>
<div class="capitalize">{user.name}</div>
```
