import { useState, useCallback } from "react";
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";

const COPIED_TIMEOUT = 2000;

async function copyToClipboard(value: string) {
  navigator.clipboard.writeText(value);
}

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const [hasCopied, setHasCopied] = useState(false);

  const handleClick = useCallback(() => {
    copyToClipboard(value);
    setHasCopied(true);
    setTimeout(() => {
      setHasCopied(false);
    }, COPIED_TIMEOUT);
  }, [value]);

  return (
    <Button
      size="icon"
      variant="ghost"
      className="relative z-10 h-6 w-6"
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
