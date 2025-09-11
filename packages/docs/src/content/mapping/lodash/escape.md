---
category: String
---

_Not provided by Remeda._

Use a dedicated library like [`he`](https://www.npmjs.com/package/he) or create a simple mapping function.

```ts
// Lodash
escape("<div>Hello & goodbye</div>"); // "&lt;div&gt;Hello &amp; goodbye&lt;/div&gt;"

// Simple implementation
function escape(string: string): string {
  const htmlEscapes = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  } as const;

  return string.replace(
    /[&<>"']/g,
    (match) => htmlEscapes[match as keyof typeof htmlEscapes],
  );
}

escape("<div>Hello & goodbye</div>"); // "&lt;div&gt;Hello &amp; goodbye&lt;/div&gt;"

// Using 'he' library
import { encode } from "he";
encode("<div>Hello & goodbye</div>"); // "&lt;div&gt;Hello &#x26; goodbye&lt;/div&gt;"
```
