import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ReactNode } from "react";

export function MigrationSelectorIsland({
  libraries,
  children,
}: {
  readonly libraries: ReadonlyArray<string>;
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
          <a href={`/migrate/v1`}>Remeda@1.61.0</a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {libraries.map((library) => (
          <DropdownMenuItem key={library} className="capitalize">
            <a href={`/migrate/${library}`}>{library}</a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
