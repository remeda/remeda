import type { Tag } from "@/lib/get-tags";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";
import { Badge } from "./ui/badge";

const TAG_COLOR = {
  Lazy: "bg-green-600 text-green-50 hover:bg-green-600/80 dark:bg-green-500 dark:text-green-950",

  Indexed:
    "bg-purple-600 text-purple-50 hover:bg-purple-600/80 dark:bg-purple-500 dark:text-purple-950",

  Strict:
    "bg-rose-600 text-rose-50 hover:bg-rose-600/80 dark:bg-rose-500 dark:text-rose-950",
} as const satisfies Readonly<Record<Tag, string>>;

export function TagBadge({
  tag,
  abbreviated = false,
  className = "",
}: {
  readonly tag: Tag;
  readonly abbreviated?: boolean;
  readonly className?: string | undefined;
}): ReactNode {
  return (
    <Badge className={cn([TAG_COLOR[tag], className])} title={tag}>
      {abbreviated ? tag[0] : tag}
    </Badge>
  );
}
