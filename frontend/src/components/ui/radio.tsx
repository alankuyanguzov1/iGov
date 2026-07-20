"use client";

import { cn } from "@/lib/cn";

type RadioProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  description?: string;
};

export function Radio({ label, description, className, ...props }: RadioProps) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 select-none",
        props.disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
        <input
          type="radio"
          className={cn(
            "peer size-5 appearance-none rounded-sm border border-border bg-bg",
            "transition-colors checked:border-accent",
            "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:outline-none",
          )}
          {...props}
        />
        <span
          className="pointer-events-none absolute size-2.5 rounded-sm bg-accent opacity-0 transition-opacity peer-checked:opacity-100"
          aria-hidden
        />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-fg">{label}</span>
        {description && <span className="text-sm text-muted">{description}</span>}
      </span>
    </label>
  );
}
