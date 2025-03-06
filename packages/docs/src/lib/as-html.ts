import createDOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { parse as markedParse, type MarkedOptions } from "marked";

const MARKED_OPTIONS = {
  gfm: true,
} satisfies MarkedOptions;

const { window } = new JSDOM("");
const PURIFY = createDOMPurify(window);

/**
 * Convert markdown to HTML using marked and sanitized with DOMPurify.
 */
export async function asHtml(markdown: string): Promise<string> {
  const raw = await markedParse(markdown, MARKED_OPTIONS);
  return PURIFY.sanitize(raw);
}
