import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",

        // Our custom variants
        pipeable:
          "border-transparent bg-green-600 text-green-50 shadow hover:bg-green-600/80 dark:bg-green-500 dark:text-green-950",

        indexed:
          "border-transparent bg-sky-600 text-sky-50 shadow hover:bg-sky-600/80 dark:bg-sky-500 dark:text-sky-950",
        strict:
          "border-transparent bg-rose-600 text-rose-50 shadow hover:bg-rose-600/80 dark:bg-rose-500 dark:text-rose-950",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
