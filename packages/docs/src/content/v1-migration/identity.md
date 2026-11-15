#### Typing

Passing the function as a reference is no longer supported. The function now
returns an identity function instead. To fix these call sites simply add
parenthesis to the end: `identity` -> `identity()`.

##### Examples

###### Function reference

```ts
// Was
map(DATA, identity);

// Now
map(DATA, identity());
```
