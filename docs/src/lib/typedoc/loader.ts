import type { Loader, LoaderContext } from "astro/loaders";
import { omit } from "remeda";
import invariant from "tiny-invariant";
import {
  Application,
  ReflectionKind,
  type ProjectReflection,
  type TypeDocOptions,
} from "typedoc";

const INTERNAL_TYPEDOC_OPTIONS = {
  // We want to keep astro-specific log lines visible in the output too
  preserveWatchOutput: true,
} as const satisfies Partial<TypeDocOptions>;

type TypeDocLoaderOptions = Omit<
  Partial<TypeDocOptions>,
  keyof typeof INTERNAL_TYPEDOC_OPTIONS
>;

export const typedocLoader = (options: TypeDocLoaderOptions): Loader => ({
  name: "typedoc",

  load: async (context) => {
    const app = await Application.bootstrap({
      ...options,
      ...INTERNAL_TYPEDOC_OPTIONS,
    });

    if (context.watcher === undefined) {
      // There is no watcher available, meaning that the loader is not running
      // in the context of a live/dev server.

      const project = await app.convert();
      invariant(project !== undefined, "Failed to parse project!");

      await cleanLoad(context, project);

      return;
    }

    let isInit = true;

    app.convertAndWatch(async (project) => {
      await (isInit
        ? cleanLoad(context, project)
        : incrementalLoad(context, project));

      isInit = false;
    });
  },
});

async function cleanLoad(
  context: LoaderContext,
  project: ProjectReflection,
): Promise<void> {
  context.store.clear();
  for await (const data of getParsedData(context, project)) {
    const digest = context.generateDigest(data);
    context.store.set({ id: data.name, data, digest });
  }
}

async function incrementalLoad(
  context: LoaderContext,
  project: ProjectReflection,
): Promise<void> {
  const { store, logger } = context;

  logger.info("Detected changes in source files");

  const existingFuncNames = new Set<string>();

  for await (const data of getParsedData(context, project)) {
    existingFuncNames.add(data.name);

    const digest = context.generateDigest(data);
    const wasUpdated = store.set({ id: data.name, data, digest });
    if (wasUpdated) {
      logger.info(`Updated ${data.name} in store`);
    }
  }

  for (const key of store.keys()) {
    if (!existingFuncNames.has(key)) {
      logger.info(`Removing ${key} from store`);
      store.delete(key);
    }
  }
}

async function* getParsedData(
  context: LoaderContext,
  project: ProjectReflection,
) {
  const reflections = project.getReflectionsByKind(ReflectionKind.Function);

  for (const reflection of reflections) {
    yield await context.parseData({
      id: reflection.name,
      data: omit(reflection, ["id"]),
      ...(reflection.isDeclaration() &&
        reflection.sources?.[0] !== undefined && {
          filePath: reflection.sources[0].fullFileName,
        }),
    });
  }
}
