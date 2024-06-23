import "@docsearch/css";
import { DocSearch } from "@docsearch/react";
import type { ReactNode } from "react";

const APP_ID = "416K8H7DAR";
const API_KEY = "7c92aad50515bafebb1a18df9e7044f7";
const INDEX_NAME = "remedajs";

const REPO_URL = "https://github.com/remeda/remeda/";

// We use a label to make it easier to filter issues coming from this flow...
const LABELS = "docsearch";

export function Search(): ReactNode {
  return (
    <DocSearch
      appId={APP_ID}
      indexName={INDEX_NAME}
      apiKey={API_KEY}
      getMissingResultsUrl={getMissingResultsUrl}
    />
  );
}

function getMissingResultsUrl({ query }: { readonly query: string }): string {
  const issuesUrl = new URL("issues/new", REPO_URL);
  issuesUrl.searchParams.set("title", `Missing function: ${query}`);
  issuesUrl.searchParams.set("labels", LABELS);
  return issuesUrl.toString();
}
