# Removed

Use [`zip`](/docs/#zip), and then [`fromEntries`](/docs/#fromEntries) on the
result.

## Examples

### fromEntries

```ts
// Was
zipObj(a, b);

// Now
fromEntries(zip(a, b));
```
