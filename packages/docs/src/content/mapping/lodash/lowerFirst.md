---
category: String
remeda: uncapitalize
---

- For display purposes, prefer using CSS; use [`::first-letter`](https://developer.mozilla.org/en-US/docs/Web/CSS/::first-letter)
  to target just the first letter of the word and [`text-transform: lowercase`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-transform#lowercase)
  to lowercase it.
- Lodash allows calling `lowerFirst` without any input (or with an `undefined`
  input), which results in an empty string `""`. Remeda's `uncapitalize`
  requires a string input.

### Basic usage

```ts
// Lodash
_.lowerFirst(input);

// Remeda
uncapitalize(input);
```

### CSS

```tsx
// Lodash
<div>{_.lowerFirst(user.name)}</div>

// CSS
<style>
  .lowerFirst::first-letter {
    text-transform: lowercase;
  }
</style>
<div class="lowerFirst">{user.name}</div>
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
