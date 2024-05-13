import type { Tag } from "@/lib/get-tags";
import type { ReactNode } from "react";
import { Badge } from "./ui/badge";

const TAG_COLOR = {
  lazy: "bg-green-600 text-green-50 hover:bg-green-600/80 dark:bg-green-500 dark:text-green-950",

  indexed:
    "bg-purple-600 text-purple-50 hover:bg-purple-600/80 dark:bg-purple-500 dark:text-purple-950",

  strict:
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
    <Badge className={`capitalize ${TAG_COLOR[tag]} ${className}`}>
      {abbreviated ? tag[0] : tag}
    </Badge>
  );
}
