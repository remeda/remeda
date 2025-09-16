---
category: String
---

_Not provided by Remeda._

- Use native [`String.prototype.padEnd`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd)
  instead.
- If `padEnd` is used with whitespace padding (which is also the default) in
  order to position text within an HTML component, prefer using CSS instead. Use
  [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) with a
  length in [`ch`](https://developer.mozilla.org/en-US/docs/Web/CSS/length#ch)
  units, and [`text-align: left`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align).

### Basic Usage

```ts
// Lodash
_.padEnd(input, n);
_.padEnd(input, n, padding);

// Native
input.padEnd(n);
input.padEnd(n, padding);
```

### CSS

```tsx
// Lodash
<pre>{_.padEnd(input, 20)}</pre>

// CSS
<div style="text-align:left;width:20ch">{input}</div>
```
