import { map, prop } from "remeda";
import invariant from "tiny-invariant";
import {
  OptionDefaults,
  Application as TypeDoc,
  type ProjectReflection,
  type TypeDocOptions,
} from "typedoc";

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

export const functionsLoader = async () =>
  await fromTypeDoc(
    "children",
    // eslint-disable-next-line @typescript-eslint/no-misused-spread -- Effectively this doesn't matter because the schema would "hide" the methods leaving only data props, but we should consider other ways to handle this...
    map((reflection) => ({ ...reflection, id: reflection.name })),
  );

export const categoriesLoader = async () =>
  await fromTypeDoc(
    "categories",
    map(({ title: id, children }) => ({
      id,
      children: map(children, prop("name")),
    })),
  );

async function fromTypeDoc<K extends keyof ProjectReflection, T>(
  key: K,
  extractor: (data: NonNullable<ProjectReflection[K]>) => T,
): Promise<T> {
  const app = await TypeDoc.bootstrap(TYPEDOC_OPTIONS);

  const project = await app.convert();
  invariant(project !== undefined, "Failed to parse project!");

  const val = project[key];
  invariant(val !== undefined, `Parsed project is missing '${key}' data`);

  return extractor(val);
}
