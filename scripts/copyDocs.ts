import fs from "node:fs/promises";
import path from "node:path";
import type { WritableDeep } from "type-fest";

/**
 * To avoid repeating comments between function overloads, we have a custom
 * `@copyDoc` JSDoc tag. Each `.d.cts` and `.d.ts` is processed.
 */
await copyDocs("dist");

type JSDocTag = Readonly<{
  /** Tag name, without the @. */
  name: string;
  /** Start line, relative to the start of the JSDoc tag. */
  start: number;
  /** End line, relative to the start of the JSDoc tag. */
  end: number;
  /** Lines belonging to the tag. */
  lines: ReadonlyArray<string>;
}>;

type JSDoc = Readonly<{
  /** Start line, relative to the file. */
  start: number;
  /** End line, relative to the file. */
  end: number;
  /** Lines belonging to the comment. */
  lines: ReadonlyArray<string>;
  /** JSDoc tags in the comment. */
  tags: ReadonlyArray<JSDocTag>;
}>;

/** Parse the JSDocs of a file. */
function getJSDocs(content: string): Array<JSDoc> {
  const result = [] as Array<JSDoc>;
  let doc = { start: -1, end: -1, lines: [], tags: [] } as WritableDeep<JSDoc>;
  let tag = {
    name: "",
    start: -1,
    end: -1,
    lines: [],
  } as WritableDeep<JSDocTag>;

  const endDoc = (index: number): void => {
    if (doc.start !== -1) {
      doc.end = index;
      result.push(doc);
      doc = { start: -1, end: -1, lines: [], tags: [] };
    }
  };
  const endTag = (index: number): void => {
    if (tag.name !== "") {
      tag.end = index;
      doc.tags.push(tag);
      tag = { name: "", start: -1, end: -1, lines: [] };
    }
  };

  for (const [index, line] of content.split("\n").entries()) {
    if (line.startsWith("/**")) {
      doc.start = index;
    }
    if (doc.start !== -1) {
      doc.lines.push(line);
    }

    const tagMatch = /@\w+/u.exec(line);
    if (tagMatch !== null) {
      endTag(index - 1);
      // Remove the `@` prefix:
      tag.name = tagMatch[0].slice(1);
      tag.start = index;
    }
    if (line.endsWith("*/")) {
      endTag(index - 1);
    }
    if (tag.name !== "") {
      tag.lines.push(line);
    }

    if (line.endsWith("*/")) {
      endDoc(index);
    }
  }

  return result;
}

function hasTag(doc: JSDoc, name: string): boolean {
  return doc.tags.some(({ name: tagName }) => tagName === name);
}

function editDoc(copyDoc: JSDoc, doc: JSDoc): JSDoc {
  let lines = hasTag(doc, "pasteDoc") ? [...copyDoc.lines] : [...doc.lines];

  lines = lines.filter((line) => !line.includes("@copyDoc"));

  if (hasTag(copyDoc, "dataFirst") && hasTag(doc, "dataLast")) {
    const signature = lines.findIndex((line) => line.includes("@signature"));
    if (signature !== -1) {
      lines.splice(signature, 1);
    }

    const firstParam = lines.findIndex((line) => line.includes("@param"));
    if (firstParam !== -1) {
      lines.splice(firstParam, 1);
    }

    lines = lines.map((line) => line.replace("@dataFirst", "@dataLast"));
  }

  return { ...doc, lines };
}

function replaceDocs(content: string, docs: ReadonlyArray<JSDoc>): string {
  const result = content.split("\n");

  // Process the docs in reverse order, so that the indices of docs appearing
  // earlier in the document remain correct.
  for (const { start, end, lines } of [...docs].sort(
    (a, b) => b.start - a.start,
  )) {
    result.splice(start, end - start + 1, ...lines);
  }

  return result.join("\n");
}

async function copyDocs(outputDirectory: string): Promise<void> {
  const files = await fs.readdir(outputDirectory);

  for await (const file of files) {
    if (!(file.endsWith(".d.cts") || file.endsWith(".d.ts"))) {
      continue;
    }

    const filePath = path.join(outputDirectory, file);
    const content = await fs.readFile(filePath, "utf8");

    const jsDocs = getJSDocs(content);
    const copyDoc = jsDocs.find((doc) => hasTag(doc, "copyDoc"));
    if (copyDoc === undefined) {
      continue;
    }

    const editedDocs = jsDocs.map((doc) => editDoc(copyDoc, doc));
    await fs.writeFile(filePath, replaceDocs(content, editedDocs));
  }
}
