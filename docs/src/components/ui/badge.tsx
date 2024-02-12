import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
}

export const Badge = ({ className, children }: Props) => {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md border px-2.5 py-0.5 text-xs font-semibold capitalize",
        className,
      )}
    >
      {children}
    </div>
  );
};
