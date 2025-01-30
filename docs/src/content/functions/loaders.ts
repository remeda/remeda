import type { Loader } from "astro/loaders";
import { map, prop } from "remeda";
import invariant from "tiny-invariant";
import {
  OptionDefaults,
  Application as TypeDoc,
  type ProjectReflection,
  type TypeDocOptions,
} from "typedoc";
import { zEntry } from "./schema";

const TYPEDOC_OPTIONS = {
  tsconfig: "../tsconfig.json",
  entryPoints: ["../src/index.ts"],
  exclude: ["**/*.test.ts", "**/*.test-d.ts"],

  jsDocCompatibility: {
    exampleTag: false,
  },

  blockTags: [
    ...OptionDefaults.blockTags,
    "@dataFirst",
    "@dataLast",
    "@lazy",
    "@signature",
  ],

  excludeNotDocumented: true,
  sourceLinkTemplate: "https://github.com/remeda/remeda/blob/main/{path}",
} satisfies Partial<TypeDocOptions>;

export const functionsLoader: Loader = {
  name: "typedoc",
  // eslint-disable-next-line @typescript-eslint/unbound-method
  load: async ({ store, logger, parseData }) => {
    logger.info("Reading data from TypeDoc");
    const declarationReflections = await fromTypeDoc("children");
    logger.info(
      `Read ${declarationReflections.length.toString()} entries from TypeDoc`,
    );
    store.clear();
    for (const { id, ...declarationReflection } of declarationReflections) {
      const data = await parseData({
        id: declarationReflection.name,
        data: { id: id.toString(), ...declarationReflection },
      });
      store.set({ id: declarationReflection.name, data });
    }
  },
  schema: zEntry,
};

export const categoriesLoader = async () =>
  map(await fromTypeDoc("categories"), ({ title: id, children }) => ({
    id,
    children: map(children, prop("name")),
  }));

async function fromTypeDoc<K extends keyof ProjectReflection>(
  key: K,
): Promise<NonNullable<ProjectReflection[K]>> {
  const app = await TypeDoc.bootstrap(TYPEDOC_OPTIONS);

  const project = await app.convert();
  invariant(project !== undefined, "Failed to parse project!");

  const val = project[key];
  invariant(val !== undefined, `Parsed project is missing '${key}' data`);

  return val;
}
