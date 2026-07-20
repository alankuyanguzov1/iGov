import { cn } from "@/lib/cn";

export type BadgeVariant = "neutral" | "solid" | "accent" | "outline";

const badgeVariants: Record<BadgeVariant, string> = {
  neutral: "border border-border text-muted",
  solid: "bg-fg text-white",
  accent: "bg-accent text-white",
  outline: "border border-accent text-accent",
};

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

export function Badge({ variant = "neutral", className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-xs font-medium",
        badgeVariants[variant],
        className,
      )}
      {...props}
    />
  );
}
