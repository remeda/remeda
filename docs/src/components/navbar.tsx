import { FunctionTag } from "@/components/function-tag";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMemo, useState, type ReactNode } from "react";

interface NavbarEntry {
  readonly name: string;
  readonly tags: ReadonlyArray<string>;
}

export type NavbarCategory = readonly [
  category: string,
  entries: ReadonlyArray<NavbarEntry>,
];

export function Navbar({
  entries,
  onSelect,
}: {
  readonly entries: ReadonlyArray<NavbarCategory>;
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
              : entries.filter(({ name }) =>
                  name.toLowerCase().includes(lowerCaseQuery),
                ),
          ] as const,
      )
      .filter(([, entries]) => entries.length > 0);
  }, [entries, query]);

  return (
    <nav className="h-full">
      <Input
        placeholder="Type to filter"
        value={query}
        onChange={({ currentTarget: { value } }) => {
          setQuery(value);
        }}
      />

      <ScrollArea className="h-full" barClassName="pt-6 pb-10">
        <ul className="space-y-2 pb-10 pl-1 pr-4 pt-6">
          {filteredEntries.map(([category, entries]) => (
            <li key={category}>
              <h4 className="px-2 py-1 text-lg font-semibold">{category}</h4>
              <ul>
                {entries.map((entry) => (
                  <li key={entry.name}>
                    <NavbarEntry onSelect={onSelect} {...entry} />
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

function NavbarEntry({
  name,
  tags,
  onSelect,
}: NavbarEntry & { readonly onSelect: (() => void) | undefined }): ReactNode {
  return (
    <a
      href={`/docs/#${name}`}
      className={cn([
        buttonVariants({ variant: "ghost" }),
        "text-muted-foreground",
        "flex w-full items-center justify-between gap-1",
      ])}
      onClick={onSelect}
    >
      {name}
      <span className="flex items-center gap-1">
        {tags.map((tag) => (
          <FunctionTag key={tag} tag={tag} className="px-1.5">
            {tag[0]}
          </FunctionTag>
        ))}
      </span>
    </a>
  );
}
