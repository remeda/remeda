---
category: String
remeda: capitalize
---

- For display purposes, prefer using CSS; use [`::first-letter`](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-letter)
  to target just the first letter of the word and [`text-transform: uppercase`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform#uppercase)
  to capitalize it.
- Lodash allows calling `upperFirst` without any input (or with an `undefined`
  input), which results in an empty string `""`. Remeda's `capitalize` requires
  a string input.

### Basic usage

```ts
// Lodash
_.upperFirst(input);

// Remeda
capitalize(input);
```

### CSS

```tsx
// Lodash
<div>{_.upperFirst(user.name)}</div>

// CSS
<style>
  .upperFirst::first-letter {
    text-transform: uppercase;
  }
</style>
<div class="upperFirst">{user.name}</div>
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
