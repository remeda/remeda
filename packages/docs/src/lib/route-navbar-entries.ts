import { forNavbar, getFunctions } from "./functions/entries";
import {
  getMigrationMappings,
  forNavbar as migrationMappingsForNavBar,
} from "./mapping/entries";
import {
  getV1Functions,
  forNavbar as v1FunctionsForNavbar,
} from "./v1/entries";

/**
 * The mobile navbar is part of the header which is part of the general layout
 * and doesn't have access to the data in the specific pages. This means we need
 * to sync the logic for what entries it should show with the routing logic for
 * our pages.
 */
export async function getRouteNavbarEntries(
  pathname: string,
  migrationLibrary: string | undefined,
) {
  if (migrationLibrary === "v1") {
    return v1FunctionsForNavbar(await getV1Functions());
  }

  if (migrationLibrary !== undefined) {
    return migrationMappingsForNavBar(
      await getMigrationMappings(migrationLibrary),
    );
  }

  if (pathname === "/docs") {
    return forNavbar(await getFunctions());
  }

  return [];
}
