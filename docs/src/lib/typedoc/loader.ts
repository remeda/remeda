/* eslint-disable @typescript-eslint/unbound-method */

import type { Loader } from "astro/loaders";
import { difference, forEach, omit, pipe, prop } from "remeda";
import invariant from "tiny-invariant";
import { Application, ReflectionKind, type TypeDocOptions } from "typedoc";
import { zEntry } from "./schema";

const INTERNAL_TYPEDOC_OPTIONS = {
  // We want to keep astro-specific log lines visible in the output too
  preserveWatchOutput: true,
} as const satisfies Partial<TypeDocOptions>;

export type TypeDocLoaderOptions = Omit<
  Partial<TypeDocOptions>,
  keyof typeof INTERNAL_TYPEDOC_OPTIONS
>;

export const typeDocLoader = (options: TypeDocLoaderOptions): Loader => ({
  name: "typeDoc",

  schema: zEntry,

  load: async ({ store, logger, watcher, parseData, generateDigest }) => {
    const app = await Application.bootstrap({
      ...options,
      ...INTERNAL_TYPEDOC_OPTIONS,
    });

    if (watcher === undefined) {
      // build mode
      const project = await app.convert();
      invariant(project !== undefined, "Failed to parse project!");

      const parsedData = await Promise.all(
        project.getReflectionsByKind(ReflectionKind.Function).map(
          async (funcReflection) =>
            await parseData({
              id: funcReflection.name,
              data: omit(funcReflection, ["id"]),
              ...(funcReflection.isDeclaration() &&
                funcReflection.sources?.[0] !== undefined && {
                  filePath: funcReflection.sources[0].fullFileName,
                }),
            }),
        ),
      );

      store.clear();
      for (const data of parsedData) {
        store.set({ id: data.name, data });
      }

      return;
    }

    store.clear();

    let isInit = true;

    app.convertAndWatch(async (project) => {
      if (!isInit) {
        logger.info("Detected changes in source files");
      }

      const parsedData = await Promise.all(
        project.getReflectionsByKind(ReflectionKind.Function).map(
          async (funcReflection) =>
            await parseData({
              id: funcReflection.name,
              data: omit(funcReflection, ["id"]),
              ...(funcReflection.isDeclaration() &&
                funcReflection.sources?.[0] !== undefined && {
                  filePath: funcReflection.sources[0].fullFileName,
                }),
            }),
        ),
      );

      for (const data of parsedData) {
        const digest = generateDigest(data);
        const wasUpdated = store.set({ id: data.name, data, digest });
        if (wasUpdated && !isInit) {
          logger.info(`Updated ${data.name} in store`);
        }
      }

      if (!isInit) {
        pipe(
          store.keys(),
          difference(parsedData.map(prop("name"))),
          forEach((removedKey) => {
            logger.info(`Removing ${removedKey} from store`);
            store.delete(removedKey);
          }),
        );
      }

      isInit = false;
    });
  },
});
