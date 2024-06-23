import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Tag } from "@/lib/get-tags";
import { cn } from "@/lib/utils";
import { type ReactNode } from "react";
import { TagBadge } from "./tag-badge";

type NavbarEntry = {
  readonly title: string;
  readonly slug?: string;
  readonly tags?: ReadonlyArray<Tag>;
};

export type NavbarCategory = readonly [
  category: string,
  entries: ReadonlyArray<NavbarEntry>,
];

export function Navbar({
  entries,
  children,
  onSelect,
}: {
  readonly entries: ReadonlyArray<NavbarCategory>;
  readonly children?: ReactNode;
  readonly onSelect?: () => void;
}): ReactNode {
  return (
    <nav className="flex h-full flex-col items-stretch gap-4">
      {children}
      <ScrollArea className="flex-1">
        <ul className="flex flex-col gap-2">
          {entries.map(([category, entries]) => (
            <li key={category}>
              <h4 className="px-2 py-1 text-lg font-semibold">{category}</h4>
              <ul>
                {entries.map((entry) => (
                  <li key={entry.title}>
                    <NavbarItem onSelect={onSelect} {...entry} />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </nav>
  );
}

function NavbarItem({
  title,
  slug,
  tags,
  onSelect,
}: NavbarEntry & {
  readonly onSelect?: (() => void) | undefined;
}): ReactNode {
  return (
    <a
      href={`#${slug ?? title}`}
      className={cn([
        buttonVariants({ variant: "ghost" }),
        "text-muted-foreground",
        "flex w-full items-center justify-between gap-1",
      ])}
      onClick={onSelect}
    >
      {title}
      <span className="flex items-center gap-1 empty:hidden">
        {tags?.map((tag) => (
          <TagBadge
            key={tag}
            tag={tag}
            abbreviated
            className="flex h-7 w-5 justify-center"
          />
        ))}
      </span>
    </a>
  );
}
