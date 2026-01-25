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
      apiKey={API_KEY}
      appId={APP_ID}
      indices={[INDEX_NAME]}
      // eslint-disable-next-line react/jsx-no-bind -- This callback doesn't need to be stable because it is only used during render. @see https://github.com/algolia/docsearch/blob/104f7d1a986d1aef3d85f8dbca3e7197e66bf067/packages/docsearch-react/src/NoResultsScreen.tsx#L65-L74
      getMissingResultsUrl={({ query }) => {
        const issuesUrl = new URL("issues/new", REPO_URL);
        issuesUrl.searchParams.set("title", `Missing function: ${query}`);
        issuesUrl.searchParams.set("labels", LABELS);
        return issuesUrl.toString();
      }}
      // TODO [@docsearch/react@>4.5.3]: Check if @algolia/autocomplete-core is still needed. There's a bug in the Algolia code when trying to define a navigator due to missing types in their package due to the core package being moved to dev dependencies.
      navigator={{
        // When navigating to another hash on the same page via "Enter" there
        // is a bug (in Algolia or Astro) where the scroll position is reset to
        // the  previous hash after the browser location is assigned. We hook
        // into the Algolia navigator in order to provide a fix.
        // Additionally, Algolia only works on the production site, and when
        // the search is used on other deployments it redirects to the
        // production site, which isn't ideal for holistic testing, we also
        // solve that in this wrapper.
        // TODO: This bug also appears in other sites using Algolia and Astro, most notably the Astro documentation site. It's likely that a proper fix would eventually be shipped and we can remove this workaround.
        navigate: ({ itemUrl }) => {
          // Our search results are always on the same origin, but Algolia's
          // API always return absolute URLs on the production site. In order
          // to allow searching within the local dev and staging environments
          // we need to rewrite the origin in the URL.
          const originalDestination = new URL(itemUrl);
          const destination = new URL(
            `${originalDestination.pathname}${originalDestination.search}${originalDestination.hash}`,
            globalThis.location.origin,
          );

          const goToResult = () => {
            // The default implementation of the Algolia 'navigate' action
            // @see https://www.algolia.com/doc/ui-libraries/autocomplete/core-concepts/keyboard-navigation/
            globalThis.location.assign(destination.toString());
          };

          if (
            globalThis.location.hash !== "" &&
            globalThis.location.pathname === destination.pathname &&
            globalThis.location.hash !== destination.hash
          ) {
            // We defer the update so that it fires after the code in the
            // Algolia/Astro infra that resets the scroll position when
            // handling the Enter key press.
            setTimeout(goToResult);
          } else {
            // Otherwise, run as usual (immediately).
            goToResult();
          }
        },
      }}
    />
  );
}
