import type { Tag } from "@/lib/get-tags";
import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { buttonVariants } from "@shadcn/button";
import { Input } from "@shadcn/input";
import { ScrollArea } from "@shadcn/scroll-area";
import { useMemo, useState, type ReactNode } from "react";
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
  const [query, setQuery] = useState("");

  const filteredEntries = useMemo(() => {
    const lowerCaseQuery = query.toLowerCase();
    return entries
      .map(
        ([category, entries]) =>
          [
            category,
            category.toLowerCase().startsWith(lowerCaseQuery)
              ? entries
              : entries.filter(({ title }) =>
                  title.toLowerCase().includes(lowerCaseQuery),
                ),
          ] as const,
      )
      .filter(([, entries]) => entries.length > 0);
  }, [entries, query]);

  return (
    <nav className="flex h-full flex-col items-stretch gap-4">
      {children}
      <div className="relative">
        <Input
          className="peer pl-7"
          placeholder="Search"
          value={query}
          onChange={({ currentTarget: { value } }) => {
            setQuery(value);
          }}
        />
        <MagnifyingGlassIcon className="absolute left-0 top-0 my-3 ml-2 text-muted-foreground" />
      </div>
      <ScrollArea className="flex-1">
        <ul className="flex flex-col gap-2">
          {filteredEntries.map(([category, entries]) => (
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
