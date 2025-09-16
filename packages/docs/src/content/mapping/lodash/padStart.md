---
category: String
---

_Not provided by Remeda._

- Use native [`String.prototype.padStart`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)
  instead.
- If `padStart` is used with whitespace padding (which is also the default) in
  order to position text within an HTML component, prefer using CSS instead. Use
  [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) with a
  length in [`ch`](https://developer.mozilla.org/en-US/docs/Web/CSS/length#ch)
  units, and [`text-align: right`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align).

### Basic Usage

```ts
// Lodash
_.padStart(input, n);
_.padStart(input, n, padding);

// Native
input.padStart(n);
input.padStart(n, padding);
```

### CSS

```tsx
// Lodash
<pre>{_.padStart(user.name, 20)}</pre>

// CSS
<div style="text-align:right;width:20ch">{user.name}</div>
```
