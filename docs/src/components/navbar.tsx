import { useMemo, useState } from "react";

import { badgeVariants, type BadgeProps } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { toPairs } from "../../../src";

const tagToColor: Record<string, BadgeProps["variant"]> = {
  pipeable: "success",
  indexed: "secondary",
  strict: "destructive",
};

export const Navbar = ({
  entries,
  onSelect,
}: {
  entries: Record<string, Array<{ name: string; tags: Array<string> }>>;
  onSelect?: () => void;
}) => {
  const [query, setQuery] = useState("");

  const pairs = useMemo(() => toPairs(entries), [entries]);

  const filteredEntries = useMemo(
    () =>
      pairs
        .map(
          ([category, funcs]) =>
            [
              category,
              funcs.filter((func) =>
                func.name.toLowerCase().includes(query.toLowerCase()),
              ),
            ] as const,
        )
        .filter(([_, funcs]) => funcs.length > 0),
    [pairs, query],
  );

  return (
    <nav className="h-full">
      <Input
        placeholder="Type to filter"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <ScrollArea className="h-full" barClassName="pt-6 pb-10">
        <ul className="space-y-2 pb-10 pl-1 pr-4 pt-6">
          {filteredEntries.map(([category, functions]) => (
            <li key={category}>
              <h4 className="px-2 py-1 text-lg font-semibold">{category}</h4>

              <ul>
                {functions.map((func) => (
                  <li key={func.name}>
                    <a
                      href={`#${func.name}`}
                      className={cn([
                        buttonVariants({ variant: "ghost" }),
                        "text-muted-foreground",
                        "flex w-full items-center justify-between gap-1",
                      ])}
                      onClick={() => onSelect?.()}
                    >
                      {func.name}

                      <span className="flex items-center gap-1">
                        {func.tags.map((tag) => (
                          <span
                            key={tag}
                            className={cn(
                              badgeVariants({
                                variant: tagToColor[tag],
                              }),
                              "w-6 p-0 py-0.5 capitalize",
                            )}
                          >
                            {tag[0]}
                          </span>
                        ))}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </ScrollArea>
    </nav>
  );
};
