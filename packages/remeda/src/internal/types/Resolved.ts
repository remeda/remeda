// Acts as a "inference" point that forces TypeScript to resolve during a deep
// recursive type instead of accumulating more complexity through the tree.
// This can be used to avoid `Type instantiation is excessively deep and
// possibly infinite (ts2589)` errors by wrapping the (recursive) computed
// return types of overloaded signatures with this.
export type Resolved<T> = T extends infer U ? U : never;
