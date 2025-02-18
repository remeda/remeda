import {
  docsArticlesCollection,
  docsArticlesCollectionName,
} from "@/content/docs-articles/content.config";
import {
  functionsCollection,
  functionsCollectionName,
} from "@/content/functions/content.config";
import {
  categoriesV1Collection,
  categoriesV1CollectionName,
  functionsV1Collection,
  functionsV1CollectionName,
} from "@/content/functions/v1/content.config";
import {
  mappingCollection,
  mappingCollectionName,
} from "@/content/mapping/content.config";
import {
  collection as v1MigrationCollection,
  name as v1MigrationName,
} from "@/content/v1-migration/content.config";

export const collections = {
  [docsArticlesCollectionName]: docsArticlesCollection,
  [mappingCollectionName]: mappingCollection,
  [v1MigrationName]: v1MigrationCollection,
  [functionsCollectionName]: functionsCollection,
  [functionsV1CollectionName]: functionsV1Collection,
  [categoriesV1CollectionName]: categoriesV1Collection,
};
