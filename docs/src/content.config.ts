import {
  collection as docsArticlesCollection,
  name as docsArticlesName,
} from "@/content/docs-articles/content.config";
import {
  categoriesCollection,
  categoriesCollectionName,
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
  collection as mappingCollection,
  name as mappingName,
} from "@/content/mapping/content.config";
import {
  collection as v1MigrationCollection,
  name as v1MigrationName,
} from "@/content/v1-migration/content.config";

export const collections = {
  [docsArticlesName]: docsArticlesCollection,
  [mappingName]: mappingCollection,
  [v1MigrationName]: v1MigrationCollection,
  [functionsCollectionName]: functionsCollection,
  [categoriesCollectionName]: categoriesCollection,
  [functionsV1CollectionName]: functionsV1Collection,
  [categoriesV1CollectionName]: categoriesV1Collection,
};
