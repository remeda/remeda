import { entries, map, pipe, sortBy } from "remeda";
import { CATEGORIZED } from "./categorized";
import { getTags } from "./get-tags";
import type { NavbarCategory } from "@/components/navbar";

const FUNCTION_ENTRIES = pipe(
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

const MANUAL_ENTRIES = [
  ["Guides", [{ name: "Migrating to v2", href: "#migration-intro" }]],
] as const satisfies ReadonlyArray<NavbarCategory>;

export const NAVBAR_ENTRIES = [...MANUAL_ENTRIES, ...FUNCTION_ENTRIES] as const;
