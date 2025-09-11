---
category: String
---

_Not provided by Remeda._

Use a dedicated library like [`he`](https://www.npmjs.com/package/he) or create a simple mapping function.

```ts
// Lodash
_.unescape("&lt;div&gt;Hello &amp; goodbye&lt;/div&gt;"); // "<div>Hello & goodbye</div>"

// Simple implementation
function unescape(string: string): string {
  const htmlUnescapes = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
  } as const;

  return string.replace(
    /&(?:amp|lt|gt|quot|#(?:39|x27));/g,
    (match) => htmlUnescapes[match as keyof typeof htmlUnescapes] || match,
  );
}

unescape("&lt;div&gt;Hello &amp; goodbye&lt;/div&gt;"); // "<div>Hello & goodbye</div>"

// Using 'he' library
import { decode } from "he";
decode("&lt;div&gt;Hello &amp; goodbye&lt;/div&gt;"); // "<div>Hello & goodbye</div>"
```
