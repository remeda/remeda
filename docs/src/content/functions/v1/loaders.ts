import { toString } from "@/lib/to-string";
import { file } from "astro/loaders";
import path from "node:path";
import { evolve, isNullish, map, piped, prop, when } from "remeda";
import invariant from "tiny-invariant";
import { type JSONOutput } from "typedoc";
import dataFilePath from "./functions.json?url";
import { throws } from "@/lib/throws";

const DATA_FILE = path.join(import.meta.dirname, path.basename(dataFilePath));

export const functionsLoader = file(DATA_FILE, {
  parser: piped(
    ($) => JSON.parse($) as JSONOutput.ProjectReflection,
    prop("children"),
    when(
      isNullish,
      throws(
        `Data file ${DATA_FILE} is missing any declarations or references`,
      ),
    ),
    map(evolve({ id: toString() })),
  ),
});

export const categoriesLoader = file(DATA_FILE, {
  parser: piped(
    ($) => JSON.parse($) as JSONOutput.ProjectReflection,
    prop("categories"),
    when(isNullish, throws(`Data file ${DATA_FILE} is missing any categories`)),
    map(({ title: id, children }) => {
      invariant(children !== undefined, `Category ${id} has no children?!`);
      // Astro expects reference types to be strings although it allows ids to be `numbers` :(
      return { id, children: map(children, toString()) };
    }),
  ),
});
