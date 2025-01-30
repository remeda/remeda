/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/unbound-method */

import { throws } from "@/lib/throws";
import type { Loader } from "astro/loaders";
import { isNullish, map, pipe, prop, when } from "remeda";
import invariant from "tiny-invariant";
import {
  OptionDefaults,
  ReflectionKind,
  Application as TypeDoc,
  type TypeDocOptions,
} from "typedoc";
import { zEntry } from "./schema";

const PROJECT_ENTRY_POINT = "../src/index.ts";

const TYPEDOC_OPTIONS = {
  tsconfig: "../tsconfig.json",

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

  sourceLinkTemplate: "https://github.com/remeda/remeda/blob/main/{path}",
} satisfies Omit<Partial<TypeDocOptions>, "entryPoints">;

export const functionsLoader: Loader = {
  name: "typedoc",

  load: async ({ store, logger, watcher, parseData }) => {
    logger.info("Initializing TypeDoc");
    const app = await TypeDoc.bootstrap({
      entryPoints: [PROJECT_ENTRY_POINT],
      ...TYPEDOC_OPTIONS,
    });

    logger.info("Parsing project");
    const functionDeclarations = pipe(
      await app.convert(),
      when(isNullish, throws("Failed to parse project!")),
      ($) => $.getReflectionsByKind(ReflectionKind.Function),
      map((reflection) => {
        invariant(
          reflection.isDeclaration(),
          `Function reflection ${reflection.name} is not a declaration?!`,
        );
        return reflection;
      }),
    );

    logger.info(
      `Going to parse data for ${functionDeclarations.length.toString()} functions`,
    );
    const parsedData = await Promise.all(
      functionDeclarations.map(
        async ({ id: _, ...functionDeclaration }) =>
          await parseData({
            id: functionDeclaration.name,
            data: { id: functionDeclaration.name, ...functionDeclaration },
          }),
      ),
    );

    logger.info("Pushing data into store");
    store.clear();
    for (const data of parsedData) {
      store.set({ id: data.name, data });
    }

    logger.info("Watching source files for changes");
    if (watcher !== undefined) {
      const sourceFiles = functionDeclarations.map(({ sources }) => {
        const fileName = sources?.[0]?.fullFileName;
        invariant(
          fileName !== undefined,
          "Function declaration has no source file!",
        );
        return fileName;
      });

      watcher.add(sourceFiles);

      watcher.on("change", (filePath) => {
        if (!sourceFiles.includes(filePath)) {
          return;
        }

        const updateData = async () => {
          logger.info(`Source file ${filePath} changed, creating reloader app`);
          const refresherApp = await TypeDoc.bootstrap({
            entryPoints: [filePath],
            ...TYPEDOC_OPTIONS,
          });

          logger.info("Refreshing project");
          const refreshedProject = await refresherApp.convert();
          invariant(
            refreshedProject !== undefined,
            "Failed to parse refreshed project!",
          );

          const refreshedFunctionDeclarations = pipe(
            refreshedProject,
            ($) => $.getReflectionsByKind(ReflectionKind.Function),
            map((reflection) => {
              invariant(
                reflection.isDeclaration(),
                `Function reflection ${reflection.name} is not a declaration?!`,
              );
              return reflection;
            }),
          );

          logger.info(
            `Going to parse data for ${refreshedFunctionDeclarations.length.toString()} functions`,
          );
          const refreshedParsedData = await Promise.all(
            refreshedFunctionDeclarations.map(
              async ({ id: _, ...functionDeclaration }) =>
                await parseData({
                  id: functionDeclaration.name,
                  data: {
                    id: functionDeclaration.name,
                    ...functionDeclaration,
                  },
                }),
            ),
          );

          for (const data of refreshedParsedData) {
            logger.info(`Updating data for ${data.name}`);
            store.set({ id: data.name, data });
          }
        };

        void updateData();
      });
    }
  },
  schema: zEntry,
};

export async function categoriesLoader() {
  const app = await TypeDoc.bootstrap({
    entryPoints: [PROJECT_ENTRY_POINT],
    ...TYPEDOC_OPTIONS,
  });

  const project = await app.convert();
  invariant(project !== undefined, "Failed to parse project!");

  const { categories } = project;

  invariant(
    categories !== undefined,
    `Parsed project is missing categories data`,
  );

  return categories.map(({ title: id, children }) => ({
    id,
    children: map(children, prop("name")),
  }));
}
