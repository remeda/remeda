import {
  commentParserToESTree,
  estreeToString,
  parseComment,
  type JsdocBlock,
} from "@es-joy/jsdoccomment";
import type { API, ASTPath, FileInfo } from "jscodeshift";
import type { ReadonlyDeep } from "type-fest";
import { clone, zip } from "../src";

/** Readonly prased JSDoc, with a reference to its path. */
type Jsdoc = ReadonlyDeep<
  JsdocBlock & {
    path: ASTPath;
  }
>;

function hasTag(doc: ReadonlyDeep<JsdocBlock>, name: string): boolean {
  return doc.tags.some(({ tag }) => tag === name);
}

function editDoc(
  sourceDoc: ReadonlyDeep<JsdocBlock>,
  targetDoc: ReadonlyDeep<JsdocBlock>,
): JsdocBlock {
  const resultDoc = clone(
    hasTag(targetDoc, "pasteDoc") ? sourceDoc : targetDoc,
  ) as JsdocBlock;

  resultDoc.tags = resultDoc.tags.filter(({ tag }) => tag !== "copyDoc");

  if (hasTag(sourceDoc, "dataFirst") && hasTag(targetDoc, "dataLast")) {
    const firstParam = resultDoc.tags.findIndex(({ tag }) => tag === "param");
    if (firstParam !== -1) {
      resultDoc.tags.splice(firstParam, 1);
    }

    for (const tag of resultDoc.tags) {
      if (tag.tag === "dataFirst") {
        tag.tag = "dataLast";
      }
    }
  }

  if (hasTag(targetDoc, "pasteDoc")) {
    for (const targetTag of targetDoc.tags) {
      const resultTag = resultDoc.tags.find(({ tag }) => tag === targetTag.tag);
      if (resultTag !== undefined) {
        Object.assign(resultTag, targetTag);
      }
    }
  }

  return resultDoc;
}

export default function transformer(
  file: ReadonlyDeep<FileInfo>,
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types -- don't know why this isn't readonly?
  api: ReadonlyDeep<API>,
): string {
  const root = api.jscodeshift(file.source);

  const jsdocs: Array<Jsdoc> = [];

  // eslint-disable-next-line unicorn/no-array-for-each -- only supports forEach
  root.find(api.jscodeshift.TSDeclareFunction).forEach((path) => {
    if (path.node.comments === null || path.node.comments === undefined) {
      return;
    }

    jsdocs.push(
      ...path.node.comments.map((comment) => ({
        ...commentParserToESTree(parseComment(comment), "jsdoc", {
          spacing: "preserve",
        }),
        path,
      })),
    );
  });

  const sourceDoc = jsdocs.find((doc) => hasTag(doc, "copyDoc"));
  if (sourceDoc !== undefined) {
    // eslint-disable-next-line unicorn/no-array-for-each -- only supports forEach
    root.find(api.jscodeshift.TSDeclareFunction).forEach((path) => {
      if (path.node.comments === null || path.node.comments === undefined) {
        return;
      }

      const jsdocsForPath = jsdocs.filter((doc) => doc.path === path);

      for (const [comment, jsdoc] of zip(path.node.comments, jsdocsForPath)) {
        // The first and last two characters after stringifying are /* and */;
        // the value shouldn't include them.
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        comment.value = estreeToString(editDoc(sourceDoc, jsdoc)).slice(2, -2);
      }
    });
  }

  return root.toSource();
}

export const parser = "ts";
