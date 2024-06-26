import DATA from "@/data/data.json";
import { entries, groupBy, pipe } from "remeda";
import { transformProject } from "./transform";

const MISSING_CATEGORY_FALLBACK = "Other";

export const CATEGORIZED = pipe(
  DATA,
  transformProject,
  groupBy(
    ({ category }) =>
      category ??
      // We should probably throw instead so that the build would fail
      MISSING_CATEGORY_FALLBACK,
  ),
  entries(),
);
