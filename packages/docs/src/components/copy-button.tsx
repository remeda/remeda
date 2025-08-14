import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useCallback, useState, type ReactNode } from "react";

const COPIED_TIMEOUT = 2000;

export function CopyButton({
  value,
  className,
}: {
  readonly value: string;
  readonly className?: string;
}): ReactNode {
  const [hasCopied, setHasCopied] = useState(false);

  const handleClick = useCallback(() => {
    const asyncHandle = async () => {
      await navigator.clipboard.writeText(value);
      setHasCopied(true);
      setTimeout(() => {
        setHasCopied(false);
      }, COPIED_TIMEOUT);
    };
    void asyncHandle();
  }, [value]);

  return (
    <Button
      className={cn("relative z-10 size-6", className)}
      size="icon"
      variant="ghost"
      onClick={handleClick}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? (
        <CheckIcon className="size-3" />
      ) : (
        <CopyIcon className="size-3" />
      )}
    </Button>
  );
}
