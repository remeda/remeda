import { toString } from "@/lib/to-string";
import { file } from "astro/loaders";
import { evolve, isNullish, map, piped, prop, when } from "remeda";
import invariant from "tiny-invariant";
import { type JSONOutput } from "typedoc";

export const functionsLoader = (fileName: string) =>
  file(fileName, {
    parser: piped(
      ($) => JSON.parse($) as JSONOutput.ProjectReflection,
      prop("children"),
      when(isNullish, () => {
        throw new Error(
          `Data file ${fileName} is missing any declarations or references`,
        );
      }),
      map(evolve({ id: toString() })),
    ),
  });

export const categoriesLoader = (fileName: string) =>
  file(fileName, {
    parser: piped(
      ($) => JSON.parse($) as JSONOutput.ProjectReflection,
      prop("categories"),
      when(isNullish, () => {
        throw new Error(`Data file ${fileName} is missing any categories`);
      }),
      map(({ title: id, children }) => {
        invariant(children !== undefined, `Category ${id} has no children?!`);
        // Astro expects reference types to be strings although it allows ids to be `numbers` :(
        return { id, children: map(children, toString()) };
      }),
    ),
  });
