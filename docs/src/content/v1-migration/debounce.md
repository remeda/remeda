# Runtime

There is a specific runtime sequence of events which has the technical potential
to produce a runtime error. We believe this flow is **unreachable** within the
current implementation but can't rule it out at compile time or via testing.

In v1 this was handled _silently_ by ignoring this situation. In v2, for
correctness, we will throw an `Error` instead so that this could be detected and reported to us.
