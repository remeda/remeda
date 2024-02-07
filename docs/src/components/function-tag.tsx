import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const tagToClass: Record<string, string> = {
  pipeable: "bg-green-600 text-green-50 dark:bg-green-500 dark:text-green-950",
  indexed: "bg-sky-600 text-sky-50 dark:bg-sky-500 dark:text-sky-950",
  strict: "bg-rose-600 text-rose-50 dark:bg-rose-500 dark:text-rose-950",
};

interface Props {
  tag: string;
  children?: React.ReactNode;
  className?: string;
}

export const FunctionTag = ({ tag, children, className }: Props) => {
  return (
    <Badge className={cn(tagToClass[tag], className)}>{children ?? tag}</Badge>
  );
};
