import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
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
      size="icon"
      variant="ghost"
      className={cn("relative z-10 h-6 w-6", className)}
      onClick={handleClick}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? (
        <CheckIcon className="h-3 w-3" />
      ) : (
        <CopyIcon className="h-3 w-3" />
      )}
    </Button>
  );
}
