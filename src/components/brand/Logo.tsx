import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  showTagline = false,
}: {
  className?: string;
  showTagline?: boolean;
}) {
  return (
    <Link to="/" className={cn("group flex min-w-0 items-center gap-3", className)}>
      <img
        src="/resourcex-logo.jpg.png"
        alt="ResourceX logo"
        className="h-10 w-10 shrink-0 rounded-xl border border-border object-cover"
      />
      <span className="min-w-0">
        <span className="block truncate text-base font-extrabold tracking-[0.16em] text-foreground">
          RESOURCE<span className="text-primary">X</span>
        </span>
        {showTagline && (
          <span className="block truncate text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            B2B Hospitality Resource Exchange
          </span>
        )}
      </span>
    </Link>
  );
}
