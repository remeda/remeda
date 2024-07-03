import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Library } from "@/lib/mappings";
import type { ReactNode } from "react";

export function MigrationSelectorIsland({
  libraries,
  children,
}: {
  readonly libraries: ReadonlyArray<Library>;
  readonly children: ReactNode;
}) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <button type="button" className="truncate">
          {children}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <a href={`/v1`}>Migrate from 1.x to 2.x</a>
        </DropdownMenuItem>
        {libraries.map((library) => (
          <DropdownMenuItem key={library} className="capitalize">
            <a href={`/migrate/${library}`}>{library}</a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
