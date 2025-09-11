---
category: String
---

_Not provided by Remeda._

- If pad is used with whitespace padding (which is also the default) in order to
  center text within an HTML component, prefer using CSS instead; Use
  [`width`](https://developer.mozilla.org/en-US/docs/Web/CSS/width) with a
  length in [`ch`](https://developer.mozilla.org/en-US/docs/Web/CSS/length#ch)
  units, and [`text-align: center`](https://developer.mozilla.org/en-US/docs/Web/CSS/text-align).
- For other uses `pad` could be replicated via [`padStart`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padStart)
  and [`padEnd`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/padEnd),
  by computing the amount of effective padding you need on one side.

### CSS

```tsx
// Lodash
<pre>{_.pad(user.name, 20)}</pre>

// CSS
<div style={{ textAlign: "center", width: "20ch" }}>{user.name}</div>
```

### Reference Implementation

```ts
const pad = (data: string, length: number, padding = " ") =>
  data.padStart((length + data.length) / 2, padding).padEnd(length, padding);
```
