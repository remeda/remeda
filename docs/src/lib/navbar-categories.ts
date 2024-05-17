import { entries, map, pipe, sortBy } from "remeda";
import { CATEGORIZED } from "./categorized";
import { getTags } from "./get-tags";

export const NAVBAR_ENTRIES = pipe(
  CATEGORIZED,
  entries(),
  map(
    ([category, funcs]) =>
      [
        category,
        map(funcs, (func) => ({ name: func.name, tags: getTags(func) })),
      ] as const,
  ),
  sortBy(
    ([category]) => category === "Deprecated",
    ([category]) => category,
  ),
);
