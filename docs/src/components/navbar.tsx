import { FunctionTag } from "@/components/function-tag";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import FUNCTIONS from "@/data/functions.json";
import { getTags } from "@/lib/get-tags";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import { groupBy, map, pipe, toPairs } from "remeda";

export const Navbar = ({ onSelect }: { onSelect?: () => void }) => {
  const [query, setQuery] = useState("");

  const pairs = useMemo(
    () =>
      pipe(
        FUNCTIONS,
        map((func) => ({
          category: func.category,
          name: func.name,
          tags: getTags(func),
        })),
        groupBy((func) => func.category),
        toPairs,
      ),
    [],
  );

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
        .filter(([, funcs]) => funcs.length > 0),
    [pairs, query],
  );

  return (
    <nav className="h-full">
      <Input
        placeholder="Type to filter"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
        }}
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
                      onClick={onSelect}
                    >
                      {func.name}

                      <span className="flex items-center gap-1">
                        {func.tags.map((tag) => (
                          <FunctionTag key={tag} tag={tag} className="px-1.5">
                            {tag[0]}
                          </FunctionTag>
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
