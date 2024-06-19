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
        {libraries.map((library) => (
          <DropdownMenuItem key={library} className="capitalize">
            <a href={`/migrate/${library}`}>{library}</a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
