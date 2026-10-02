import { cn } from "@/lib/utils";

const tone: Record<string, string> = {
  Confirmed: "border-primary/40 bg-primary/10 text-primary",
  Accepted: "border-primary/40 bg-primary/10 text-primary",
  Completed: "border-border bg-secondary text-muted-foreground",
  Upcoming: "border-primary/25 bg-primary/5 text-primary-glow",
  "In Progress": "border-primary/40 bg-primary/10 text-primary-glow",
  Pending: "border-warning/40 bg-warning/10 text-warning",
  Negotiating: "border-primary-glow/40 bg-primary-glow/10 text-primary-glow",
  Rejected: "border-destructive/40 bg-destructive/10 text-destructive",
  Cancelled: "border-destructive/40 bg-destructive/10 text-destructive",
  Active: "border-primary/40 bg-primary/10 text-primary",
  Paused: "border-border bg-secondary text-muted-foreground",
  "Held in Escrow": "border-primary/40 bg-primary/10 text-primary",
  Released: "border-primary/40 bg-primary/10 text-primary",
  Verified: "border-primary/40 bg-primary/10 text-primary",
  "Pending Verification": "border-warning/40 bg-warning/10 text-warning",
  Unverified: "border-border bg-secondary text-muted-foreground",
};


export function StatusPill({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        tone[status] ?? "border-border bg-secondary text-muted-foreground",
        className,
      )}
    >
      {status}
    </span>
  );
}
