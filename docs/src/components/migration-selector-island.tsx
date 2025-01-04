import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ALL_LIBRARIES } from "@/lib/mappings";
import type { ReactNode } from "react";

export function MigrationSelectorIsland({
  children,
}: {
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
          <a href={`/v1`}>Remeda@1.61.0</a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {ALL_LIBRARIES.map((library) => (
          <DropdownMenuItem key={library} className="capitalize">
            <a href={`/migrate/${library}`}>{library}</a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
