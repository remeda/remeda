import { sortBy } from "remeda";

// We only use this function within pipes, so a data-last API is better for us.
export const sortByCategories = () => sortByCategoriesImpl;

const sortByCategoriesImpl = <T>(
  data: ReadonlyArray<readonly [category: string, data: T]>,
) =>
  sortBy(
    data,
    ([category]) => category === "Deprecated",
    ([category]) => category,
  );
