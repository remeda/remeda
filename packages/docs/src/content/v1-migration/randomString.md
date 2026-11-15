#### Typing

Passing the function as a reference is no longer supported. For dataLast
invocations use `randomString()`.

##### Examples

###### Function reference

```ts
// Was:
map([1, 2, 3], randomString);

// Now:
map([1, 2, 3], randomString());
```
