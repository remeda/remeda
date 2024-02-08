import { TRANSFORMED } from "./transform";
import { groupBy } from "remeda";

const MISSING_CATEGORY_FALLBACK = "Other";

export const CATEGORIZED = groupBy(
  TRANSFORMED,
  ({ category }) =>
    category ??
    // We should probably throw instead so that the build would fail
    MISSING_CATEGORY_FALLBACK,
);
