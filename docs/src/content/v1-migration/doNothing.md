# Typing

Minor changes to support more implicit typing possibilities in pipes.

# Runtime

The returned function is now a **global constant**; subsequent calls will return
the same function _pointer_ so that `doNothing() === doNothing()` is `true`.
